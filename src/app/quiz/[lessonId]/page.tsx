'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { getLessonById } from '@/data/domains';
import QuizPlayer from '@/components/QuizPlayer';
import { getCourseTheme } from '@/data/themes';

export default function LessonQuizPage() {
  const router = useRouter();
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
      {/* Simple Back Button */}
      <div className="max-w-2xl mx-auto w-full px-3 sm:px-5 mb-1 flex items-center">
        <a
          href={`/course/${course.id}`}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-sky-200/90 dark:border-slate-700 shadow-sm flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
          title="戻る"
          aria-label="レッスン選択へ戻る"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </a>
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
