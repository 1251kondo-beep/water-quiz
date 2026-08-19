'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronLeft, Award, Sparkles, BookOpen, Layers, Info } from 'lucide-react';
import { getCourseById } from '@/data/domains';
import WaterStreamMap from '@/components/WaterStreamMap';
import { getUserStats } from '@/lib/storage';
import { UserStats } from '@/types/quiz';

export default function CoursePage() {
  const params = useParams();
  const courseId = params?.courseId as string;
  const course = getCourseById(courseId || 'water_finance');

  const [stats, setStats] = useState<UserStats | null>(null);
  const [selectedUnitIdx, setSelectedUnitIdx] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setStats(getUserStats());
  }, []);

  if (!course) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center">
        <p className="text-slate-700 mb-4 font-bold">指定されたコースが見つかりませんでした。</p>
        <Link href="/" className="text-blue-600 underline text-sm font-black">
          ホームへ戻る
        </Link>
      </div>
    );
  }

  const completedMap = stats?.completedLessons || {};
  const allCourseLessons = course.units.flatMap((u) => u.lessons);
  const totalLessons = allCourseLessons.length;
  const passedLessonsCount = allCourseLessons.filter((l) => completedMap[l.id]?.passed).length;
  const progressPct = totalLessons > 0 ? Math.round((passedLessonsCount / totalLessons) * 100) : 0;
  const totalStars = allCourseLessons.reduce((acc, l) => acc + (completedMap[l.id]?.stars || 0), 0);

  // Active unit
  const activeUnit = course.units[selectedUnitIdx] || course.units[0];

  const handleLockClick = (lessonTitle: string) => {
    setToastMessage(`「${lessonTitle}」は前のレッスンを合格すると解放されます！💧`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100/70 via-blue-50/50 to-sky-100/60 pb-20 relative overflow-x-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs sm:text-sm font-bold py-2.5 px-5 rounded-full shadow-2xl backdrop-blur-md border border-cyan-400/40 animate-in fade-in slide-in-from-top duration-300 max-w-[90%] text-center">
          {toastMessage}
        </div>
      )}

      {/* Header Bar matching Image 2 */}
      <div className="sticky top-0 z-40 bg-sky-200/90 backdrop-blur-md border-b border-sky-300/80 px-4 py-3 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between relative">
          {/* Back Circle Button */}
          <Link
            href="/"
            className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-blue-600 shadow-md flex items-center justify-center transition-transform active:scale-95 border border-sky-200 cursor-pointer"
            title="コース一覧へ戻る"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </Link>

          {/* Center Course Info */}
          <div className="text-center px-2 flex-1">
            <div className="inline-block px-3 py-0.5 rounded-full bg-cyan-600 text-white text-[11px] font-black tracking-wider uppercase shadow-sm mb-0.5">
              {course.id === 'handa_vision' ? 'コース 1' : 'コース 2'}
            </div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 truncate tracking-tight">
              {course.title}
            </h1>
          </div>

          {/* Quick Glossary Link */}
          <Link
            href="/glossary"
            className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-blue-600 shadow-md flex items-center justify-center transition-transform active:scale-95 border border-sky-200 cursor-pointer"
            title="用語辞書"
          >
            <BookOpen className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Course Sub-Header & Progress Bar */}
      <div className="max-w-xl mx-auto pt-4 px-4">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 sm:p-5 border-2 border-sky-200 shadow-lg space-y-3">
          <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
            <span className="font-black text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-600" />
              コース全体の進捗
            </span>
            <div className="flex items-center gap-3">
              <span className="font-extrabold text-blue-700">
                {passedLessonsCount} / {totalLessons} 合格
              </span>
              <span className="font-bold text-amber-500 flex items-center gap-0.5 text-xs">
                ★ {totalStars}
              </span>
            </div>
          </div>

          {/* Progress Bar with Water Flow look */}
          <div className="w-full h-3 bg-sky-100 rounded-full overflow-hidden p-0.5 border border-sky-200 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Unit Tabs for easy navigation */}
          {course.units.length > 1 && (
            <div className="pt-2 border-t border-sky-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {course.units.map((unit, uIdx) => {
                const isSelected = selectedUnitIdx === uIdx;
                const unitPassed = unit.lessons.filter((l) => completedMap[l.id]?.passed).length;
                return (
                  <button
                    key={unit.id}
                    onClick={() => setSelectedUnitIdx(uIdx)}
                    className={`px-3 py-1.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/30'
                        : 'bg-sky-50 text-slate-700 hover:bg-sky-100 border border-sky-200'
                    }`}
                  >
                    <span>Section {unit.unitNumber}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? 'bg-white/30 text-white' : 'bg-sky-200 text-sky-800'
                    }`}>
                      {unitPassed}/{unit.lessons.length}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Active Unit Banner */}
      {activeUnit && (
        <div className="max-w-xl mx-auto mt-4 px-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-300/80 text-blue-900 text-xs font-black mb-1">
            <Layers className="w-3 h-3 text-blue-600" />
            {activeUnit.title}
          </div>
          <p className="text-[11px] sm:text-xs text-slate-600 font-bold px-2">
            {activeUnit.description}
          </p>
        </div>
      )}

      {/* Main Stream Roadmap (Image 2 style) */}
      <div className="mt-2">
        {activeUnit && (
          <WaterStreamMap
            lessons={activeUnit.lessons}
            completedMap={completedMap}
            onLockClick={handleLockClick}
          />
        )}
      </div>
    </div>
  );
}
