'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getLessonById } from '@/data/domains';
import QuizPlayer from '@/components/QuizPlayer';

export default function LessonQuizPage() {
  const params = useParams();
  const lessonId = params?.lessonId as string;
  const found = getLessonById(lessonId);

  if (!found) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center">
        <p className="text-slate-400 mb-4">指定されたレッスンが見つかりませんでした。</p>
        <Link href="/course/water_finance" className="text-cyan-400 underline text-sm">
          コース一覧へ戻る
        </Link>
      </div>
    );
  }

  const { lesson, unit, course } = found;

  return (
    <div className="py-4">
      <div className="max-w-2xl mx-auto px-4 mb-2">
        <Link
          href={`/course/${course.id}`}
          className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {course.title} 一覧へ戻る
        </Link>
      </div>

      <QuizPlayer
        lesson={lesson}
        unitTitle={unit.title}
        courseId={course.id}
      />
    </div>
  );
}
