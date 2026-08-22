'use client';

import React from 'react';
import { PieChart, HardDrive, Droplets, Layers } from 'lucide-react';
import { BreakdownGraph } from '@/types/quiz';

interface BreakdownGraphCardProps {
  graph: BreakdownGraph;
  isExplanation?: boolean;
}

const DEFAULT_COLORS = [
  '#0284c7', // Sky Blue
  '#f43f5e', // Rose
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#64748b', // Slate
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#ec4899', // Pink
];

export default function BreakdownGraphCard({
  graph,
  isExplanation = false,
}: BreakdownGraphCardProps) {
  if (!graph || !graph.items || graph.items.length === 0) return null;

  return (
    <div
      className={`my-3.5 sm:my-4.5 rounded-3xl overflow-hidden border-2 shadow-sm ${
        isExplanation
          ? 'border-cyan-200 bg-cyan-50/30 dark:bg-slate-900/80 dark:border-cyan-900/60'
          : 'border-slate-200/90 bg-white/95 dark:bg-slate-800/90 dark:border-slate-700'
      }`}
    >
      {/* Title Bar */}
      {graph.title && (
        <div
          className={`px-4 py-3 text-xs sm:text-sm font-black flex items-center justify-between border-b ${
            isExplanation
              ? 'bg-cyan-100/70 text-cyan-950 border-cyan-200 dark:bg-cyan-950/70 dark:text-cyan-200 dark:border-cyan-900/60'
              : 'bg-slate-100/90 text-slate-800 border-slate-200/90 dark:bg-slate-700/80 dark:text-slate-200 dark:border-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>{graph.title}</span>
          </div>
        </div>
      )}

      <div className="p-4 sm:p-5 space-y-4">
        {/* Stacked Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full h-3.5 sm:h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden flex shadow-inner">
            {graph.items.map((item, idx) => {
              const color = item.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
              return (
                <div
                  key={idx}
                  style={{
                    width: `${Math.max(item.percentage, 1)}%`,
                    backgroundColor: color,
                  }}
                  className="h-full transition-all duration-700 first:rounded-l-full last:rounded-r-full"
                  title={`${item.label}: ${item.value} (${item.percentage}%)`}
                />
              );
            })}
          </div>

          {/* Sub Totals (Left / Right) */}
          {(graph.totalLabel || graph.subLabel) && (
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 px-0.5 pt-0.5">
              <span>{graph.totalLabel}</span>
              <span>{graph.subLabel}</span>
            </div>
          )}
        </div>

        {/* Breakdown Items List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-750/60 pt-1">
          {graph.items.map((item, idx) => {
            const color = item.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length];

            return (
              <div
                key={idx}
                className="py-2.5 flex items-center justify-between text-xs sm:text-sm font-bold first:pt-0 last:pb-0"
              >
                {/* Left: Dot & Label */}
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-slate-800 dark:text-slate-100 truncate">
                    {item.label}
                  </span>
                </div>

                {/* Right: Value & Percentage */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-slate-700 dark:text-slate-300 font-extrabold">
                    {item.value}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500 text-xs min-w-[42px] text-right font-medium">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
