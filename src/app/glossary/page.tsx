'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Search, Lightbulb, Droplets, Sparkles } from 'lucide-react';
import { WATER_GLOSSARY_TERMS } from '@/data/glossary';

export default function GlossaryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', ...Array.from(new Set(WATER_GLOSSARY_TERMS.map((t) => t.category)))];

  const filteredTerms = WATER_GLOSSARY_TERMS.filter((term) => {
    const matchesCategory = selectedCategory === 'ALL' || term.category === selectedCategory;
    const matchesSearch =
      term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.oneLineSummary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.fullExplanation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (term.reading && term.reading.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6 bg-slate-50/50 min-h-screen">
      {/* Header Back Link & Banner */}
      <div className="space-y-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-white px-3 py-1.5 rounded-full border border-blue-200 shadow-sm transition-all hover:shadow"
        >
          <ArrowLeft className="w-4 h-4" />
          ホームへ戻る
        </Link>

        {/* Hero Header Banner (Fresh Water Gradient) */}
        <div className="rounded-3xl p-6 md:p-8 border-2 border-blue-200 bg-gradient-to-br from-cyan-50 via-blue-50 to-white text-slate-900 shadow-lg relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30 shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-black text-blue-600 bg-blue-100/80 px-2.5 py-0.5 rounded-full mb-1">
                <Droplets className="w-3.5 h-3.5" />
                水道事業の基礎知識
              </div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                水道事業 用語辞書・解説集
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                重要単語を「一言イメージ」と「日常のたとえ」でサクッと確認
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-blue-200 shadow-md space-y-3.5">
        <div className="relative">
          <Search className="w-4 h-4 text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="用語、キーワード、読み仮名で検索... (例: 3条, 企業債, 減価償却)"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-blue-100 focus:border-blue-500 focus:bg-white rounded-xl text-xs md:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer shadow-sm ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-blue-600/30 scale-105'
                  : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700 border border-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'すべて' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTerms.length > 0 ? (
          filteredTerms.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl p-5 md:p-6 border-2 border-blue-100 hover:border-blue-300 shadow-md hover:shadow-lg transition-all space-y-3.5"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 border-b border-blue-50 pb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-blue-700 bg-blue-100 border border-blue-200 px-2.5 py-0.5 rounded-full">
                      {t.category}
                    </span>
                    {t.reading && (
                      <span className="text-xs text-slate-500 font-medium">
                        {t.reading}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
                    {t.term}
                  </h2>
                </div>

                <div className="inline-flex items-center gap-1.5 text-xs font-black text-blue-800 bg-cyan-50 border border-cyan-200 px-3 py-1.5 rounded-xl shrink-0">
                  <span className="text-cyan-600 font-bold">要約:</span>
                  <span>{t.oneLineSummary}</span>
                </div>
              </div>

              {/* Everyday Analogy (日常のたとえ) */}
              <div className="bg-amber-50/80 border-2 border-amber-200/80 rounded-xl p-3.5 text-xs md:text-sm text-amber-950 flex items-start gap-2.5">
                <div className="p-1 rounded-lg bg-amber-200/60 text-amber-800 shrink-0 mt-0.5">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div className="leading-relaxed">
                  <span className="font-black text-amber-800 mr-1.5">日常のたとえ:</span>
                  <span className="font-medium">{t.analogy}</span>
                </div>
              </div>

              {/* Full Explanation */}
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-blue-700 flex items-center gap-1">
                  実務・詳細解説
                </h3>
                <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-normal">
                  {t.fullExplanation}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl p-10 text-center border-2 border-dashed border-blue-200 text-slate-500 text-sm">
            検索条件に一致する用語が見つかりませんでした。
          </div>
        )}
      </div>
    </div>
  );
}
