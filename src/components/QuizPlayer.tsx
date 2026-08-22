'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  Lightbulb,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  RotateCcw,
  List,
  Award,
  Star,
  BookOpen,
  Sparkles,
  Check
} from 'lucide-react';
import { Question, Lesson, LessonResult } from '@/types/quiz';
import {
  getUserStats,
  saveLessonResult,
  toggleBookmark,
  recordMistakes
} from '@/lib/storage';
import {
  syncLessonResultToSupabase,
  syncMistakesToSupabase,
  syncBookmarksToSupabase
} from '@/lib/repository';
import { soundFx } from '@/lib/audio';
import PairMatchingWidget from '@/components/PairMatchingWidget';

interface QuizPlayerProps {
  lesson: Lesson;
  unitTitle: string;
  courseId: string;
}

function shuffleOptionsForQuestions(qs: Question[]): Question[] {
  return qs.map((q) => {
    const pairs = q.options.map((optText, idx) => ({
      text: optText,
      isCorrect: idx === q.answerIndex,
    }));

    // Fisher-Yates shuffle algorithm
    for (let i = pairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }

    const newOptions = pairs.map((p) => p.text) as [string, string, string, string];
    const newAnswerIndex = pairs.findIndex((p) => p.isCorrect);

    return {
      ...q,
      options: newOptions,
      answerIndex: newAnswerIndex,
    };
  });
}

