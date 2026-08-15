'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  Play,
  Award,
  BookOpen,
  RotateCcw,
  Sparkles,
  Droplet,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { DOMAINS } from '@/data/domains';
import { getUserStats } from '@/lib/storage';
import { UserStats } from '@/types/quiz';

export default function HomePage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [selectedDomainId, setSelectedDomainId] = useState('water_supply');

  useEffect(() => {
    setStats(getUserStats());
  }, []);

  const selectedDomain = DOMAINS.find((d) => d.id === selectedDomainId) || DOMAINS[0];

  // Calculate stats for water finance course
  const completedLessonsMap = stats?.completedLessons || {};
  const completedCount = Object.values(completedLessonsMap).filter((l) => l.passed).length;
  const totalStars = Object.values(completedLessonsMap).reduce((acc, curr) => acc + (curr.stars || 0), 0);
  const mistakeCount = stats?.mistakeHistory.length || 0;

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-8 bg-white">
      {/* Hero Banner (Clean White & Blue Tint) */}
      <div className="rounded-3xl p-6 sm:p-8 border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-cyan-50 to-white text-slate-900 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-600 text-white shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              異動直後の職員必見！スキマ時間でマスター
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              水道事業ステップアップドリル
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-bold">
              3条・4条の違い、企業債（据置なし30年・4.5%）、減価償却費・資産減耗費の非資金性、料金回収率や内部留保（21億円維持）を**全150問（全15レッスン）**でサクッと学習。
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-3">
            <Link
              href="/course/water_finance"
              className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              全15レッスン一覧へ
            </Link>
            <Link
              href="/glossary"
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-blue-700 font-black text-sm border-2 border-blue-200 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <BookOpen className="w-4 h-4 text-blue-600" />
              用語辞書を見る
            </Link>
          </div>
        </div>
      </div>

      {/* User Progress Stats Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl p-4 border-2 border-blue-200 bg-white shadow-md">
          <p className="text-xs font-black text-slate-600 mb-1">合格レッスン数</p>
          <p className="text-xl sm:text-2xl font-black text-blue-700">
            {completedCount} <span className="text-xs text-slate-600 font-bold">/ 15 レッスン</span>
          </p>
        </div>

        <div className="rounded-2xl p-4 border-2 border-blue-200 bg-white shadow-md">
          <p className="text-xs font-black text-slate-600 mb-1">獲得した星</p>
          <p className="text-xl sm:text-2xl font-black text-amber-600 flex items-center gap-1">
            {totalStars} <span className="text-xs text-slate-600 font-bold">/ 45 Stars</span>
          </p>
        </div>

        <div className="rounded-2xl p-4 border-2 border-blue-200 bg-white shadow-md">
          <p className="text-xs font-black text-slate-600 mb-1">全問題数</p>
          <p className="text-xl sm:text-2xl font-black text-emerald-700">
            150 <span className="text-xs text-slate-600 font-bold">問収載</span>
          </p>
        </div>

        <Link
          href="/review"
          className="rounded-2xl p-4 border-2 border-amber-300 bg-amber-50 hover:bg-amber-100/80 cursor-pointer block shadow-md transition-colors"
        >
          <p className="text-xs font-black text-amber-900 mb-1 flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
            要復習の弱点問題
          </p>
          <p className="text-xl sm:text-2xl font-black text-amber-700">
            {mistakeCount} <span className="text-xs font-bold">問</span>
          </p>
        </Link>
      </div>

      {/* Domain Extensibility Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Droplet className="w-5 h-5 text-blue-600 fill-blue-500/20" />
            学習分野を選択 (ドメイン)
          </h2>
          <span className="text-xs text-slate-600 font-black">※今後他分野へ拡張可能</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {DOMAINS.map((domain) => (
            <button
              key={domain.id}
              onClick={() => setSelectedDomainId(domain.id)}
              className={`px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 border-2 cursor-pointer ${
                selectedDomainId === domain.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/30'
                  : 'bg-white text-slate-800 border-slate-300 hover:border-blue-400'
              }`}
            >
              <span>{domain.name}</span>
              {!domain.available && (
                <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                  準備中
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedDomain.courses.map((course) => (
            <div
              key={course.id}
              className="rounded-2xl p-6 border-2 border-blue-200 bg-white flex flex-col justify-between gap-4 shadow-lg hover:border-blue-500 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
                    <Building2 className="w-6 h-6" />
                  </div>
                  {/* High Contrast Blue Badge */}
                  <span className="text-xs font-black text-white bg-blue-600 px-3 py-1.5 rounded-full shadow-md shadow-blue-600/25">
                    全15レッスン / 150問
                  </span>
                </div>

                {/* High Contrast Text */}
                <h3 className="text-lg font-black text-slate-900 leading-snug">
                  {course.title}
                </h3>
                <p className="text-xs text-blue-700 font-black">
                  {course.subtitle}
                </p>
                <p className="text-xs text-slate-700 font-bold leading-relaxed">
                  {course.description}
                </p>
              </div>

              <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
                <span className="text-xs text-slate-700 font-black">
                  単元数: 3単元（150問）
                </span>
                <Link
                  href={`/course/${course.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-600/30 transition-all cursor-pointer"
                >
                  コースを見る
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
