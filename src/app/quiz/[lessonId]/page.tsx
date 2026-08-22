'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { getLessonById } from '@/data/domains';
import QuizPlayer from '@/components/QuizPlayer';
import { getCourseTheme } from '@/data/themes';

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
  const theme = getCourseTheme(course.id);

  return (
    <div className={`min-h-screen ${theme.pageBg} py-4 sm:py-6 transition-colors duration-500`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-3 flex items-center justify-between">
        <Link
          href={`/course/${course.id}`}
          className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-black ${theme.accentText} hover:opacity-80 bg-white/90 border ${theme.progressCardBorder} px-3.5 py-1.5 rounded-full shadow-sm transition-all hover:bg-white active:scale-95`}
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          {course.title}
        </Link>

        <span className={`text-[11px] font-black ${theme.accentText} bg-white/90 border ${theme.progressCardBorder} px-3 py-1 rounded-full shadow-sm`}>
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
