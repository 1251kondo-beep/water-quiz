'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Droplet,
  BookOpen,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Lock,
  Waves,
  CheckCircle2
} from 'lucide-react';
import { DOMAINS, getCourseById, getLessonById } from '@/data/domains';
import { getUserStats } from '@/lib/storage';
import { UserStats, Course } from '@/types/quiz';
import { COURSE_PAGE_THEMES, getCourseTheme } from '@/data/themes';

const COURSE_THEMES = COURSE_PAGE_THEMES;

export default function HomePage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [selectedDomainId, setSelectedDomainId] = useState('water_supply');

  useEffect(() => {
    setStats(getUserStats());
  }, []);

  const selectedDomain = DOMAINS.find((d) => d.id === selectedDomainId) || DOMAINS[0];

  // Stats calculation
  const completedLessonsMap = stats?.completedLessons || {};
  const completedCount = Object.values(completedLessonsMap).filter((l) => l.passed).length;
  const totalStars = Object.values(completedLessonsMap).reduce((acc, curr) => acc + (curr.stars || 0), 0);
  const mistakeCount = stats?.mistakeHistory.length || 0;

  // Active courses and lessons in available domain
  const availableCourses = selectedDomain.courses.filter((c) => c.units.length > 0);
  const completedCoursesCount = availableCourses.filter((course) => {
    const courseLessonIds = course.units.flatMap((u) => u.lessons.map((l) => l.id));
    return courseLessonIds.length > 0 && courseLessonIds.every((id) => completedLessonsMap[id]?.passed);
  }).length;

  // Playable courses across all domains
  const allPlayableCourses = DOMAINS.flatMap((d) => d.courses).filter((c) => c.units.length > 0);

  // Determine continueCourse dynamically
  let continueCourse: Course | null = null;

  // 1. Priority: Last accessed course from stats
  if (stats?.lastCourseId) {
    const found = getCourseById(stats.lastCourseId);
    if (found && found.units.length > 0) {
      continueCourse = found;
    }
  }

  // 2. Priority: Course from the most recently completed lesson
  if (!continueCourse && stats?.completedLessons) {
    const sortedCompleted = Object.values(stats.completedLessons)
      .filter((l) => l.completedAt)
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

    for (const res of sortedCompleted) {
      const match = getLessonById(res.lessonId);
      if (match?.course && match.course.units.length > 0) {
        continueCourse = match.course;
        break;
      }
    }
  }

  // 3. Priority: In-progress course (0% < progress < 100%)
  if (!continueCourse) {
    const inProgress = allPlayableCourses.find((course) => {
      const ids = course.units.flatMap((u) => u.lessons.map((l) => l.id));
      const passed = ids.filter((id) => completedLessonsMap[id]?.passed).length;
      return passed > 0 && passed < ids.length;
    });
    if (inProgress) {
      continueCourse = inProgress;
    }
  }

  // 4. Priority: First uncompleted playable course
  if (!continueCourse) {
    const uncompleted = allPlayableCourses.find((course) => {
      const ids = course.units.flatMap((u) => u.lessons.map((l) => l.id));
      const passed = ids.filter((id) => completedLessonsMap[id]?.passed).length;
      return passed < ids.length;
    });
    if (uncompleted) {
      continueCourse = uncompleted;
    }
  }

  // 5. Fallback
  if (!continueCourse) {
    continueCourse = availableCourses[0] || selectedDomain.courses[0] || DOMAINS[0].courses[0];
  }

  const continueLessons = continueCourse.units.flatMap((u) => u.lessons);
  const continueCompletedLessons = continueLessons.filter((l) => completedLessonsMap[l.id]?.passed).length;
  const continueProgressPct = continueLessons.length > 0
    ? Math.round((continueCompletedLessons / continueLessons.length) * 100)
    : 0;
  const continueIsAllPassed = continueLessons.length > 0 && continueCompletedLessons === continueLessons.length;
  const continueTheme = COURSE_THEMES[continueCourse.id] || COURSE_THEMES.handa_vision;

  // Find course index in its domain
  const continueDomain = DOMAINS.find((d) => d.courses.some((c) => c.id === continueCourse!.id));
  const continueCourseIndex = continueDomain ? continueDomain.courses.findIndex((c) => c.id === continueCourse!.id) + 1 : 1;

  // Calculate simulated streak or continuous days
  const streakDays = completedCount > 0 ? Math.max(1, Math.min(completedCount + 2, 15)) : 1;

  return (
    <div className="flex-1 w-full flex flex-col bg-gradient-to-b from-sky-100/70 via-blue-50/50 to-sky-100/60 pb-16">
      <div className="max-w-2xl mx-auto w-full px-4 py-5 space-y-7">
        
        {/* Top Status Bar (Pills matching Image 1) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none select-none">
          {/* Continuous Days Badge */}
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 text-white shadow-md shadow-blue-500/20 shrink-0">
            <Droplet className="w-4 h-4 fill-white text-white" />
            <span className="text-sm font-black tracking-tight">{streakDays}</span>
            <span className="text-xs font-bold opacity-90">連続日数</span>
          </div>

          {/* Completed Courses Badge */}
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white text-slate-800 border-2 border-sky-200 shadow-sm shrink-0">
            <span className="text-sm font-black text-blue-700">{completedCoursesCount}</span>
            <span className="text-xs font-bold text-slate-600">完了コース</span>
          </div>

          {/* Completed Lessons Badge */}
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white text-slate-800 border-2 border-sky-200 shadow-sm shrink-0">
            <span className="text-sm font-black text-cyan-600">{completedCount}</span>
            <span className="text-xs font-bold text-slate-600">完了レッスン</span>
          </div>

          {/* Review Mistake Badge */}
          {mistakeCount > 0 && (
            <Link
              href="/review"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-amber-50 text-amber-900 border-2 border-amber-300 shadow-sm shrink-0 hover:bg-amber-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-sm font-black text-amber-700">{mistakeCount}</span>
              <span className="text-xs font-bold">要復習</span>
            </Link>
          )}
        </div>

        {/* Section: "続きから学ぶ" */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>続きから学ぶ</span>
            </h2>
            <Link
              href="/glossary"
              className="text-xs font-black text-blue-700 hover:text-blue-800 flex items-center gap-1 bg-white/80 border border-sky-200 px-3 py-1 rounded-full shadow-sm"
            >
              <BookOpen className="w-3.5 h-3.5" />
              用語辞書
            </Link>
          </div>

          <Link
            href={`/course/${continueCourse.id}`}
            className={`group block relative rounded-3xl overflow-hidden shadow-lg border-2 ${continueTheme.border} ${continueTheme.gradient} text-white p-6 sm:p-7 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl active:scale-[0.99] cursor-pointer`}
          >
            {/* Background water ripples */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {continueTheme.waveType === 1 && (
                  <>
                    <path d="M0,45 Q25,25 50,45 T100,45 L100,100 L0,100 Z" fill="#ffffff" />
                    <path d="M0,65 Q35,45 70,65 T100,65 L100,100 L0,100 Z" fill="#ffffff" opacity="0.4" />
                  </>
                )}
                {continueTheme.waveType === 2 && (
                  <>
                    <circle cx="20" cy="30" r="18" fill="#ffffff" opacity="0.25" />
                    <circle cx="85" cy="70" r="25" fill="#ffffff" opacity="0.2" />
                    <path d="M0,60 Q50,30 100,60 L100,100 L0,100 Z" fill="#ffffff" opacity="0.3" />
                  </>
                )}
                {continueTheme.waveType === 3 && (
                  <>
                    <path d="M0,30 Q30,60 60,30 T100,40 L100,100 L0,100 Z" fill="#ffffff" opacity="0.25" />
                    <path d="M0,70 Q40,50 80,70 L100,70 L100,100 L0,100 Z" fill="#ffffff" opacity="0.3" />
                  </>
                )}
                {continueTheme.waveType === 4 && (
                  <>
                    <ellipse cx="50" cy="50" rx="40" ry="20" fill="#ffffff" opacity="0.2" />
                    <path d="M0,55 Q50,75 100,55 L100,100 L0,100 Z" fill="#ffffff" opacity="0.3" />
                  </>
                )}
                {continueTheme.waveType === 5 && (
                  <>
                    <path d="M0,35 Q25,55 55,35 T100,45 L100,100 L0,100 Z" fill="#ffffff" opacity="0.25" />
                    <path d="M0,65 Q30,45 65,65 T100,55 L100,100 L0,100 Z" fill="#ffffff" opacity="0.35" />
                  </>
                )}
              </svg>
            </div>

            {/* Bubble decor */}
            <div className="absolute top-4 right-6 w-8 h-8 rounded-full border border-white/40 bg-white/20 animate-float-slow pointer-events-none" />
            <div className="absolute bottom-6 left-6 w-5 h-5 rounded-full border border-white/30 bg-white/10 animate-bounce-subtle pointer-events-none" />

            {/* Content inside the clean single tile */}
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/25 backdrop-blur-md text-xs font-black uppercase tracking-wide border border-white/30 text-white shadow-sm whitespace-nowrap shrink-0">
                  <Droplet className="w-3.5 h-3.5 fill-current" />
                  <span>コース {continueCourseIndex}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {continueIsAllPassed ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-black bg-emerald-400 text-emerald-950 px-2.5 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                      <CheckCircle2 className="w-3 h-3" />
                      完全習得
                    </span>
                  ) : continueProgressPct > 0 ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-black bg-sky-200 text-blue-950 px-2.5 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                      <Sparkles className="w-3 h-3" />
                      学習中
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-black bg-amber-300 text-amber-950 px-2.5 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                      <Sparkles className="w-3 h-3" />
                      おすすめ
                    </span>
                  )}
                  <span className="text-xs font-black bg-white/25 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 text-white whitespace-nowrap">
                    {continueCompletedLessons}/{continueLessons.length}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md leading-tight tracking-tight">
                  {continueCourse.title}
                </h3>
                <p className="text-xs sm:text-sm font-bold text-white/90 drop-shadow line-clamp-2 mt-1 leading-relaxed">
                  {continueCourse.subtitle || continueCourse.description}
                </p>
              </div>

              {/* Progress Bar inside Tile */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs font-bold text-white/90">
                  <span>進捗状況</span>
                  <span className="font-black text-white">{continueProgressPct}% 完了</span>
                </div>
                <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden p-0.5 border border-white/30 backdrop-blur-sm">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${continueProgressPct}%` }}
                  />
                </div>
              </div>
            </div>
          </Link>
        </section>

        {/* Section: Category/Domain Course List (Styled to match the rich water tiles) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {selectedDomain.name}
            </h2>
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-black flex items-center justify-center">
              {selectedDomain.courses.length}
            </span>
          </div>

          {/* Domain tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {DOMAINS.map((domain) => (
              <button
                key={domain.id}
                onClick={() => setSelectedDomainId(domain.id)}
                className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedDomainId === domain.id
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/25'
                    : 'bg-white text-slate-700 border-2 border-sky-200 hover:border-sky-300'
                }`}
              >
                <span>{domain.name}</span>
                {!domain.available && (
                  <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded-full font-bold">
                    準備中
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Rich Water Course Cards Grid */}
          <div className="grid grid-cols-1 gap-4">
            {selectedDomain.courses.map((course, cIdx) => {
              const courseLessons = course.units.flatMap((u) => u.lessons);
              const totalCourseLessons = courseLessons.length;
              const completedCourseLessons = courseLessons.filter((l) => completedLessonsMap[l.id]?.passed).length;
              const isReady = totalCourseLessons > 0;
              const pct = isReady ? Math.round((completedCourseLessons / totalCourseLessons) * 100) : 0;
              const isAllPassed = isReady && completedCourseLessons === totalCourseLessons;

              const theme = COURSE_THEMES[course.id] || COURSE_THEMES.handa_vision;

              if (isReady) {
                return (
                  <Link
                    key={course.id}
                    href={`/course/${course.id}`}
                    className={`group block relative rounded-3xl overflow-hidden shadow-lg border-2 ${theme.border} ${theme.gradient} text-white p-6 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl active:scale-[0.99] cursor-pointer`}
                  >
                    {/* Background ripples & light reflections */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {theme.waveType === 1 && (
                          <>
                            <path d="M0,45 Q25,25 50,45 T100,45 L100,100 L0,100 Z" fill="#ffffff" />
                            <path d="M0,65 Q35,45 70,65 T100,65 L100,100 L0,100 Z" fill="#ffffff" opacity="0.4" />
                          </>
                        )}
                        {theme.waveType === 2 && (
                          <>
                            <circle cx="20" cy="30" r="18" fill="#ffffff" opacity="0.25" />
                            <circle cx="85" cy="70" r="25" fill="#ffffff" opacity="0.2" />
                            <path d="M0,60 Q50,30 100,60 L100,100 L0,100 Z" fill="#ffffff" opacity="0.3" />
                          </>
                        )}
                        {theme.waveType === 3 && (
                          <>
                            <path d="M0,30 Q30,60 60,30 T100,40 L100,100 L0,100 Z" fill="#ffffff" opacity="0.25" />
                            <path d="M0,70 Q40,50 80,70 L100,70 L100,100 L0,100 Z" fill="#ffffff" opacity="0.3" />
                          </>
                        )}
                        {theme.waveType === 4 && (
                          <>
                            <ellipse cx="50" cy="50" rx="40" ry="20" fill="#ffffff" opacity="0.2" />
                            <path d="M0,55 Q50,75 100,55 L100,100 L0,100 Z" fill="#ffffff" opacity="0.3" />
                          </>
                        )}
                        {theme.waveType === 5 && (
                          <>
                            <path d="M0,35 Q25,55 55,35 T100,45 L100,100 L0,100 Z" fill="#ffffff" opacity="0.25" />
                            <path d="M0,65 Q30,45 65,65 T100,55 L100,100 L0,100 Z" fill="#ffffff" opacity="0.35" />
                          </>
                        )}
                      </svg>
                    </div>

                    {/* Floating Bubbles */}
                    <div className="absolute top-3 right-6 w-6 h-6 rounded-full border border-white/40 bg-white/20 animate-float-slow pointer-events-none" />
                    <div className="absolute bottom-4 right-16 w-4 h-4 rounded-full border border-white/30 bg-white/10 animate-bounce-subtle pointer-events-none" />

                    {/* Tile Content */}
                    <div className="relative z-10 space-y-3.5">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/25 backdrop-blur-md text-xs font-black uppercase tracking-wide border border-white/30 text-white shadow-sm">
                          <Droplet className="w-3.5 h-3.5 fill-current" />
                          コース {cIdx + 1}
                        </div>

                        <div className="flex items-center gap-2">
                          {isAllPassed && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-black bg-emerald-400 text-emerald-950 px-2.5 py-0.5 rounded-full shadow-sm">
                              <CheckCircle2 className="w-3 h-3" />
                              完全習得
                            </span>
                          )}
                          <span className="text-xs font-black bg-white/25 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 text-white">
                            {completedCourseLessons}/{totalCourseLessons}
                          </span>
                        </div>
                      </div>

                      {/* Course Title & Description */}
                      <div>
                        <h3 className="text-xl sm:text-2xl font-black text-white drop-shadow-md leading-tight tracking-tight">
                          {course.title}
                        </h3>
                        <p className="text-xs sm:text-sm font-bold text-white/90 drop-shadow line-clamp-2 mt-1 leading-relaxed">
                          {course.subtitle || course.description}
                        </p>
                      </div>

                      {/* Progress Bar inside Tile */}
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between text-xs font-bold text-white/90">
                          <span>進捗状況</span>
                          <span className="font-black text-white">{pct}% 完了</span>
                        </div>
                        <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden p-0.5 border border-white/30 backdrop-blur-sm">
                          <div
                            className="h-full bg-white rounded-full transition-all duration-500 shadow-sm"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              }

              // Locked / Coming Soon Course Tile (Clean Aqua Frosted Glass Style)
              return (
                <div
                  key={course.id}
                  className="relative rounded-3xl overflow-hidden shadow-md border-2 border-sky-200 bg-gradient-to-br from-sky-100/90 via-blue-50/80 to-cyan-100/90 p-6 opacity-85"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-200/80 text-blue-900 text-xs font-black border border-sky-300/80">
                        コース {cIdx + 1}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-black text-slate-600 bg-white/80 px-3 py-1 rounded-full border border-sky-200">
                        <Lock className="w-3 h-3 text-slate-500" />
                        準備中
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-slate-800 leading-tight">
                        {course.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs text-slate-500 font-bold border-t border-sky-200/60">
                      <span>次回アップデートで公開予定</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}
