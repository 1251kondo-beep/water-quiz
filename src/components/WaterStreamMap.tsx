'use client';

import React, { useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Check, Lock, Star, Play, Layers } from 'lucide-react';
import { Unit, Lesson, LessonResult } from '@/types/quiz';
import WaterMascot from '@/components/WaterMascot';
import { getCourseTheme } from '@/data/themes';

interface WaterStreamMapProps {
  units: Unit[];
  completedMap: Record<string, LessonResult>;
  onLockClick?: (lessonTitle: string, isComingSoon?: boolean) => void;
  courseId?: string;
}

export default function WaterStreamMap({
  units,
  completedMap,
  onLockClick,
  courseId,
}: WaterStreamMapProps) {
  const theme = getCourseTheme(courseId);

  // Flatten all lessons across all units to determine global unlock/completion & active position
  const allLessonsWithUnit = useMemo(() => {
    return units.flatMap((unit) =>
      unit.lessons.map((lesson) => ({
        unit,
        lesson,
      }))
    );
  }, [units]);

  const globalLessonStates = useMemo(() => {
    return allLessonsWithUnit.map(({ unit, lesson }, globalIdx) => {
      const result = completedMap[lesson.id];
      const isCompleted = !!result && result.passed;
      const prev = globalIdx > 0 ? allLessonsWithUnit[globalIdx - 1].lesson : null;
      const prevPassed = prev ? !!completedMap[prev.id]?.passed : true;
      const isComingSoon = lesson.isComingSoon ?? false;
      const isUnlocked = !isComingSoon && (globalIdx === 0 || prevPassed || isCompleted);

      return {
        unitId: unit.id,
        unitNumber: unit.unitNumber,
        lesson,
        globalIdx,
        isCompleted,
        isUnlocked,
        isComingSoon,
        result,
        stars: result?.stars || 0,
      };
    });
  }, [allLessonsWithUnit, completedMap]);

  // 1. Identify the mascot position:
  // Place on the latest completed lesson. If none completed, place on the first lesson.
  const activeMascotLessonId = useMemo(() => {
    const passedStates = globalLessonStates.filter((s) => s.isCompleted);
    if (passedStates.length === 0) {
      return globalLessonStates[0]?.lesson.id || '';
    }
    const latestPassed = passedStates.reduce((latest, curr) => {
      if (!latest.result?.completedAt) return curr;
      if (!curr.result?.completedAt) return latest;
      return new Date(curr.result.completedAt) > new Date(latest.result.completedAt)
        ? curr
        : latest;
    });
    return latestPassed.lesson.id;
  }, [globalLessonStates]);

  // 2. Identify the NEXT lesson:
  // The first unlocked, incomplete lesson
  const nextLessonId = useMemo(() => {
    const nextState = globalLessonStates.find((s) => !s.isCompleted && s.isUnlocked);
    return nextState?.lesson.id || null;
  }, [globalLessonStates]);

  // 3. Auto-scroll to the mascot's position on mount
  useEffect(() => {
    const targetId = activeMascotLessonId;
    if (!targetId) return;

    // Small timeout to allow DOM layout to settle
    const timer = setTimeout(() => {
      const el = document.getElementById(`lesson-node-${targetId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [activeMascotLessonId]);

  return (
    <div className="relative w-full max-w-xl mx-auto pt-2 pb-16 px-2 sm:px-4 select-none">
      {/* Background Water Decor with dynamic theme colors */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-35">
        <div className={`absolute top-1/6 left-4 w-56 h-56 rounded-full ${theme.bgBlur1} blur-3xl`} />
        <div className={`absolute top-1/2 right-4 w-64 h-64 rounded-full ${theme.bgBlur2} blur-3xl`} />
        <div className={`absolute top-5/6 left-6 w-56 h-56 rounded-full ${theme.bgBlur3} blur-3xl`} />
        
        {/* Floating bubbles */}
        <div className="absolute top-12 left-8 w-6 h-6 rounded-full border-2 border-cyan-400/40 bg-white/30 animate-float-slow" />
        <div className="absolute top-48 right-10 w-4 h-4 rounded-full border-2 border-sky-400/40 bg-white/40 animate-bounce-subtle" />
        <div className="absolute top-96 left-12 w-8 h-8 rounded-full border-2 border-blue-400/30 bg-white/20 animate-float-slow" />
        <div className="absolute bottom-48 right-14 w-5 h-5 rounded-full border-2 border-cyan-400/50 bg-white/30 animate-bounce-subtle" />
      </div>

      {/* Render each Unit section with flowing stream connecting continuously */}
      <div className="space-y-12 sm:space-y-16">
        {units.map((unit, uIdx) => {
          const unitLessons = unit.lessons;
          const unitPassedCount = unitLessons.filter((l) => completedMap[l.id]?.passed).length;
          const isUnitAllPassed = unitPassedCount === unitLessons.length && unitLessons.length > 0;

          return (
            <div key={unit.id} id={`section-${unit.unitNumber}`} className="relative scroll-mt-24">
              {/* Prominent Section Header (大きく目立つセクションタイトル) */}
              <div className="text-center mb-6 pt-4 space-y-2 px-3">
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${theme.sectionHeaderBadge} font-black text-xs sm:text-sm tracking-wide`}>
                  <Layers className="w-4 h-4" />
                  <span>Section {unit.unitNumber}</span>
                  <span className="bg-white/25 px-2 py-0.2 rounded-full text-[11px]">
                    {unitPassedCount}/{unitLessons.length}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-blue-950 tracking-tight leading-snug">
                  {unit.title.includes(':') ? unit.title.split(':')[1].trim() : unit.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 font-bold max-w-md mx-auto leading-relaxed">
                  {unit.description}
                </p>
              </div>

              {/* Section Stream & Lessons */}
              <div className="relative">
                {/* SVG Water Pipe System */}
                <svg
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  preserveAspectRatio="none"
                  viewBox={`0 0 440 ${Math.max(unitLessons.length * 145 + 60, 440)}`}
                >
                  <defs>
                    {/* Water flow gradient */}
                    <linearGradient id={`pipeWaterGrad-${unit.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={theme.streamGradStart} stopOpacity="0.9" />
                      <stop offset="50%" stopColor={theme.streamGradMid} stopOpacity="0.95" />
                      <stop offset="100%" stopColor={theme.streamGradEnd} stopOpacity="0.9" />
                    </linearGradient>

                    {/* Shimmering Band Gradients (帯状のきらきらグラデーション) */}
                    <linearGradient id={`shimmerBandGrad1-${unit.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                      <stop offset="30%" stopColor="#a5f3fc" stopOpacity="0.85" />
                      <stop offset="50%" stopColor="#ffffff" stopOpacity="0.95" />
                      <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
                    </linearGradient>
                    <linearGradient id={`shimmerBandGrad2-${unit.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#ffffff" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#a5f3fc" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>

                  {/* Continuous Pipeline & River Stream Rendering */}
                  {(() => {
                    const total = unitLessons.length;
                    if (total === 0) return null;

                    // 1. Build Single Full Continuous Path for the entire pipeline (完全シームレス・ゼロ継ぎ目)
                    const x0 = 150;
                    const y0 = 65;
                    let fullPipePathD = `M ${x0} ${y0 - 45} C ${x0} ${y0 - 25}, ${x0} ${y0 - 10}, ${x0} ${y0}`;
                    for (let i = 1; i < total; i++) {
                      const prevY = (i - 1) * 145 + 65;
                      const prevX = (i - 1) % 2 === 0 ? 150 : 290;
                      const currY = i * 145 + 65;
                      const currX = i % 2 === 0 ? 150 : 290;
                      const midY = (prevY + currY) / 2;
                      fullPipePathD += ` C ${prevX} ${midY + 20}, ${currX} ${midY - 20}, ${currX} ${currY}`;
                    }
                    const lastY = (total - 1) * 145 + 65;
                    const lastX = (total - 1) % 2 === 0 ? 150 : 290;
                    fullPipePathD += ` C ${lastX} ${lastY + 30}, 220 ${lastY + 50}, 220 ${lastY + 80}`;

                    // 2. Build Single Continuous Flowing Path up to the unlocked/completed frontier
                    let flowingPathD = '';
                    const firstGlobalState = globalLessonStates.find(
                      (s) => s.lesson.id === unitLessons[0]?.id
                    );

                    if (firstGlobalState?.isUnlocked) {
                      flowingPathD = `M ${x0} ${y0 - 45} C ${x0} ${y0 - 25}, ${x0} ${y0 - 10}, ${x0} ${y0}`;

                      for (let i = 1; i < total; i++) {
                        const prevLesson = unitLessons[i - 1];
                        const prevGlobalState = globalLessonStates.find(
                          (s) => s.lesson.id === prevLesson.id
                        );

                        // If previous lesson is completed, flow seamlessly into the next lesson!
                        if (prevGlobalState?.isCompleted) {
                          const prevY = (i - 1) * 145 + 65;
                          const prevX = (i - 1) % 2 === 0 ? 150 : 290;
                          const currY = i * 145 + 65;
                          const currX = i % 2 === 0 ? 150 : 290;
                          const midY = (prevY + currY) / 2;
                          flowingPathD += ` C ${prevX} ${midY + 20}, ${currX} ${midY - 20}, ${currX} ${currY}`;
                        } else {
                          // Stop flowing at the incomplete lesson frontier
                          break;
                        }
                      }

                      // If the last lesson of this unit is also completed, flow into the exit tube
                      const lastLesson = unitLessons[total - 1];
                      const lastGlobalState = globalLessonStates.find(
                        (s) => s.lesson.id === lastLesson?.id
                      );
                      if (lastGlobalState?.isCompleted) {
                        flowingPathD += ` C ${lastX} ${lastY + 30}, 220 ${lastY + 50}, 220 ${lastY + 80}`;
                      }
                    }

                    return (
                      <g>
                        {/* ======================================================== */}
                        {/* BASE CONTINUOUS PIPE (継ぎ目のない一本の美しい水道管) */}
                        {/* ======================================================== */}

                        {/* Layer 1: Pipe Drop Shadow */}
                        <path
                          d={fullPipePathD}
                          fill="none"
                          stroke="rgba(15, 23, 42, 0.12)"
                          strokeWidth="44"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          transform="translate(0, 4)"
                        />

                        {/* Layer 2: Outer Pipe Casing (Metallic Wall) */}
                        <path
                          d={fullPipePathD}
                          fill="none"
                          stroke="#64748b"
                          strokeWidth="38"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          opacity="0.4"
                        />

                        {/* Layer 3: Inner Pipe Wall (Rim) */}
                        <path
                          d={fullPipePathD}
                          fill="none"
                          stroke="#94a3b8"
                          strokeWidth="30"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          opacity="0.35"
                        />

                        {/* Layer 4: Dry Pipe Bore (Empty Channel) */}
                        <path
                          d={fullPipePathD}
                          fill="none"
                          stroke="#334155"
                          strokeWidth="22"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          opacity="0.25"
                        />

                        {/* ======================================================== */}
                        {/* FLOWING WATER PIPE (クリア済み区間：通水 & 川のせせらぎ) */}
                        {/* ======================================================== */}
                        {flowingPathD && (
                          <g>
                            {/* Water Pipe Active Outer Casing */}
                            <path
                              d={flowingPathD}
                              fill="none"
                              stroke={theme.streamGradStart}
                              strokeWidth="38"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              opacity="0.92"
                            />

                            {/* Water Pipe Active Inner Rim */}
                            <path
                              d={flowingPathD}
                              fill="none"
                              stroke={theme.streamBaseColor}
                              strokeWidth="30"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              opacity="0.95"
                            />

                            {/* Filled Water Channel (Base Stream) */}
                            <path
                              d={flowingPathD}
                              fill="none"
                              stroke={`url(#pipeWaterGrad-${unit.id})`}
                              strokeWidth="22"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              opacity="0.98"
                            />

                            {/* Shimmering Water Band 1: 幅広のきらめく光の帯 (幅18px) */}
                            <path
                              d={flowingPathD}
                              fill="none"
                              stroke={`url(#shimmerBandGrad1-${unit.id})`}
                              strokeWidth="18"
                              strokeDasharray="90 50 140 60"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="animate-shimmer-band-1 animate-shimmer-gleam"
                            />

                            {/* Shimmering Water Band 2: 中央を走る第二の光彩帯 (幅12px) */}
                            <path
                              d={flowingPathD}
                              fill="none"
                              stroke={`url(#shimmerBandGrad2-${unit.id})`}
                              strokeWidth="12"
                              strokeDasharray="60 90 80 70"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="animate-shimmer-band-2"
                            />

                            {/* Shimmering Water Band 3: 水面のきらめきクレスト (幅6px) */}
                            <path
                              d={flowingPathD}
                              fill="none"
                              stroke="#ffffff"
                              strokeWidth="6"
                              strokeDasharray="40 120 70 90"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeOpacity="0.75"
                              className="animate-shimmer-band-1"
                            />
                          </g>
                        )}

                        {/* Layer 6: Pipe Surface Glass/Metallic Reflection (全管共通の光沢反射) */}
                        <path
                          d={fullPipePathD}
                          fill="none"
                          stroke="rgba(255, 255, 255, 0.55)"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    );
                  })()}
                </svg>

                {/* Lesson Nodes */}
                <div className="relative z-10 space-y-8 sm:space-y-9">
                  {unitLessons.map((lesson, idx) => {
                    const globalState = globalLessonStates.find(
                      (s) => s.lesson.id === lesson.id
                    );
                    const isCompleted = globalState?.isCompleted || false;
                    const isUnlocked = globalState?.isUnlocked || false;
                    const isComingSoon = globalState?.isComingSoon ?? lesson.isComingSoon ?? false;
                    const stars = globalState?.stars || 0;
                    const result = globalState?.result;

                    const isLeft = idx % 2 === 0;
                    const hasMascot = lesson.id === activeMascotLessonId;
                    const isNext = lesson.id === nextLessonId;

                    // Clean title
                    const displayTitle = lesson.title.replace(/^Lesson\s*\d+[-_]\d+:\s*/i, '');

                    return (
                      <div
                        key={lesson.id}
                        id={`lesson-node-${lesson.id}`}
                        className={`flex items-center w-full transition-transform duration-300 scroll-mt-28 ${
                          isLeft ? 'justify-start pl-0 sm:pl-2' : 'justify-end pr-0 sm:pr-2'
                        }`}
                      >
                        {isUnlocked ? (
                          <Link
                            href={`/quiz/${lesson.id}`}
                            className="group relative inline-flex items-center focus:outline-none max-w-[88%] sm:max-w-[82%]"
                          >
                            {/* Mascot riding on this node (解き終わった最新レッスンの位置) */}
                            {hasMascot && (
                              <div
                                className={`absolute -top-7 z-30 transition-transform group-hover:scale-110 pointer-events-none flex items-center gap-1 ${
                                  isLeft ? 'left-1 sm:left-2' : 'right-1 sm:right-2 flex-row-reverse'
                                }`}
                              >
                                <WaterMascot size={46} mood={isCompleted ? 'cheering' : 'happy'} />
                                <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md border border-white/80 whitespace-nowrap animate-bounce-subtle">
                                  {isCompleted ? 'クリア! 💧' : '現在地 🚩'}
                                </span>
                              </div>
                            )}

                            {/* NEXT Badge on the next unlocked incomplete lesson */}
                            {isNext && (
                              <div
                                className={`absolute -top-3.5 z-30 pointer-events-none flex items-center gap-1 ${
                                  isLeft ? 'right-4 sm:right-6' : 'left-4 sm:left-6'
                                }`}
                              >
                                <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-md border-2 border-white tracking-wider flex items-center gap-1 shadow-orange-500/30">
                                  <Play className="w-2.5 h-2.5 fill-current" />
                                  NEXT
                                </span>
                              </div>
                            )}

                            {/* Node Container */}
                            <div
                              className={`relative flex items-center rounded-3xl sm:rounded-full p-1.5 transition-all duration-300 transform group-hover:scale-105 active:scale-95 w-full ${
                                isCompleted
                                  ? `bg-white shadow-[0_6px_20px_rgba(13,148,136,0.18)] border-2 ${theme.nodeCompletedBorder}`
                                  : isNext
                                  ? `bg-white shadow-[0_8px_25px_rgba(249,115,22,0.25)] border-2 border-amber-400 ring-4 ring-amber-300/40`
                                  : hasMascot
                                  ? `bg-white shadow-[0_8px_25px_rgba(13,148,136,0.3)] border-2 ${theme.nodeActiveBorder} ring-4 ${theme.nodeActiveRing}`
                                  : 'bg-white shadow-md border-2 border-slate-200'
                              }`}
                              style={{
                                flexDirection: isLeft ? 'row' : 'row-reverse',
                              }}
                            >
                              {/* Circle Icon Badge */}
                              <div
                                className={`shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-md m-1 transition-all ${
                                  isCompleted
                                    ? `bg-gradient-to-br ${theme.nodeCompletedGrad} text-white`
                                    : isNext
                                    ? `bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-orange-400/30`
                                    : hasMascot
                                    ? `bg-gradient-to-br ${theme.nodeActiveGrad} text-white animate-water-pulse`
                                    : 'bg-slate-100 text-slate-400'
                                }`}
                              >
                                {isCompleted ? (
                                  <Check className="w-6 h-6 sm:w-7 sm:h-7 stroke-[3.5]" />
                                ) : (
                                  <span className="text-lg sm:text-xl font-black">{lesson.lessonNumber}</span>
                                )}
                              </div>

                              {/* Text Body */}
                              <div
                                className={`py-1.5 px-2.5 sm:px-3.5 flex-1 min-w-0 ${
                                  isLeft ? 'text-left' : 'text-right'
                                }`}
                              >
                                <div className={`flex items-center gap-1.5 ${isLeft ? 'justify-start' : 'justify-end'}`}>
                                  <span
                                    className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider ${
                                      isCompleted
                                        ? 'text-cyan-700'
                                        : isNext
                                        ? 'text-orange-600 font-extrabold'
                                        : hasMascot
                                        ? 'text-blue-600'
                                        : 'text-slate-500'
                                    }`}
                                  >
                                    Lesson {lesson.lessonNumber}
                                  </span>

                                  {isCompleted && stars > 0 && (
                                    <div className="flex items-center gap-0.5">
                                      {[1, 2, 3].map((s) => (
                                        <Star
                                          key={s}
                                          className={`w-3 h-3 ${
                                            s <= stars
                                              ? 'text-amber-400 fill-amber-400'
                                              : 'text-slate-200 fill-slate-200'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                  )}
                                </div>

                                <h4
                                  className={`text-xs sm:text-sm font-black whitespace-normal break-words leading-snug mt-0.5 ${
                                    isCompleted
                                      ? 'text-slate-900'
                                      : isNext
                                      ? 'text-orange-950 font-black'
                                      : hasMascot
                                      ? 'text-blue-950'
                                      : 'text-slate-800'
                                  }`}
                                >
                                  {displayTitle}
                                </h4>

                                {isCompleted && result && (
                                  <p className="text-[10px] font-bold text-emerald-600 mt-0.5">
                                    合格 ({result.percentage}点)
                                  </p>
                                )}
                                {!isCompleted && (isNext || hasMascot) && (
                                  <p className={`text-[10px] font-bold ${isNext ? 'text-orange-600' : 'text-blue-600'} flex items-center gap-1 mt-0.5 ${
                                    isLeft ? 'justify-start' : 'justify-end'
                                  }`}>
                                    <Play className="w-2.5 h-2.5 fill-current" />
                                    10問に挑戦する
                                  </p>
                                )}
                              </div>
                            </div>
                          </Link>
                        ) : (
                          /* Locked Lesson Node */
                          <div
                            onClick={() => onLockClick && onLockClick(displayTitle, isComingSoon)}
                            className="group relative inline-flex items-center cursor-pointer transition-all active:scale-95 max-w-[88%] sm:max-w-[82%]"
                          >
                            <div
                              className="relative flex items-center rounded-3xl sm:rounded-full p-1.5 bg-gradient-to-r from-blue-900 via-indigo-950 to-sky-950 shadow-md border-2 border-sky-700/60 opacity-90 hover:opacity-100 w-full"
                              style={{
                                flexDirection: isLeft ? 'row' : 'row-reverse',
                              }}
                            >
                              <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-950/80 border border-sky-500/40 flex items-center justify-center text-sky-200 m-1 shadow-inner">
                                <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
                              </div>

                              <div
                                className={`py-1.5 px-2.5 sm:px-3.5 flex-1 min-w-0 ${
                                  isLeft ? 'text-left' : 'text-right'
                                }`}
                              >
                                <span className="text-[10px] sm:text-[11px] font-bold text-sky-300 uppercase tracking-wide">
                                  Lesson {lesson.lessonNumber}
                                </span>
                                <h4 className="text-xs sm:text-sm font-black text-sky-50 whitespace-normal break-words leading-snug mt-0.5">
                                  {displayTitle}
                                </h4>
                                <p className="text-[10px] text-sky-300/80 font-medium mt-0.5">
                                  {isComingSoon ? '教材作成中（次回公開予定）' : '前のレッスンをクリアで解放'}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
