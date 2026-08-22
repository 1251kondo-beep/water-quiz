'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, RotateCcw, Bookmark, CheckCircle2, Award } from 'lucide-react';
import { getUserStats } from '@/lib/storage';
import { DOMAINS } from '@/data/domains';
import { Question } from '@/types/quiz';
import QuizPlayer from '@/components/QuizPlayer';

export default function ReviewPage() {
  const [questionsToReview, setQuestionsToReview] = useState<Question[]>([]);
  const [filterMode, setFilterMode] = useState<'mistakes' | 'bookmarks'>('mistakes');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stats = getUserStats();
    const allQuestions: Question[] = [];

    DOMAINS.forEach((domain) => {
      domain.courses.forEach((course) => {
        course.units.forEach((unit) => {
          unit.lessons.forEach((lesson) => {
            allQuestions.push(...lesson.questions);
          });
        });
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
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6 min-h-screen">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 bg-white px-3.5 py-1.5 rounded-full border border-blue-200 shadow-sm transition-all hover:shadow"
      >
        <ArrowLeft className="w-4 h-4" />
        ホームへ戻る
      </Link>

      <div className="rounded-3xl p-6 border-2 border-blue-200 bg-gradient-to-br from-amber-50/70 via-blue-50/50 to-white text-slate-900 shadow-lg">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-500/25">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                復習・弱点攻略モード
              </h1>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                過去に間違えた問題やお気に入りに登録した問題を再挑戦
              </p>
            </div>
          </div>
        </div>

        {/* Tab Filter */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setFilterMode('mistakes')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              filterMode === 'mistakes'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            間違えた問題 ({getUserStats().mistakeHistory.length})
          </button>
          <button
            onClick={() => setFilterMode('bookmarks')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              filterMode === 'bookmarks'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
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
        <div className="bg-white rounded-3xl p-8 text-center border-2 border-dashed border-blue-200 text-slate-500 space-y-3 shadow-sm">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <p className="text-base font-black text-slate-800">
            {filterMode === 'mistakes' ? '間違えた問題はありません！' : 'ブックマークされた問題はありません。'}
          </p>
          <p className="text-xs text-slate-500 leading-relaxed">
            レッスンに挑戦して、苦手な問題や見返したい問題を登録してみましょう。
          </p>
          <Link
            href="/course/water_finance"
            className="inline-flex items-center gap-2 mt-3 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-lg shadow-blue-600/25 transition-all"
          >
            全15レッスン一覧へ
          </Link>
        </div>
      )}
    </div>
  );
}
