'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Play, CheckCircle2, Clock } from 'lucide-react';
import { Lesson, LessonResult } from '@/types/quiz';

interface LessonCardProps {
  lesson: Lesson;
  result?: LessonResult;
}

export default function LessonCard({ lesson, result }: LessonCardProps) {
  const isCompleted = !!result && result.passed;
  const stars = result ? result.stars : 0;

  return (
    <div className="rounded-3xl p-5 border-2 border-sky-200 bg-white/95 backdrop-blur-sm flex flex-col justify-between gap-4 shadow-md hover:border-cyan-400 hover:shadow-xl transition-all">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-black text-white bg-gradient-to-r from-blue-600 to-cyan-600 px-3 py-1 rounded-full shadow-sm">
            Lesson {lesson.lessonNumber}
          </span>

          {isCompleted ? (
            <span className="flex items-center gap-1 text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              合格 ({result.percentage}%)
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-slate-700 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full font-black">
              <Clock className="w-3.5 h-3.5 text-cyan-600" />
              未挑戦
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-black text-slate-900 mb-1.5 leading-snug">
          {lesson.title.replace(/^Lesson\s*\d+[-_]\d+:\s*/i, '')}
        </h3>
        <p className="text-xs text-slate-600 font-bold leading-relaxed line-clamp-2">
          {lesson.subtitle}
        </p>
      </div>

      {/* Footer & Stars */}
      <div className="flex items-center justify-between border-t border-sky-100 pt-3">
        {/* Star Rating */}
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((starIdx) => (
            <Star
              key={starIdx}
              className={`w-4 h-4 ${
                starIdx <= stars
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-slate-200 fill-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Launch Quiz Button */}
        <Link
          href={`/quiz/${lesson.id}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-black text-xs shadow-md shadow-blue-500/25 transition-all active:scale-95 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          {isCompleted ? '再挑戦' : 'スタート'}
        </Link>
      </div>
    </div>
  );
}
