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
  CheckCircle2,
  GraduationCap,
  Award,
  Layers,
  Search,
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
  ArrowRight,
} from 'lucide-react';
import { DOMAINS, getCourseById, getLessonById } from '@/data/domains';
import { getUserStats } from '@/lib/storage';
import { UserStats, Course, TechFieldCategory } from '@/types/quiz';
import { COURSE_PAGE_THEMES } from '@/data/themes';
import { TECH_CATEGORIES } from '@/data/courses/tech_manager_courses';

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
    default: return <Droplet className={className} />;
  }
}

export default function HomePage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [selectedDomainId, setSelectedDomainId] = useState('water_technical_manager');
  const [selectedCategory, setSelectedCategory] = useState<TechFieldCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setStats(getUserStats());
  }, []);

  const selectedDomain = DOMAINS.find((d) => d.id === selectedDomainId) || DOMAINS[0];
  const isTechManagerPortal = selectedDomain.id === 'water_technical_manager';

  // Stats calculation
  const completedLessonsMap = stats?.completedLessons || {};
  const completedCount = Object.values(completedLessonsMap).filter((l) => l.passed).length;
  const totalStars = Object.values(completedLessonsMap).reduce((acc, curr) => acc + (curr.stars || 0), 0);
  const mistakeCount = stats?.mistakeHistory.length || 0;

  // Playable courses across all domains
  const allPlayableCourses = DOMAINS.flatMap((d) => d.courses).filter((c) => c.units.length > 0);

  // Active courses in available domain
  const availableCourses = selectedDomain.courses.filter((c) => c.units.length > 0);
  const completedCoursesCount = availableCourses.filter((course) => {
    const courseLessonIds = course.units.flatMap((u) => u.lessons.map((l) => l.id));
    return courseLessonIds.length > 0 && courseLessonIds.every((id) => completedLessonsMap[id]?.passed);
  }).length;

  // Determine continueCourse dynamically
  let continueCourse: Course | null = null;
  if (stats?.lastCourseId) {
    const found = getCourseById(stats.lastCourseId);
    if (found && found.units.length > 0) {
      continueCourse = found;
    }
  }

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

  if (!continueCourse) {
    continueCourse = availableCourses[0] || DOMAINS[0].courses[0];
  }

  const continueLessons = continueCourse?.units.flatMap((u) => u.lessons) || [];
  const continueCompletedLessons = continueLessons.filter((l) => completedLessonsMap[l.id]?.passed).length;
  const continueProgressPct = continueLessons.length > 0
    ? Math.round((continueCompletedLessons / continueLessons.length) * 100)
    : 0;
  const continueIsAllPassed = continueLessons.length > 0 && continueCompletedLessons === continueLessons.length;
  const continueTheme = (continueCourse && COURSE_THEMES[continueCourse.id]) || COURSE_THEMES.tech_admin || COURSE_THEMES.handa_vision;

  const streakDays = completedCount > 0 ? Math.max(1, Math.min(completedCount + 2, 15)) : 1;

  // Filter courses for Tech Manager
  const filteredCourses = selectedDomain.courses.filter((course) => {
    if (isTechManagerPortal) {
      if (selectedCategory !== 'all' && course.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = course.title.toLowerCase().includes(q);
        const matchSub = course.subtitle?.toLowerCase().includes(q) || false;
        const matchKw = course.keywords?.some((k) => k.toLowerCase().includes(q)) || false;
        return matchTitle || matchSub || matchKw;
      }
    }
    return true;
  });

  // Calculate Tech Manager Category Progress
  const categoryStats = TECH_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
    const catCourses = selectedDomain.courses.filter((c) => c.category === cat.id);
    const catLessons = catCourses.flatMap((c) => c.units.flatMap((u) => u.lessons));
    const passedLessons = catLessons.filter((l) => completedLessonsMap[l.id]?.passed).length;
    const pct = catLessons.length > 0 ? Math.round((passedLessons / catLessons.length) * 100) : 0;
    return {
      category: cat,
      courseCount: catCourses.length,
      lessonCount: catLessons.length,
      passedCount: passedLessons,
      pct,
    };
  });

  const handleComingSoonClick = (courseTitle: string) => {
    setToastMessage(`「${courseTitle}」は現在教材の準備中です。順次公開予定！💧`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div className="flex-1 w-full flex flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-slate-100 min-h-screen pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-cyan-300 text-xs sm:text-sm font-bold py-2.5 px-5 rounded-full shadow-2xl backdrop-blur-md border border-cyan-400/40 animate-in fade-in slide-in-from-top duration-300 max-w-[90%] text-center">
          {toastMessage}
        </div>
      )}

      {/* Hero Header Area (Deep Ocean Portal Style) */}
      <div className="relative overflow-hidden bg-gradient-to-b from-blue-950/80 via-slate-900/90 to-transparent border-b border-indigo-900/50 pt-5 pb-6 px-4">
        {/* Ambient background glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto w-full space-y-4 relative z-10">
          {/* Top Status Bar Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none select-none">
            {/* Continuous Days Badge */}
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/20 shrink-0 text-xs font-black">
              <Droplet className="w-3.5 h-3.5 fill-white text-white" />
              <span>{streakDays}日連続</span>
            </div>

            {/* Total Stars Badge */}
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-800/90 text-amber-300 border border-amber-400/40 shadow-sm shrink-0 text-xs font-black">
              <Award className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{totalStars} スター</span>
            </div>

            {/* Completed Lessons Badge */}
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-800/90 text-cyan-300 border border-cyan-400/40 shadow-sm shrink-0 text-xs font-black">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>{completedCount} レッスン完了</span>
            </div>

            {/* Review Mistake Badge */}
            {mistakeCount > 0 && (
              <Link
                href="/review"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-400/40 shadow-sm shrink-0 hover:bg-rose-900/80 transition-colors text-xs font-black"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                <span>{mistakeCount}問 要復習</span>
              </Link>
            )}

            {/* Glossary Link */}
            <Link
              href="/glossary"
              className="ml-auto flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 text-blue-300 border border-blue-400/30 text-xs font-black shrink-0 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>用語辞書</span>
            </Link>
          </div>

          {/* Main Portal Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-cyan-300 text-[11px] font-black tracking-wider uppercase mb-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>国家資格・実務必置資格</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                <span>水道技術管理者</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 text-lg sm:text-xl font-bold">
                  マスターポータル
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
                水道法第19条の職責と試験範囲を完全網羅。全20分野のスナックラーニング＆記憶定着ドリル。
              </p>
            </div>

            {/* Mode Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/review"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white font-black text-xs shadow-md shadow-rose-600/25 transition-all transform active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>弱点克服特訓</span>
              </Link>
            </div>
          </div>

          {/* Top Domain Switcher (水道技術管理者 / 水道事業実務 / 下水道事業) */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 overflow-x-auto scrollbar-none">
            {DOMAINS.map((domain) => (
              <button
                key={domain.id}
                onClick={() => setSelectedDomainId(domain.id)}
                className={`px-3.5 py-1.5 rounded-xl font-black text-xs whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedDomainId === domain.id
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/30 border border-cyan-400/40'
                    : 'bg-slate-900/70 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span>{domain.name}</span>
                {domain.id === 'water_technical_manager' && (
                  <span className="text-[10px] bg-cyan-400/30 text-cyan-200 px-1.5 py-0.2 rounded-full font-bold">
                    全20分野
                  </span>
                )}
                {!domain.available && (
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded-full font-bold">
                    準備中
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-4 py-6 space-y-8">
        
        {/* Continue Learning Banner */}
        {continueCourse && (
          <section className="space-y-2">
            <div className="flex items-center justify-between text-xs font-black text-slate-400">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>続きから学ぶ</span>
              </span>
              <span>{continueCompletedLessons}/{continueLessons.length} レッスン</span>
            </div>

            <Link
              href={`/course/${continueCourse.id}`}
              className={`group block relative rounded-2xl overflow-hidden shadow-xl border border-indigo-700/60 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 sm:p-6 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-2xl hover:border-cyan-400/60 active:scale-[0.99] cursor-pointer`}
            >
              {/* Subtle ambient light */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] font-black uppercase">
                      分野 {continueCourse.fieldNumber || 1}
                    </span>
                    <span className="text-xs font-bold text-slate-300">
                      {continueCourse.badge || '学習中'}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                    <span>{continueCourse.title}</span>
                    <ChevronRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-1">
                    {continueCourse.subtitle || continueCourse.description}
                  </p>
                </div>

                {/* Progress Mini Box */}
                <div className="sm:w-56 space-y-1.5 shrink-0 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-400">進捗度</span>
                    <span className="text-cyan-400 font-black">{continueProgressPct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                      style={{ width: `${continueProgressPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* 20 Fields Portal Navigation (When in Tech Manager Domain) */}
        {isTechManagerPortal ? (
          <section className="space-y-5">
            {/* Section Header with Category Tabs */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                    <Layers className="w-5 h-5 text-cyan-400" />
                    <span>分野別ロードマップ</span>
                    <span className="text-xs bg-blue-600/30 text-cyan-300 border border-blue-500/40 px-2 py-0.5 rounded-full font-bold">
                      全20分野
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    試験・講習の公式体系に準拠した4系統から選択して学習を進めます。
                  </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="分野名・重要キーワード検索..."
                    className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-400 text-xs rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* 4 Category Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {TECH_CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/25 border border-cyan-400/50'
                          : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <span>{cat.shortName}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {cat.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category Progress Summary Bar */}
            {selectedCategory === 'all' && !searchQuery && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800">
                {categoryStats.map((item) => (
                  <div key={item.category.id} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-400 truncate">{item.category.shortName}</span>
                      <span className="text-cyan-400 font-black">{item.pct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 rounded-full"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 2-Column Grid of 20 Field Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3.5">
              {filteredCourses.map((course) => {
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
                      className="group relative rounded-2xl overflow-hidden shadow-lg border border-indigo-700/60 bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/80 p-4 sm:p-5 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:border-cyan-400/70 active:scale-[0.99] cursor-pointer flex flex-col justify-between"
                    >
                      {/* Ambient hover light */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl group-hover:bg-cyan-500/20 transition-all pointer-events-none" />

                      <div className="space-y-3 relative z-10">
                        {/* Top Meta Line */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 text-[10px] font-black border border-blue-400/30">
                              分野 {course.fieldNumber ? String(course.fieldNumber).padStart(2, '0') : '01'}
                            </span>
                            {course.badge && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black border border-amber-400/40">
                                {course.badge}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 text-[11px] font-bold text-cyan-300">
                            {isAllPassed ? (
                              <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-500/30">
                                <CheckCircle2 className="w-3 h-3" />
                                完全習得
                              </span>
                            ) : (
                              <span>{completedCourseLessons}/{totalCourseLessons} 済</span>
                            )}
                          </div>
                        </div>

                        {/* Title & Icon */}
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                            {renderFieldIcon(course.iconName)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-black text-white group-hover:text-cyan-300 transition-colors leading-snug">
                              {course.title}
                            </h3>
                            <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5 leading-relaxed">
                              {course.subtitle}
                            </p>
                          </div>
                        </div>

                        {/* Keywords Pills */}
                        {course.keywords && course.keywords.length > 0 && (
                          <div className="flex items-center gap-1 overflow-hidden flex-wrap pt-0.5">
                            {course.keywords.slice(0, 3).map((kw, i) => (
                              <span
                                key={i}
                                className="text-[10px] bg-slate-800/80 text-slate-400 px-1.5 py-0.2 rounded border border-slate-700/60"
                              >
                                #{kw}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Bottom Progress Bar */}
                      <div className="pt-3 mt-3 border-t border-slate-800/80 space-y-1.5 relative z-10">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                          <span>進捗状況</span>
                          <span className="text-cyan-400 font-black">{pct}% 完了</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </Link>
                  );
                }

                // Locked / Coming Soon Course Card
                return (
                  <div
                    key={course.id}
                    onClick={() => handleComingSoonClick(course.title)}
                    className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/40 p-4 sm:p-5 opacity-75 hover:opacity-90 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Top Meta */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-black">
                            分野 {course.fieldNumber ? String(course.fieldNumber).padStart(2, '0') : '00'}
                          </span>
                          {course.badge && (
                            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold">
                              {course.badge}
                            </span>
                          )}
                        </div>

                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-800/70 px-2 py-0.5 rounded-full">
                          <Lock className="w-3 h-3 text-slate-400" />
                          準備中
                        </span>
                      </div>

                      {/* Title & Icon */}
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center shrink-0">
                          {renderFieldIcon(course.iconName)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-black text-slate-300 leading-snug">
                            {course.title}
                          </h3>
                          <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                            {course.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Keywords */}
                      {course.keywords && course.keywords.length > 0 && (
                        <div className="flex items-center gap-1 overflow-hidden flex-wrap pt-0.5">
                          {course.keywords.slice(0, 3).map((kw, i) => (
                            <span
                              key={i}
                              className="text-[10px] bg-slate-800/50 text-slate-400 px-1.5 py-0.2 rounded border border-slate-700/40"
                            >
                              #{kw}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-800/50 flex items-center justify-between text-[11px] text-slate-400 font-bold">
                      <span>予定問題数: 約{course.estimatedQuestions || 150}問</span>
                      <span className="text-cyan-400/80">順次追加予定 →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : (
          /* Standard Domain Courses List (for 水道事業実務 / 下水道事業) */
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-white tracking-tight">
                {selectedDomain.name}
              </h2>
              <span className="text-xs bg-slate-800 text-cyan-300 px-2.5 py-1 rounded-full font-bold border border-slate-700">
                {selectedDomain.courses.length}コース
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
                      className={`group block relative rounded-2xl overflow-hidden shadow-lg border border-indigo-700/60 bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/80 text-white p-6 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:border-cyan-400/70 active:scale-[0.99] cursor-pointer`}
                    >
                      <div className="relative z-10 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-3 py-1 rounded-full bg-blue-500/20 text-cyan-300 text-xs font-black border border-blue-400/30">
                            コース {cIdx + 1}
                          </span>
                          <span className="text-xs font-black text-cyan-300 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
                            {completedCourseLessons}/{totalCourseLessons} 完了
                          </span>
                        </div>

                        <div>
                          <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-cyan-300 transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-300 mt-1 line-clamp-2">
                            {course.subtitle || course.description}
                          </p>
                        </div>

                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                            <span>進捗状況</span>
                            <span className="text-cyan-400 font-black">{pct}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                }

                return (
                  <div
                    key={course.id}
                    className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/40 p-6 opacity-75"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs font-black">
                          コース {cIdx + 1}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5" /> 準備中
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-slate-300">{course.title}</h3>
                      <p className="text-xs text-slate-400">{course.description}</p>
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
