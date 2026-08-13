'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, RotateCcw, Bookmark, CheckCircle2, Award } from 'lucide-react';
import { getUserStats, removeMistake } from '@/lib/storage';
import { WATER_FINANCE_UNITS } from '@/data/water_finance';
import { Question } from '@/types/quiz';
import QuizPlayer from '@/components/QuizPlayer';

export default function ReviewPage() {
  const [questionsToReview, setQuestionsToReview] = useState<Question[]>([]);
  const [filterMode, setFilterMode] = useState<'mistakes' | 'bookmarks'>('mistakes');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stats = getUserStats();
    const allQuestions: Question[] = [];

    WATER_FINANCE_UNITS.forEach((unit) => {
      unit.lessons.forEach((lesson) => {
        allQuestions.push(...lesson.questions);
      });
    });

    const targetIds = filterMode === 'mistakes' ? stats.mistakeHistory : stats.bookmarks;
    const filtered = allQuestions.filter((q) => targetIds.includes(q.id));
    setQuestionsToReview(filtered);
    setLoaded(true);
  }, [filterMode]);

  if (!loaded) return null;

  // Custom mock lesson for review
  const reviewLesson = {
    id: 'review_session',
    unitId: 'review',
    lessonNumber: 0,
    title: filterMode === 'mistakes' ? '弱点克服・間違えた問題の復習' : 'ブックマークした問題の復習',
    subtitle: `${questionsToReview.length}問のピックアップ復習セッション`,
    description: '苦手分野を集中して攻略します。',
    questions: questionsToReview,
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        ホームへ戻る
      </Link>

      <div className="glass-card rounded-3xl p-6 border border-amber-500/30 bg-gradient-to-br from-amber-950/30 via-slate-900 to-cyan-950/30">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">
                復習・弱点攻略モード
              </h1>
              <p className="text-xs text-slate-400">
                過去に間違えた問題やお気に入りに登録した問題を再挑戦
              </p>
            </div>
          </div>
        </div>

        {/* Tab Filter */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterMode('mistakes')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterMode === 'mistakes'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            間違えた問題 ({getUserStats().mistakeHistory.length})
          </button>
          <button
            onClick={() => setFilterMode('bookmarks')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterMode === 'bookmarks'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            ブックマーク ({getUserStats().bookmarks.length})
          </button>
        </div>
      </div>

      {questionsToReview.length > 0 ? (
        <QuizPlayer
          lesson={reviewLesson}
          unitTitle={filterMode === 'mistakes' ? '弱点克服セッション' : 'ブックマークセッション'}
          courseId="water_finance"
        />
      ) : (
        <div className="glass-card rounded-2xl p-8 text-center text-slate-400 space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto opacity-80" />
          <p className="text-base font-bold text-slate-200">
            {filterMode === 'mistakes' ? '間違えた問題はありません！' : 'ブックマークされた問題はありません。'}
          </p>
          <p className="text-xs text-slate-400">
            レッスンに挑戦して、苦手な問題や見返したい問題を登録してみましょう。
          </p>
          <Link
            href="/course/water_finance"
            className="inline-block mt-2 px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20"
          >
            全9レッスン一覧へ
          </Link>
        </div>
      )}
    </div>
  );
}
