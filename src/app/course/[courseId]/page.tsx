'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, BookOpen, Layers, CheckCircle2, Award, Droplet } from 'lucide-react';
import { getCourseById } from '@/data/domains';
import LessonCard from '@/components/LessonCard';
import { getUserStats } from '@/lib/storage';
import { UserStats } from '@/types/quiz';

export default function CoursePage() {
  const params = useParams();
  const courseId = params?.courseId as string;
  const course = getCourseById(courseId || 'water_finance');

  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    setStats(getUserStats());
  }, []);

  if (!course) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center bg-white">
        <p className="text-slate-700 mb-4 font-bold">指定されたコースが見つかりませんでした。</p>
        <Link href="/" className="text-blue-600 underline text-sm font-black">
          ホームへ戻る
        </Link>
      </div>
    );
  }

  const completedMap = stats?.completedLessons || {};
  const courseLessonIds = new Set(course.units.flatMap((u) => u.lessons.map((l) => l.id)));
  const totalLessons = courseLessonIds.size;
  const passedLessonsCount = Object.entries(completedMap).filter(
    ([lessonId, result]) => courseLessonIds.has(lessonId) && result.passed
  ).length;
  const progressPct = totalLessons > 0 ? Math.round((passedLessonsCount / totalLessons) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-8 bg-white">
      {/* Back link & Course Header */}
      <div className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-black text-blue-700 hover:underline transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          コース選択へ戻る
        </Link>

        {/* White / Light Blue Header */}
        <div className="rounded-3xl p-6 md:p-8 border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-cyan-50 to-white text-slate-900 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
                {course.title}
              </h1>
              <p className="text-xs md:text-sm text-blue-700 font-black">
                {course.subtitle}
              </p>
            </div>

            {/* Overall Progress Widget */}
            <div className="bg-white rounded-2xl p-4 border-2 border-blue-200 shrink-0 min-w-[200px] text-slate-900 shadow-md">
              <div className="flex items-center justify-between text-xs text-slate-700 mb-2 font-black">
                <span>全体進捗</span>
                <span className="font-extrabold text-blue-700">{passedLessonsCount} / {totalLessons} 合格</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2 border border-slate-200">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p className="text-[11px] text-blue-700 text-right font-black">
                進捗率 {progressPct}%
              </p>
            </div>
          </div>

          <p className="text-xs md:text-sm text-slate-700 leading-relaxed border-t border-blue-200 pt-4 font-bold">
            {course.description}
          </p>
        </div>
      </div>

      {/* 3 Units and 15 Lessons List */}
      <div className="space-y-8">
        {course.units.map((unit) => (
          <div key={unit.id} className="space-y-4">
            {/* Unit Section Title */}
            <div className="border-b-2 border-blue-200 pb-4 space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-black text-xs sm:text-sm shadow-md shadow-blue-600/30">
                Section {unit.unitNumber}
              </div>
              <div className="space-y-1">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                  {unit.title.includes(':') ? unit.title.split(':')[1].trim() : unit.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-700 font-bold leading-relaxed">
                  {unit.description}
                </p>
              </div>
            </div>

            {/* Lessons Grid (each 10 questions) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {unit.lessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  result={completedMap[lesson.id]}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
