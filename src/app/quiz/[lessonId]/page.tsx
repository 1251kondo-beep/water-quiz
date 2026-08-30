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
      <div className="flex-1 max-w-xl mx-auto py-12 px-4 text-center">
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
    <div className={`flex-1 w-full flex flex-col ${theme.pageBg} py-3 sm:py-5 pb-8 sm:pb-12 transition-colors duration-500`}>
      <div className="max-w-4xl mx-auto w-full px-3 sm:px-6 mb-2 sm:mb-3 flex items-center justify-between">
        <Link
          href={`/course/${course.id}`}
          className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-black ${theme.accentText} hover:opacity-80 bg-white/95 dark:bg-slate-800/90 border ${theme.progressCardBorder} px-3.5 py-1.5 rounded-full shadow-sm transition-all hover:bg-white active:scale-95 cursor-pointer`}
          title="レッスン選択へ戻る"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          <span>{course.title}</span>
        </Link>

        <span className={`text-[11px] font-black ${theme.accentText} bg-white/95 dark:bg-slate-800/90 border ${theme.progressCardBorder} px-3 py-1 rounded-full shadow-sm`}>
          Lesson {lesson.lessonNumber}
        </span>
      </div>

      <div className="flex-1 w-full">
        <QuizPlayer
          lesson={lesson}
          unitTitle={unit.title}
          courseId={course.id}
        />
      </div>
    </div>
  );
}
