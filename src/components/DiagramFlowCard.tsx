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
      return <Globe className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-600 dark:text-cyan-400 stroke-[1.75]" />;
    case 'server':
      return <Server className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400 stroke-[1.75]" />;
    case 'laptop':
    case 'browser':
      return <Laptop className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600 dark:text-indigo-400 stroke-[1.75]" />;
    case 'droplet':
    case 'water':
      return <Droplet className="w-7 h-7 sm:w-8 sm:h-8 text-sky-500 dark:text-sky-400 stroke-[1.75] fill-sky-100 dark:fill-sky-950" />;
    case 'factory':
    case 'water_plant':
      return <Factory className="w-7 h-7 sm:w-8 sm:h-8 text-teal-600 dark:text-teal-400 stroke-[1.75]" />;
    case 'cylinder':
    case 'tank':
      return (
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border-2 border-cyan-600 flex flex-col justify-between p-0.5 text-[9px] font-black text-cyan-700 items-center">
          <div className="w-full h-1 bg-cyan-500 rounded-xs" />
          <span>配水池</span>
          <div className="w-full h-1 bg-cyan-500 rounded-xs" />
        </div>
      );
    case 'home':
      return <Home className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600 dark:text-emerald-400 stroke-[1.75]" />;
    case 'alert':
      return <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8 text-amber-500 stroke-[1.75]" />;
    default:
      return <Network className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-600 dark:text-cyan-400 stroke-[1.75]" />;
  }
}

export default function DiagramFlowCard({
  diagram,
  isExplanation = false,
}: DiagramFlowCardProps) {
  if (!diagram || !diagram.nodes || diagram.nodes.length === 0) return null;

  return (
    <div
      className={`my-3.5 sm:my-4.5 rounded-3xl overflow-hidden border-2 shadow-sm ${
        isExplanation
          ? 'border-cyan-200 bg-cyan-50/30 dark:bg-slate-900/80 dark:border-cyan-900/60'
          : 'border-slate-200/90 bg-white/95 dark:bg-slate-800/90 dark:border-slate-700'
      }`}
    >
      {/* Title Bar */}
      {diagram.title && (
        <div
          className={`px-4 py-3 text-xs sm:text-sm font-black flex items-center gap-2 border-b ${
            isExplanation
              ? 'bg-cyan-100/70 text-cyan-950 border-cyan-200 dark:bg-cyan-950/70 dark:text-cyan-200 dark:border-cyan-900/60'
              : 'bg-slate-100/90 text-slate-800 border-slate-200/90 dark:bg-slate-700/80 dark:text-slate-200 dark:border-slate-700'
          }`}
        >
          <Network className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span>{diagram.title}</span>
        </div>
      )}

      {/* Nodes Flow Container */}
      <div className="p-5 sm:p-7">
        <div className="flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto py-2">
          {diagram.nodes.map((node, idx) => {
            const isLast = idx === diagram.nodes.length - 1;

            return (
              <React.Fragment key={idx}>
                {/* Node Box */}
                <div className="flex flex-col items-center text-center space-y-2 shrink-0 min-w-[72px] sm:min-w-[84px]">
                  {/* Icon Card */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-50 dark:bg-slate-750 border-2 border-slate-200 dark:border-slate-650 flex items-center justify-center shadow-xs transition-transform hover:scale-105">
                    {getNodeIcon(node.icon)}
                  </div>

                  {/* Node Label */}
                  <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 leading-tight">
                    {node.label}
                  </span>

                  {/* Subtext */}
                  {node.subText && (
                    <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold">
                      {node.subText}
                    </span>
                  )}
                </div>

                {/* Connecting Line / Arrow */}
                {!isLast && (
                  <div className="flex items-center justify-center shrink-0 w-6 sm:w-10">
                    <div className="w-full h-0.5 bg-slate-300 dark:bg-slate-600 relative">
                      <div className="absolute -top-1 right-0 w-2 h-2 border-t-2 border-r-2 border-slate-400 dark:border-slate-500 rotate-45" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
