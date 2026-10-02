'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Droplet,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Lock,
  Waves,
  CheckCircle2,
  Award,
  Layers,
  ShieldCheck,
  ScrollText,
  PieChart,
  Handshake,
  HardHat,
  HeartPulse,
  TrendingUp,
  TestTube,
  ShieldAlert,
  Filter,
  FlaskConical,
  Zap,
  MonitorCheck,
  Cog,
  Network,
  Wrench,
  Building2,
  Activity,
} from 'lucide-react';
import { DOMAINS, getCourseById, getLessonById } from '@/data/domains';
import { getUserStats, saveLastDomainId, getLastDomainId } from '@/lib/storage';
import { UserStats, Course } from '@/types/quiz';
import { COURSE_PAGE_THEMES } from '@/data/themes';

const COURSE_THEMES = COURSE_PAGE_THEMES;

// Helper to safely render icons by name
function renderFieldIcon(iconName: string, className = 'w-5 h-5') {
  switch (iconName) {
    case 'ShieldCheck': return <ShieldCheck className={className} />;
    case 'ScrollText': return <ScrollText className={className} />;
    case 'PieChart': return <PieChart className={className} />;
    case 'Handshake': return <Handshake className={className} />;
    case 'HardHat': return <HardHat className={className} />;
    case 'HeartPulse': return <HeartPulse className={className} />;
    case 'TrendingUp': return <TrendingUp className={className} />;
    case 'Waves': return <Waves className={className} />;
    case 'TestTube': return <TestTube className={className} />;
    case 'ShieldAlert': return <ShieldAlert className={className} />;
    case 'Filter': return <Filter className={className} />;
    case 'FlaskConical': return <FlaskConical className={className} />;
    case 'Zap': return <Zap className={className} />;
    case 'MonitorCheck': return <MonitorCheck className={className} />;
    case 'Cog': return <Cog className={className} />;
    case 'Network': return <Network className={className} />;
    case 'Wrench': return <Wrench className={className} />;
    case 'Building2': return <Building2 className={className} />;
    case 'Activity': return <Activity className={className} />;
    case 'Layers': return <Layers className={className} />;
    case 'Sparkles': return <Sparkles className={className} />;
    default: return <Droplet className={className} />;
  }
}

