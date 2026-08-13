'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Search, Lightbulb, Tag, Sparkles } from 'lucide-react';
import { WATER_GLOSSARY_TERMS } from '@/data/water_finance';

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
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          ホームへ戻る
        </Link>

        <div className="glass-card rounded-3xl p-6 border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900 to-blue-950/40">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-100">
                水道財政 用語辞書・解説集
              </h1>
              <p className="text-xs text-slate-400">
                『投資財政計画_用語解説.md』の最重要単語を「一言イメージ」と「日常のたとえ」でサクッと確認
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card rounded-2xl p-4 border border-cyan-500/20 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="用語、キーワード、読み仮名で検索... (例: 3条, 企業債, 減価償却)"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs md:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
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
              className="glass-card rounded-2xl p-5 border border-cyan-500/25 space-y-3"
            >
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/30 px-2 py-0.5 rounded">
                      {t.category}
                    </span>
                    {t.reading && (
                      <span className="text-xs text-slate-400 font-normal">
                        {t.reading}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-slate-100">
                    {t.term}
                  </h3>
                </div>

                <span className="text-xs font-bold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2.5 py-1 rounded-lg shrink-0">
                  一言: {t.oneLineSummary}
                </span>
              </div>

              {/* Everyday Analogy */}
              <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-100 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-400">日常のたとえ: </span>
                  <span>{t.analogy}</span>
                </div>
              </div>

              {/* Full Explanation */}
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                {t.fullExplanation}
              </p>
            </div>
          ))
        ) : (
          <div className="glass-card rounded-2xl p-8 text-center text-slate-400 text-sm">
            該当する用語が見つかりませんでした。
          </div>
        )}
      </div>
    </div>
  );
}
