'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Check, Lock, Star, Play } from 'lucide-react';
import { Lesson, LessonResult } from '@/types/quiz';
import WaterMascot from '@/components/WaterMascot';

interface WaterStreamMapProps {
  lessons: Lesson[];
  completedMap: Record<string, LessonResult>;
  onLockClick?: (lessonTitle: string) => void;
}

export default function WaterStreamMap({
  lessons,
  completedMap,
  onLockClick,
}: WaterStreamMapProps) {
  // Determine status for each lesson
  const lessonStates = useMemo(() => {
    return lessons.map((lesson, idx) => {
      const result = completedMap[lesson.id];
      const isCompleted = !!result && result.passed;
      const prevLesson = idx > 0 ? lessons[idx - 1] : null;
      const prevPassed = prevLesson ? !!completedMap[prevLesson.id]?.passed : true;
      const isUnlocked = idx === 0 || prevPassed || isCompleted;

      return {
        lesson,
        index: idx,
        isCompleted,
        isUnlocked,
        result,
        stars: result?.stars || 0,
      };
    });
  }, [lessons, completedMap]);

  // Find first active index
  const currentActiveIdx = lessonStates.findIndex(
    (s) => s.isUnlocked && !s.isCompleted
  );

  return (
    <div className="relative w-full max-w-xl mx-auto py-8 px-2 sm:px-4 overflow-hidden select-none">
      {/* Background Water Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-35">
        <div className="absolute top-1/4 left-4 w-48 h-48 rounded-full bg-cyan-200/50 blur-3xl" />
        <div className="absolute top-2/3 right-4 w-56 h-56 rounded-full bg-blue-200/50 blur-3xl" />
        
        {/* Floating bubbles */}
        <div className="absolute top-12 left-8 w-6 h-6 rounded-full border-2 border-cyan-400/40 bg-white/30 animate-float-slow" />
        <div className="absolute top-48 right-10 w-4 h-4 rounded-full border-2 border-sky-400/40 bg-white/40 animate-bounce-subtle" />
        <div className="absolute top-96 left-12 w-8 h-8 rounded-full border-2 border-blue-400/30 bg-white/20 animate-float-slow" />
        <div className="absolute bottom-24 right-14 w-5 h-5 rounded-full border-2 border-cyan-400/50 bg-white/30 animate-bounce-subtle" />
      </div>

      {/* SVG Stream (The flowing water curve path in the background) */}
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
        viewBox={`0 0 440 ${Math.max(lessons.length * 145 + 60, 440)}`}
      >
        <defs>
          <linearGradient id="streamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.75" />
          </linearGradient>
        </defs>

        {/* Generate S-curve path connecting all lesson nodes */}
        {(() => {
          let pathD = '';
          const total = lessons.length;
          for (let i = 0; i < total; i++) {
            const y = i * 145 + 75;
            const x = i % 2 === 0 ? 150 : 290;
            if (i === 0) {
              pathD += `M ${x} ${y - 40} C ${x} ${y - 20}, ${x} ${y - 10}, ${x} ${y}`;
            } else {
              const prevY = (i - 1) * 145 + 75;
              const prevX = (i - 1) % 2 === 0 ? 150 : 290;
              const midY = (prevY + y) / 2;
              pathD += ` C ${prevX} ${midY + 20}, ${x} ${midY - 20}, ${x} ${y}`;
            }
          }
          if (total > 0) {
            const lastY = (total - 1) * 145 + 75;
            const lastX = (total - 1) % 2 === 0 ? 150 : 290;
            pathD += ` C ${lastX} ${lastY + 30}, 220 ${lastY + 50}, 220 ${lastY + 80}`;
          }

          return (
            <>
              {/* Wide stream base */}
              <path
                d={pathD}
                fill="none"
                stroke="#bae6fd"
                strokeWidth="28"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.6"
              />
              {/* Dashed water current line */}
              <path
                d={pathD}
                fill="none"
                stroke="url(#streamGrad)"
                strokeWidth="5"
                strokeDasharray="8 8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-stream-flow"
              />
            </>
          );
        })()}
      </svg>

      {/* Lesson Nodes on the Stream */}
      <div className="relative z-10 space-y-8 sm:space-y-9">
        {lessonStates.map((state, idx) => {
          const { lesson, isCompleted, isUnlocked, result, stars } = state;
          const isLeft = idx % 2 === 0;
          const isCurrent = idx === (currentActiveIdx === -1 ? 0 : currentActiveIdx);

          // Clean title
          const displayTitle = lesson.title.replace(/^Lesson\s*\d+[-_]\d+:\s*/i, '');

          return (
            <div
              key={lesson.id}
              className={`flex items-center w-full transition-transform duration-300 ${
                isLeft ? 'justify-start pl-0 sm:pl-2' : 'justify-end pr-0 sm:pr-2'
              }`}
            >
              {isUnlocked ? (
                <Link
                  href={`/quiz/${lesson.id}`}
                  className="group relative inline-flex items-center focus:outline-none max-w-[88%] sm:max-w-[82%]"
                >
                  {/* Mascot on the active node */}
                  {isCurrent && (
                    <div
                      className={`absolute -top-7 z-30 transition-transform group-hover:scale-110 ${
                        isLeft ? 'left-3 sm:left-4' : 'right-3 sm:right-4'
                      }`}
                    >
                      <div className="relative">
                        <WaterMascot size={46} mood="cheering" />
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md whitespace-nowrap animate-bounce-subtle">
                          ここから！
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Node Container (Pill + Circle Badge) */}
                  <div
                    className={`relative flex items-center rounded-3xl sm:rounded-full p-1.5 transition-all duration-300 transform group-hover:scale-105 active:scale-95 w-full ${
                      isCompleted
                        ? 'bg-white shadow-[0_6px_20px_rgba(2,132,199,0.18)] border-2 border-sky-300'
                        : isCurrent
                        ? 'bg-white shadow-[0_8px_25px_rgba(2,132,199,0.3)] border-2 border-blue-500 ring-4 ring-sky-300/60'
                        : 'bg-white shadow-md border-2 border-sky-200'
                    }`}
                    style={{
                      flexDirection: isLeft ? 'row' : 'row-reverse',
                    }}
                  >
                    {/* Circle Icon Badge */}
                    <div
                      className={`shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-md m-1 transition-all ${
                        isCompleted
                          ? 'bg-gradient-to-br from-sky-400 to-cyan-500 text-white'
                          : isCurrent
                          ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white animate-water-pulse'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-6 h-6 sm:w-7 sm:h-7 stroke-[3.5]" />
                      ) : (
                        <span className="text-lg sm:text-xl font-black">{lesson.lessonNumber}</span>
                      )}
                    </div>

                    {/* Text Body - Full Title Visible */}
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
                              : isCurrent
                              ? 'text-blue-600'
                              : 'text-slate-500'
                          }`}
                        >
                          Lesson {lesson.lessonNumber}
                        </span>

                        {/* Stars if completed */}
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

                      {/* Full title displayed without truncate */}
                      <h4
                        className={`text-xs sm:text-sm font-black whitespace-normal break-words leading-snug mt-0.5 ${
                          isCompleted
                            ? 'text-slate-900'
                            : isCurrent
                            ? 'text-blue-950'
                            : 'text-slate-800'
                        }`}
                      >
                        {displayTitle}
                      </h4>

                      {/* Status Info */}
                      {isCompleted && result && (
                        <p className="text-[10px] font-bold text-emerald-600 mt-0.5">
                          合格 ({result.percentage}点)
                        </p>
                      )}
                      {isCurrent && (
                        <p className={`text-[10px] font-bold text-blue-600 flex items-center gap-1 mt-0.5 ${
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
                /* Locked Lesson Node - Blue theme (深みのある水・ブルー系) */
                <div
                  onClick={() => onLockClick && onLockClick(displayTitle)}
                  className="group relative inline-flex items-center cursor-pointer transition-all active:scale-95 max-w-[88%] sm:max-w-[82%]"
                >
                  <div
                    className="relative flex items-center rounded-3xl sm:rounded-full p-1.5 bg-gradient-to-r from-blue-900 via-indigo-950 to-sky-950 shadow-md border-2 border-sky-700/60 opacity-90 hover:opacity-100 w-full"
                    style={{
                      flexDirection: isLeft ? 'row' : 'row-reverse',
                    }}
                  >
                    {/* Lock Badge in Blue Tone */}
                    <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-950/80 border border-sky-500/40 flex items-center justify-center text-sky-200 m-1 shadow-inner">
                      <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>

                    {/* Text Body - Full Title Visible in Blue Theme */}
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
                        前のレッスンをクリアで解放
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
  );
}
