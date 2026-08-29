'use client';

import React from 'react';
import {
  Globe,
  Server,
  Laptop,
  Droplet,
  Factory,
  Home,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Network,
} from 'lucide-react';
import { QuizDiagram, DiagramNode } from '@/types/quiz';

interface DiagramFlowCardProps {
  diagram: QuizDiagram;
  isExplanation?: boolean;
}

function getNodeIcon(iconName?: string) {
  switch (iconName?.toLowerCase()) {
    case 'globe':
    case 'internet':
      return <Globe className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-600 dark:text-cyan-400 stroke-[1.75]" />;
    case 'server':
      return <Server className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400 stroke-[1.75]" />;
    case 'laptop':
    case 'browser':
      return <Laptop className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600 dark:text-indigo-400 stroke-[1.75]" />;
    case 'droplet':
    case 'water':
      return <Droplet className="w-6 h-6 sm:w-7 sm:h-7 text-sky-500 dark:text-sky-400 stroke-[1.75] fill-sky-100 dark:fill-sky-950" />;
    case 'factory':
    case 'water_plant':
      return <Factory className="w-6 h-6 sm:w-7 sm:h-7 text-teal-600 dark:text-teal-400 stroke-[1.75]" />;
    case 'cylinder':
    case 'tank':
      return (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border-2 border-cyan-500 dark:border-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 flex flex-col justify-center items-center p-0.5 shadow-xs">
          <span className="text-[9px] sm:text-[10px] font-black text-cyan-800 dark:text-cyan-200 tracking-tighter leading-none">配水池</span>
          <div className="w-5 h-1 bg-cyan-500 dark:bg-cyan-400 rounded-full mt-1 opacity-80" />
        </div>
      );
    case 'home':
      return <Home className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600 dark:text-emerald-400 stroke-[1.75]" />;
    case 'alert':
    case 'alert-triangle':
      return <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 text-amber-500 stroke-[1.75]" />;
    default:
      return <Network className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-600 dark:text-cyan-400 stroke-[1.75]" />;
  }
}

export default function DiagramFlowCard({
  diagram,
  isExplanation = false,
}: DiagramFlowCardProps) {
  if (!diagram || !diagram.nodes || diagram.nodes.length === 0) return null;

  const cleanTitle = diagram.title ? diagram.title.replace(/^[\p{Emoji}\u2000-\u3300\s]+/u, '') : '';

  return (
    <div
      className={`my-3.5 sm:my-4.5 rounded-3xl overflow-hidden border-2 shadow-sm ${
        isExplanation
          ? 'border-cyan-200 bg-cyan-50/30 dark:bg-slate-900/80 dark:border-cyan-900/60'
          : 'border-slate-200/90 bg-white/95 dark:bg-slate-800/90 dark:border-slate-700'
      }`}
    >
      {/* Title Bar (マークは1つのみ) */}
      {cleanTitle && (
        <div
          className={`px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-black flex items-center gap-2 border-b ${
            isExplanation
              ? 'bg-cyan-100/70 text-cyan-950 border-cyan-200 dark:bg-cyan-950/70 dark:text-cyan-200 dark:border-cyan-900/60'
              : 'bg-slate-100/90 text-slate-800 border-slate-200/90 dark:bg-slate-700/80 dark:text-slate-200 dark:border-slate-700'
          }`}
        >
          <Network className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
          <span>{cleanTitle}</span>
        </div>
      )}

      {/* Nodes Container */}
      <div className="p-3.5 sm:p-5">
        {diagram.type === 'grid' || diagram.type === 'compare' ? (
          /* 2x2 または 4列のグリッド配置（矢印なし・並列課題・比較用） */
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 py-1">
            {diagram.nodes.map((node, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-750/70 border border-slate-200/90 dark:border-slate-700 shadow-xs transition-transform hover:scale-[1.02]"
              >
                {/* Icon Box */}
                <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-650 flex items-center justify-center shadow-xs mb-2">
                  {getNodeIcon(node.icon)}
                </div>

                {/* Node Label */}
                <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 leading-snug">
                  {node.label}
                </span>

                {/* Subtext */}
                {node.subText && (
                  <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold leading-tight mt-1">
                    {node.subText}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* フロー配置（時系列プロセス用・矢印付き） */
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 py-1 px-1">
            {diagram.nodes.map((node, idx) => {
              const isLast = idx === diagram.nodes.length - 1;

              return (
                <div key={idx} className="flex items-center gap-1.5 sm:gap-3">
                  {/* Node Box */}
                  <div className="flex flex-col items-center text-center space-y-1 shrink-0 w-[72px] sm:w-[88px]">
                    {/* Icon Card */}
                    <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-slate-50 dark:bg-slate-750 border-2 border-slate-200 dark:border-slate-650 flex items-center justify-center shadow-xs transition-transform hover:scale-105">
                      {getNodeIcon(node.icon)}
                    </div>

                    {/* Node Label */}
                    <span className="text-[11px] sm:text-xs font-black text-slate-800 dark:text-slate-100 leading-tight">
                      {node.label}
                    </span>

                    {/* Subtext */}
                    {node.subText && (
                      <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-bold leading-tight">
                        {node.subText}
                      </span>
                    )}
                  </div>

                  {/* Connecting Line / Arrow (フロー矢印) */}
                  {!isLast && (
                    <div className="flex items-center justify-center shrink-0 w-3 sm:w-6 text-slate-400 dark:text-slate-500">
                      <span className="text-xs sm:text-sm font-bold">→</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