export default function HomePage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [selectedDomainId, setSelectedDomainId] = useState('water_supply');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadedStats = getUserStats();
    setStats(loadedStats);
    const lastDomain = getLastDomainId();
    if (lastDomain && DOMAINS.some((d) => d.id === lastDomain)) {
      setSelectedDomainId(lastDomain);
    }
  }, []);

  const handleDomainChange = (domainId: string) => {
    setSelectedDomainId(domainId);
    saveLastDomainId(domainId);
  };

  const selectedDomain = DOMAINS.find((d) => d.id === selectedDomainId) || DOMAINS[0];
  const isTechManagerPortal = selectedDomain.id === 'water_technical_manager';

  // Stats calculation
  const completedLessonsMap = stats?.completedLessons || {};
  const completedCount = Object.values(completedLessonsMap).filter((l) => l.passed).length;
  const totalStars = Object.values(completedLessonsMap).reduce((acc, curr) => acc + (curr.stars || 0), 0);
  const mistakeCount = stats?.mistakeHistory.length || 0;

  // Active courses across all domains
  const allPlayableCourses = DOMAINS.flatMap((d) => d.courses).filter((c) => c.units.length > 0);

  // Active courses and lessons in available domain
  const availableCourses = selectedDomain.courses.filter((c) => c.units.length > 0);

  // Determine continueCourse dynamically within the SELECTED DOMAIN
  let continueCourse: Course | null = null;

  // 1. Last accessed course if it belongs to the selected domain
  if (stats?.lastCourseId) {
    const found = availableCourses.find((c) => c.id === stats.lastCourseId);
    if (found) {
      continueCourse = found;
    }
  }

  // 2. Course from the most recently completed lesson within selected domain
  if (!continueCourse && stats?.completedLessons) {
    const sortedCompleted = Object.values(stats.completedLessons)
      .filter((l) => l.completedAt)
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

    for (const res of sortedCompleted) {
      const match = getLessonById(res.lessonId);
      if (match?.course && availableCourses.some((c) => c.id === match.course.id)) {
        continueCourse = match.course;
        break;
      }
    }
  }

  // 3. In-progress course within selected domain (0% < progress < 100%)
  if (!continueCourse) {
    const inProgress = availableCourses.find((course) => {
      const ids = course.units.flatMap((u) => u.lessons.map((l) => l.id));
      const passed = ids.filter((id) => completedLessonsMap[id]?.passed).length;
      return passed > 0 && passed < ids.length;
    });
    if (inProgress) continueCourse = inProgress;
  }

  // 4. First uncompleted course within selected domain
  if (!continueCourse) {
    const uncompleted = availableCourses.find((course) => {
      const ids = course.units.flatMap((u) => u.lessons.map((l) => l.id));
      const passed = ids.filter((id) => completedLessonsMap[id]?.passed).length;
      return passed < ids.length;
    });
    if (uncompleted) continueCourse = uncompleted;
  }

  // 5. Fallback to first available course in selected domain
  if (!continueCourse && availableCourses.length > 0) {
    continueCourse = availableCourses[0];
  }

  const continueLessons = continueCourse?.units.flatMap((u) => u.lessons) || [];
  const continueCompletedLessons = continueLessons.filter((l) => completedLessonsMap[l.id]?.passed).length;
  const continueProgressPct = continueLessons.length > 0
    ? Math.round((continueCompletedLessons / continueLessons.length) * 100)
    : 0;
  const continueIsAllPassed = continueLessons.length > 0 && continueCompletedLessons === continueLessons.length;
  const continueTheme = (continueCourse && COURSE_THEMES[continueCourse.id]) || COURSE_THEMES.handa_vision;

  const continueDomain = DOMAINS.find((d) => d.courses.some((c) => c.id === continueCourse!.id));
  const continueCourseIndex = continueDomain ? continueDomain.courses.findIndex((c) => c.id === continueCourse!.id) + 1 : 1;

  const streakDays = completedCount > 0 ? Math.max(1, Math.min(completedCount + 2, 15)) : 1;



  const handleComingSoonClick = (course: Course) => {
    const lectureLabel = course.fieldNumber ? `第${String(course.fieldNumber).padStart(2, '0')}講 ` : '';
    setToastMessage(`${lectureLabel}「${course.title}」は現在教材を作成中です。次回アップデートをお待ちください！💧`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div className="flex-1 w-full flex flex-col bg-gradient-to-b from-sky-100/70 via-blue-50/50 to-sky-100/60 pb-16 min-h-screen">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs sm:text-sm font-bold py-2.5 px-5 rounded-full shadow-2xl backdrop-blur-md border border-cyan-400/40 animate-in fade-in slide-in-from-top duration-300 max-w-[90%] text-center">
          {toastMessage}
        </div>
      )}

      <div className="max-w-2xl mx-auto w-full px-4 py-5 space-y-6">
        
        {/* 1. PRIMARY: Top Domain Switcher (セグメントコントロール風のメインタブ) */}
        <section>
          <div className="bg-white/80 p-1.5 rounded-2xl border-2 border-sky-200/90 shadow-sm flex items-center gap-1.5 backdrop-blur-md overflow-x-auto scrollbar-none select-none">
            {DOMAINS.map((domain) => {
              const isSelected = selectedDomainId === domain.id;
              return (
                <button
                  key={domain.id}
                  onClick={() => handleDomainChange(domain.id)}
                  className={`px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-600 text-white shadow-md shadow-blue-500/25'
                      : 'text-slate-600 hover:text-blue-700 hover:bg-sky-50/80 font-bold'
                  }`}
                >
                  <span>{domain.name}</span>
                  {!domain.available && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      準備中
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* 2. SECONDARY: Top Status Bar (控えめで機能的なサブインジケーター) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none select-none text-xs">
          {/* Continuous Days Badge */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-sky-200/50 text-blue-900 border border-sky-300/40 shrink-0 font-bold">
            <Droplet className="w-3.5 h-3.5 fill-blue-600 text-blue-600" />
            <span className="font-black text-blue-800 text-sm">{streakDays}</span>
            <span className="text-[11px] text-slate-600">日連続</span>
          </div>

          {/* Completed Lessons Badge */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/70 text-slate-700 border border-sky-200/60 shrink-0 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />
            <span className="font-black text-cyan-600 text-sm">{completedCount}</span>
            <span className="text-[11px] text-slate-600">レッスン完了</span>
          </div>

          {/* Review Mistake Badge */}
          <Link
            href="/review"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border shrink-0 transition-colors font-bold ${
              mistakeCount > 0
                ? 'bg-amber-100/80 text-amber-900 border-amber-300/60 hover:bg-amber-200/80 shadow-2xs'
                : 'bg-white/70 text-slate-700 border-sky-200/60 hover:bg-white'
            }`}
          >
            <RotateCcw className={`w-3.5 h-3.5 ${mistakeCount > 0 ? 'text-amber-700' : 'text-slate-400'}`} />
            <span className={`font-black text-sm ${mistakeCount > 0 ? 'text-amber-800' : 'text-slate-700'}`}>{mistakeCount}</span>
            <span className={`text-[11px] ${mistakeCount > 0 ? 'text-amber-900' : 'text-slate-600'}`}>復習数</span>
          </Link>
        </div>

        {/* 3. Section: "続きから学ぶ" */}
        {continueCourse && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>続きから学ぶ</span>
              </h2>
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

              {/* Content inside tile */}
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/25 backdrop-blur-md text-xs font-black uppercase tracking-wide border border-white/30 text-white shadow-sm whitespace-nowrap shrink-0">
                    <Droplet className="w-3.5 h-3.5 fill-current" />
                    <span>
                      {isTechManagerPortal && continueCourse.fieldNumber
                        ? `第${String(continueCourse.fieldNumber).padStart(2, '0')}講`
                        : `コース ${continueCourseIndex}`}
                    </span>
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
        )}

        {/* 4. Domain Content View */}
        {isTechManagerPortal ? (
          /* ========================================================================= */
          /* 水道技術管理者 マスターポータル (全18講義 縦並び一覧) */
          /* ========================================================================= */
          <section className="space-y-4">
            {/* Header info */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 border-2 border-sky-200 shadow-sm flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  水道技術管理者
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  全18講義を網羅した総合学習ドリル。
                </p>
              </div>
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 text-xs font-black flex items-center justify-center shrink-0">
                {selectedDomain.courses.length}
              </span>
            </div>

            {/* Course Cards: 純粋に縦にならべる */}
            <div className="grid grid-cols-1 gap-3.5">
              {selectedDomain.courses.map((course) => {
                const courseLessons = course.units.flatMap((u) => u.lessons);
                const totalCourseLessons = courseLessons.length;
                const completedCourseLessons = courseLessons.filter((l) => completedLessonsMap[l.id]?.passed).length;
                const isReady = totalCourseLessons > 0;
                const pct = isReady ? Math.round((completedCourseLessons / totalCourseLessons) * 100) : 0;
                const isAllPassed = isReady && completedCourseLessons === totalCourseLessons;

                if (isReady) {
                  return (
                    <Link
                      key={course.id}
                      href={`/course/${course.id}`}
                      className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-md border-2 border-sky-300 hover:border-blue-500 bg-white p-5 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-black">
                              第{course.fieldNumber ? String(course.fieldNumber).padStart(2, '0') : '01'}講
                            </span>
                            {course.badge && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black">
                                {course.badge}
                              </span>
                            )}
                          </div>

                          <span className="text-xs font-black text-blue-700 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full shrink-0">
                            {isAllPassed ? (
                              <span className="text-emerald-700 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> 完全習得
                              </span>
                            ) : (
                              `${completedCourseLessons}/${totalCourseLessons} 済`
                            )}
                          </span>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 via-sky-600 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                            {renderFieldIcon(course.iconName)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                              {course.title}
                            </h3>
                            <p className="text-xs font-bold text-slate-600 line-clamp-2 mt-0.5 leading-relaxed">
                              {course.subtitle}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="pt-3 mt-3 border-t border-sky-100 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                          <span>進捗状況</span>
                          <span className="text-blue-700 font-black">{pct}% 完了</span>
                        </div>
                        <div className="w-full h-2 bg-sky-100 rounded-full overflow-hidden p-0.5">
                          <div
                            className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </Link>
                  );
                }

                // Coming Soon Field Card
                return (
                  <div
                    key={course.id}
                    onClick={() => handleComingSoonClick(course)}
                    className="relative rounded-3xl overflow-hidden border-2 border-sky-200 bg-white/70 p-5 opacity-90 hover:opacity-100 hover:border-sky-300 transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-black">
                            第{course.fieldNumber ? String(course.fieldNumber).padStart(2, '0') : '00'}講
                          </span>
                          {course.badge && (
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                              {course.badge}
                            </span>
                          )}
                        </div>

                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-white px-2.5 py-0.5 rounded-full border border-sky-100">
                          <Lock className="w-3 h-3" /> 準備中
                        </span>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-sky-100 text-slate-500 flex items-center justify-center shrink-0">
                          {renderFieldIcon(course.iconName)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-black text-slate-800 leading-snug group-hover:text-blue-800 transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-xs font-bold text-slate-600 line-clamp-2 mt-0.5 leading-relaxed">
                            {course.subtitle}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-sky-100/80 flex items-center justify-between text-xs text-slate-500 font-bold">
                      <span>予定: 約{course.estimatedQuestions || 150}問</span>
                      <span className="text-blue-600 font-bold">教材準備中 →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : (
          /* ========================================================================= */
          /* 水道事業実務 / 下水道事業 コース一覧 (従来の縦並びリッチカード) */
          /* ========================================================================= */
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {selectedDomain.name}
              </h2>
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-black flex items-center justify-center">
                {selectedDomain.courses.length}
              </span>
            </div>

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

                        <div>
                          <h3 className="text-xl sm:text-2xl font-black text-white drop-shadow-md leading-tight tracking-tight">
                            {course.title}
                          </h3>
                          <p className="text-xs sm:text-sm font-bold text-white/90 drop-shadow line-clamp-2 mt-1 leading-relaxed">
                            {course.subtitle || course.description}
                          </p>
                        </div>

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

                // Locked / Coming Soon Course
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
        )}

      </div>
    </div>
  );
}