export default function QuizPlayer({ lesson, unitTitle, courseId }: QuizPlayerProps) {
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>(() =>
    shuffleOptionsForQuestions(lesson.questions)
  );

  const questions = shuffledQuestions.length > 0 ? shuffledQuestions : lesson.questions;
  const total = questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerConfirmed, setIsAnswerConfirmed] = useState(false);
  const [answersState, setAnswersState] = useState<('correct' | 'wrong')[]>([]);
  const [userScore, setUserScore] = useState(0);
  const [wrongQuestionIds, setWrongQuestionIds] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Match question state
  const [isMatchFullyConnected, setIsMatchFullyConnected] = useState(false);
  const [isMatchAllCorrect, setIsMatchAllCorrect] = useState(false);

  const explanationRef = useRef<HTMLDivElement>(null);
  const quizContainerRef = useRef<HTMLDivElement>(null);

  const currentQ: Question = questions[currentIndex];

  const handleRestartQuiz = () => {
    setShuffledQuestions(shuffleOptionsForQuestions(lesson.questions));
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerConfirmed(false);
    setAnswersState([]);
    setUserScore(0);
    setWrongQuestionIds([]);
    setIsQuizCompleted(false);
    setIsMatchFullyConnected(false);
    setIsMatchAllCorrect(false);
  };

  useEffect(() => {
    setShuffledQuestions(shuffleOptionsForQuestions(lesson.questions));
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerConfirmed(false);
    setAnswersState([]);
    setUserScore(0);
    setWrongQuestionIds([]);
    setIsQuizCompleted(false);
    setIsMatchFullyConnected(false);
    setIsMatchAllCorrect(false);
  }, [lesson.id, lesson.questions]);

  // Reset match state when switching questions
  useEffect(() => {
    setSelectedOption(null);
    setIsAnswerConfirmed(false);
    setIsMatchFullyConnected(false);
    setIsMatchAllCorrect(false);
  }, [currentIndex]);

  useEffect(() => {
    const stats = getUserStats();
    setBookmarks(stats.bookmarks);
    setSoundEnabled(stats.soundEnabled);
  }, []);

  useEffect(() => {
    if (isAnswerConfirmed && explanationRef.current) {
      setTimeout(() => {
        explanationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [isAnswerConfirmed]);

  // Highlight option without instant grading
  const handleSelectOption = (index: number) => {
    if (isAnswerConfirmed) return;
    setSelectedOption(index);
    soundFx.playClick(soundEnabled);
  };

  // Confirm answer button click -> Grade answer now
  const handleConfirmAnswer = () => {
    if (isAnswerConfirmed) return;

    let isCorrect = false;
    if (currentQ.matchPairs && currentQ.matchPairs.length > 0) {
      if (!isMatchFullyConnected) return;
      isCorrect = isMatchAllCorrect;
    } else {
      if (selectedOption === null) return;
      isCorrect = selectedOption === currentQ.answerIndex;
    }

    setIsAnswerConfirmed(true);
    const newAnswers: ('correct' | 'wrong')[] = [...answersState, isCorrect ? 'correct' : 'wrong'];
    setAnswersState(newAnswers);

    if (isCorrect) {
      setUserScore((prev) => prev + 1);
      soundFx.playCorrect(soundEnabled);
    } else {
      setWrongQuestionIds((prev) => [...prev, currentQ.id]);
      soundFx.playIncorrect(soundEnabled);
    }
  };

  const handleNextQuestion = () => {
    soundFx.playClick(soundEnabled);
    if (currentIndex + 1 < total) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerConfirmed(false);

      // Scroll to proper position at top of quiz container
      setTimeout(() => {
        if (quizContainerRef.current) {
          quizContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 50);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsQuizCompleted(true);
    const scorePct = Math.round((userScore / total) * 100);
    const passed = scorePct >= 80;

    let stars = 1;
    if (userScore === total) stars = 3;
    else if (passed) stars = 2;

    const result: LessonResult = {
      lessonId: lesson.id,
      score: userScore,
      totalQuestions: total,
      percentage: scorePct,
      passed,
      stars,
      completedAt: new Date().toISOString(),
    };

    saveLessonResult(result, courseId);
    recordMistakes(wrongQuestionIds);

    // Sync with Supabase PostgreSQL database
    syncLessonResultToSupabase(result, courseId);
    syncMistakesToSupabase(wrongQuestionIds);

    if (passed) {
      soundFx.playFanfare(soundEnabled);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.error('Confetti error:', err);
      }
    }
  };

  const handleToggleBookmarkCurrent = () => {
    const newState = toggleBookmark(currentQ.id);
    setBookmarks((prev) =>
      newState ? [...prev, currentQ.id] : prev.filter((id) => id !== currentQ.id)
    );
    syncBookmarksToSupabase(currentQ.id, newState);
    soundFx.playClick(soundEnabled);
  };

  const isBookmarked = bookmarks.includes(currentQ.id);

  // ------------------------------------------------------------------
  // COMPLETION VIEW
  // ------------------------------------------------------------------
  if (isQuizCompleted) {
    const pct = Math.round((userScore / total) * 100);
    const passed = pct >= 80;
    const stars = userScore === total ? 3 : passed ? 2 : 1;

    return (
      <div className="max-w-xl mx-auto py-8 px-4">
        <div className="glass-card rounded-3xl p-6 md:p-8 text-center border border-cyan-500/30 shadow-2xl relative overflow-hidden">
          {/* Top Decorative Banner */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />

          {/* Trophy / Status Icon */}
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/30 border border-cyan-400/30 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            {passed ? (
              <Award className="w-10 h-10 text-cyan-600 fill-cyan-400/20" />
            ) : (
              <RotateCcw className="w-10 h-10 text-amber-500" />
            )}
          </div>

          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
            {passed ? 'レッスンクリア！ 🎉' : 'もう少しで合格！'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-bold">
            {lesson.title.replace(/^Lesson\s*\d+[-_]\d+:\s*/i, '')}
          </p>

          {/* Stars Display */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3].map((starIdx) => (
              <Star
                key={starIdx}
                className={`w-8 h-8 transition-all ${
                  starIdx <= stars
                    ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] scale-110'
                    : 'text-slate-300 dark:text-slate-700 fill-slate-200 dark:fill-slate-800'
                }`}
              />
            ))}
          </div>

          {/* Score Box */}
          <div className="bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-6 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">正解数</p>
              <p className="text-2xl font-black text-cyan-600 dark:text-cyan-400">
                {userScore} / {total} 問
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">正解率</p>
              <p className={`text-2xl font-black ${passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {pct}%
              </p>
            </div>
          </div>

          {/* Feedback Msg */}
          <div className="text-xs text-slate-700 dark:text-slate-300 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-500/20 rounded-xl p-3 mb-6">
            {passed
              ? '素晴らしい理解度です！80%以上の合格基準をクリアしました。次のレッスンへ進みましょう。'
              : '80%以上のクリア基準に届きませんでした。解説を見直してもう一度挑戦しましょう！'}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleRestartQuiz}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              もう一度挑戦
            </button>

            <Link
              href={`/course/${courseId}`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <List className="w-4 h-4" />
              レッスン一覧へ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // ACTIVE QUIZ RUNNER VIEW
  // ------------------------------------------------------------------
  return (
    <div ref={quizContainerRef} className="max-w-4xl mx-auto py-2 sm:py-4 px-3 sm:px-6 scroll-mt-16 md:scroll-mt-20">
      {/* Header Info Bar */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="text-xs sm:text-sm font-bold text-cyan-700 dark:text-cyan-400 truncate">
          {unitTitle}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleToggleBookmarkCurrent}
            className={`p-1.5 sm:p-2 rounded-xl border transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
              isBookmarked
                ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-500/50 text-amber-700 dark:text-amber-400'
                : 'bg-white/80 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
            title={isBookmarked ? 'ブックマーク解除' : 'ブックマーク登録'}
          >
            {isBookmarked ? (
              <>
                <BookmarkCheck className="w-4 h-4 fill-amber-400/20 text-amber-600" />
                <span className="hidden sm:inline">保存済み</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span className="hidden sm:inline">ブックマーク</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Dots Bar (1..10) */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-3 sm:p-4 mb-6 flex items-center justify-between gap-2 border border-sky-200/80 shadow-sm whitespace-nowrap overflow-x-auto">
        <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-between shrink-0">
          {questions.map((q, idx) => {
            const isCurrent = idx === currentIndex;
            const state = answersState[idx];

            let dotStyle = 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500';
            if (isCurrent) {
              dotStyle = 'bg-cyan-600 dark:bg-cyan-500 border-cyan-400 text-white ring-2 ring-cyan-400/40 dot-active';
            } else if (state === 'correct') {
              dotStyle = 'bg-emerald-500 border-emerald-400 text-white';
            } else if (state === 'wrong') {
              dotStyle = 'bg-rose-500 border-rose-400 text-white';
            }

            return (
              <div
                key={q.id}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border text-xs sm:text-sm font-black flex items-center justify-center transition-all ${dotStyle}`}
              >
                {idx + 1}
              </div>
            );
          })}
        </div>
        <span className="text-xs sm:text-sm font-black text-slate-600 dark:text-slate-400 ml-3 shrink-0">
          {currentIndex + 1} / {total}
        </span>
      </div>

      {/* Question Main Content Area (No restrictive outer container box) */}
      <div className="space-y-6">
        {/* Question Header & Title */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs sm:text-sm font-black text-cyan-800 dark:text-cyan-300 bg-cyan-100/90 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-500/30 px-3 py-1 rounded-full whitespace-nowrap shrink-0 shadow-sm">
              第 {currentIndex + 1} 問
            </span>
            <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate min-w-0 font-bold">
              {lesson.title.replace(/^Lesson\s*\d+[-_]\d+:\s*/i, '')}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100 leading-relaxed sm:leading-loose">
            {currentQ.question}
          </h2>
        </div>

        {/* SDGs Goal Tiles (if present) */}
        {currentQ.sdgsGoals && currentQ.sdgsGoals.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {currentQ.sdgsGoals.map((goalNum) => {
              const info: Record<number, { id: string; title: string; color: string }> = {
                3: { id: '目標 3', title: 'すべての人に健康と福祉を', color: '#4C9F38' },
                6: { id: '目標 6', title: '安全な水とトイレを世界中に', color: '#26BDE2' },
                7: { id: '目標 7', title: 'エネルギーをみんなにそしてクリーンに', color: '#FCC30B' },
                9: { id: '目標 9', title: '産業と技術革新の基盤をつくろう', color: '#FD6925' },
                11: { id: '目標 11', title: '住み続けられるまちづくりを', color: '#FD9D24' },
                14: { id: '目標 14', title: '海の豊かさを守ろう', color: '#007DBC' },
              };
              const sdg = info[goalNum];
              if (!sdg) return null;
              const isGoal7 = goalNum === 7;

              return (
                <div
                  key={goalNum}
                  className="rounded-2xl p-3.5 shadow-md flex flex-col justify-between transition-transform hover:scale-105 border border-white/20"
                  style={{ backgroundColor: sdg.color, color: isGoal7 ? '#0f172a' : '#ffffff' }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-xs font-black px-2 py-0.5 rounded ${isGoal7 ? 'bg-black/10' : 'bg-black/20'}`}>
                      {sdg.id}
                    </span>
                    <span className="text-[10px] font-black tracking-wider uppercase opacity-80">
                      SDGs
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-black leading-tight">
                    {sdg.title}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Match Pairs Widget OR 4 Options Grid */}
        {currentQ.matchPairs && currentQ.matchPairs.length > 0 ? (
          <PairMatchingWidget
            pairs={currentQ.matchPairs}
            extraRightItems={currentQ.extraRightItems}
            leftTitle={currentQ.leftTitle}
            rightTitle={currentQ.rightTitle}
            isConfirmed={isAnswerConfirmed}
            onSelectionChange={(full, correct) => {
              setIsMatchFullyConnected(full);
              setIsMatchAllCorrect(correct);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:gap-3.5">
            {currentQ.options.map((optionText, optIdx) => {
              const isSelected = selectedOption === optIdx;
              const isCorrectOption = optIdx === currentQ.answerIndex;

              let btnStyle = 'bg-white dark:bg-slate-800/90 border-slate-200/90 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-cyan-400 hover:bg-cyan-50/40 dark:hover:bg-slate-700/80 shadow-sm hover:shadow-md';
              let labelBadgeStyle = 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600';

              if (!isAnswerConfirmed) {
                if (isSelected) {
                  btnStyle = 'bg-cyan-50/90 dark:bg-cyan-950/70 border-cyan-500 text-cyan-950 dark:text-cyan-100 ring-2 ring-cyan-500/40 font-bold shadow-md';
                  labelBadgeStyle = 'bg-cyan-600 text-white border-cyan-600';
                }
              } else {
                // Graded state
                if (isCorrectOption) {
                  btnStyle = 'bg-emerald-50/95 dark:bg-emerald-950/80 border-emerald-500 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/50 shadow-md';
                  labelBadgeStyle = 'bg-emerald-600 text-white border-emerald-600';
                } else if (isSelected && !isCorrectOption) {
                  btnStyle = 'bg-rose-50/95 dark:bg-rose-950/80 border-rose-500 text-rose-950 dark:text-rose-100 ring-2 ring-rose-500/50 shadow-md';
                  labelBadgeStyle = 'bg-rose-600 text-white border-rose-600';
                } else {
                  btnStyle = 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800 text-slate-400 dark:text-slate-500 opacity-50';
                }
              }

              const labels = ['A', 'B', 'C', 'D'];

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={isAnswerConfirmed}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-start gap-3.5 sm:gap-4 text-base sm:text-lg font-bold leading-relaxed ${btnStyle} ${
                    !isAnswerConfirmed ? 'cursor-pointer active:scale-[0.99]' : 'cursor-default'
                  }`}
                >
                  <span className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-sm sm:text-base font-black flex items-center justify-center shrink-0 mt-0.5 transition-colors ${labelBadgeStyle}`}>
                    {labels[optIdx]}
                  </span>
                  <span className="flex-1 leading-relaxed">{optionText}</span>

                  {!isAnswerConfirmed && isSelected && (
                    <Check className="w-6 h-6 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                  )}

                  {isAnswerConfirmed && isCorrectOption && (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  {isAnswerConfirmed && isSelected && !isCorrectOption && (
                    <XCircle className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Confirm Answer Button (Before Grading) */}
        {!isAnswerConfirmed && (
          <button
            onClick={handleConfirmAnswer}
            disabled={
              currentQ.matchPairs && currentQ.matchPairs.length > 0
                ? !isMatchFullyConnected
                : selectedOption === null
            }
            className={`w-full py-4 sm:py-4.5 rounded-2xl font-black text-base sm:text-lg shadow-lg flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
              (currentQ.matchPairs && currentQ.matchPairs.length > 0 ? isMatchFullyConnected : selectedOption !== null)
                ? 'bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-500/25 active:scale-[0.99]'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-300 dark:border-slate-700'
            }`}
          >
            <span>回答する（確定）</span>
            <Check className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Explanation & Analogy Card (Slides in when answer is confirmed) */}
      {isAnswerConfirmed && (
        <div
          ref={explanationRef}
          className="mt-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl p-5 sm:p-7 border-2 border-sky-300/80 shadow-xl space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300 scroll-mt-6"
        >
          {/* Result Header Banner */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              {answersState[currentIndex] === 'correct' ? (
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-lg sm:text-xl">
                  <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7" />
                  正解です！
                </div>
              ) : (
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-black text-lg sm:text-xl">
                  <XCircle className="w-6 h-6 sm:w-7 sm:h-7" />
                  不正解です{currentQ.matchPairs && currentQ.matchPairs.length > 0 ? '' : `（正解: ${['A', 'B', 'C', 'D'][currentQ.answerIndex]}）`}
                </div>
              )}
            </div>

            <button
              onClick={handleToggleBookmarkCurrent}
              className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 hover:underline cursor-pointer"
            >
              <Bookmark className="w-4 h-4" />
              {isBookmarked ? 'ブックマーク中' : 'あとで復習'}
            </button>
          </div>

          {/* Everyday Analogy Box (日常のたとえ - 難解・煩雑な場合のみ表示) */}
          {Boolean(currentQ.analogy && currentQ.analogy.trim().length > 0) && (
            <div className="bg-amber-50/90 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-500/30 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-black text-sm sm:text-base mb-2">
                <Lightbulb className="w-5 h-5 fill-amber-400/20 text-amber-600" />
                日常のたとえで覚える！
              </div>
              <p className="text-sm sm:text-base text-amber-950 dark:text-amber-100 font-bold leading-relaxed">
                {currentQ.analogy}
              </p>
            </div>
          )}

          {/* Detailed Explanation (実務解説) */}
          <div className="space-y-2">
            <h4 className="text-sm sm:text-base font-black text-cyan-900 dark:text-cyan-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600 dark:text-cyan-400" />
              実務・詳細解説
            </h4>
            <p className="text-sm sm:text-base text-slate-800 dark:text-slate-100 leading-relaxed sm:leading-loose font-normal">
              {currentQ.explanation}
            </p>
          </div>

          {/* Reference Citation */}
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/60 rounded-xl p-3 flex items-center gap-2 border border-slate-200 dark:border-slate-800">
            <span className="text-cyan-700 dark:text-cyan-400 font-bold">📌 参照:</span>
            <span>「{currentQ.referenceSection}」</span>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNextQuestion}
            className="w-full py-4 sm:py-4.5 rounded-2xl bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-base sm:text-lg shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2.5 transition-all active:scale-[0.99] cursor-pointer"
          >
            {currentIndex + 1 < total ? (
              <>
                <span>次の問題へ ({currentIndex + 2}/{total})</span>
                <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>結果を見る</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

