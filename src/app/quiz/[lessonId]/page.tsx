'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { getLessonById } from '@/data/domains';
import QuizPlayer from '@/components/QuizPlayer';

export default function LessonQuizPage() {
  const params = useParams();
  const lessonId = params?.lessonId as string;
  const found = getLessonById(lessonId);

  if (!found) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center">
        <p className="text-slate-600 mb-4 font-bold">指定されたレッスンが見つかりませんでした。</p>
        <Link href="/" className="text-blue-600 underline text-sm font-black">
          ホームへ戻る
        </Link>
      </div>
    );
  }

  const { lesson, unit, course } = found;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-cyan-50/40 to-sky-50 py-4 sm:py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-3 flex items-center justify-between">
        <Link
          href={`/course/${course.id}`}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-blue-700 hover:text-blue-800 bg-white/90 border border-sky-200 px-3.5 py-1.5 rounded-full shadow-sm transition-all hover:bg-white active:scale-95"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          {course.title}
        </Link>

        <span className="text-[11px] font-black text-cyan-800 bg-cyan-100/90 border border-cyan-200 px-3 py-1 rounded-full">
          Lesson {lesson.lessonNumber}
        </span>
      </div>

      <QuizPlayer
        lesson={lesson}
        unitTitle={unit.title}
        courseId={course.id}
      />
    </div>
  );
}
