'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MatchPair } from '@/types/quiz';
import { CheckCircle2, XCircle, RotateCcw, Link2 } from 'lucide-react';

interface PairMatchingWidgetProps {
  pairs: MatchPair[];
  extraRightItems?: { rightId: string; rightText: string }[];
  leftTitle?: string;
  rightTitle?: string;
  isConfirmed: boolean;
  onSelectionChange: (isFullyMatched: boolean, isAllCorrect: boolean) => void;
}

interface RightItem {
  rightId: string;
  rightText: string;
}

const COLORS = [
  { stroke: '#2563eb', bg: 'bg-blue-50 text-blue-900 border-blue-500' },
  { stroke: '#7c3aed', bg: 'bg-purple-50 text-purple-900 border-purple-500' },
  { stroke: '#0891b2', bg: 'bg-cyan-50 text-cyan-900 border-cyan-500' },
];

export default function PairMatchingWidget({
  pairs,
  extraRightItems,
  leftTitle = '【配水場】',
  rightTitle = '【送水系統】',
  isConfirmed,
  onSelectionChange,
}: PairMatchingWidgetProps) {
  // Left items (fixed order)
  const leftItems = pairs.map((p) => ({ leftId: p.leftId, leftText: p.leftText }));

  // Right items (shuffled order on mount)
  const [rightItems, setRightItems] = useState<RightItem[]>([]);
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  // Map of leftId -> rightId
  const [userConnections, setUserConnections] = useState<Record<string, string>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Shuffle right items on mount / pairs change
  useEffect(() => {
    const rights = pairs.map((p) => ({ rightId: p.rightId, rightText: p.rightText }));
    if (extraRightItems && extraRightItems.length > 0) {
      rights.push(...extraRightItems);
    }
    const shuffled = [...rights];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setRightItems(shuffled);
    setUserConnections({});
    setSelectedLeftId(null);
  }, [pairs, extraRightItems]);

  // Check if fully matched & notify parent
  useEffect(() => {
    const isFullyMatched = Object.keys(userConnections).length === pairs.length;
    let isAllCorrect = false;
    if (isFullyMatched) {
      isAllCorrect = pairs.every((p) => {
        const userConnectedRightId = userConnections[p.leftId];
        if (!userConnectedRightId) return false;
        const connectedRight = rightItems.find((r) => r.rightId === userConnectedRightId);
        return connectedRight?.rightText === p.rightText;
      });
    }
    onSelectionChange(isFullyMatched, isAllCorrect);
  }, [userConnections, pairs, rightItems, onSelectionChange]);

  const handleLeftClick = (leftId: string) => {
    if (isConfirmed) return;
    setSelectedLeftId((prev) => (prev === leftId ? null : leftId));
  };

  const handleRightClick = (rightId: string) => {
    if (isConfirmed) return;
    if (!selectedLeftId) return;

    setUserConnections((prev) => {
      const next = { ...prev };
      // Remove any existing left connection pointing to this rightId
      Object.keys(next).forEach((key) => {
        if (next[key] === rightId) {
          delete next[key];
        }
      });
      next[selectedLeftId] = rightId;
      return next;
    });

    setSelectedLeftId(null);
  };

  const handleResetConnections = () => {
    if (isConfirmed) return;
    setUserConnections({});
    setSelectedLeftId(null);
  };

  // Re-render lines on resize / connection change
  const [lines, setLines] = useState<
    { leftId: string; rightId: string; x1: number; y1: number; x2: number; y2: number; colorIdx: number }[]
  >([]);

  useEffect(() => {
    const updateLines = () => {
      if (!containerRef.current) return;
      const cRect = containerRef.current.getBoundingClientRect();
      const newLines: {
        leftId: string;
        rightId: string;
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        colorIdx: number;
      }[] = [];

      leftItems.forEach((item, idx) => {
        const rId = userConnections[item.leftId];
        if (!rId) return;

        const leftEl = itemRefs.current[`left_${item.leftId}`];
        const rightEl = itemRefs.current[`right_${rId}`];

        if (leftEl && rightEl) {
          const lRect = leftEl.getBoundingClientRect();
          const rRect = rightEl.getBoundingClientRect();

          const x1 = lRect.right - cRect.left;
          const y1 = lRect.top + lRect.height / 2 - cRect.top;
          const x2 = rRect.left - cRect.left;
          const y2 = rRect.top + rRect.height / 2 - cRect.top;

          newLines.push({
            leftId: item.leftId,
            rightId: rId,
            x1,
            y1,
            x2,
            y2,
            colorIdx: idx % COLORS.length,
          });
        }
      });

      setLines(newLines);
    };

    updateLines();
    window.addEventListener('resize', updateLines);
    const timer = setTimeout(updateLines, 50);
    return () => {
      window.removeEventListener('resize', updateLines);
      clearTimeout(timer);
    };
  }, [userConnections, leftItems, rightItems]);

  return (
    <div className="space-y-3 my-4 touch-manipulation">
      <div className="flex items-center justify-between text-xs text-slate-500 font-bold px-1">
        <span className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-bold">
          <Link2 className="w-4 h-4 text-blue-600 shrink-0" />
          左の項目をタップし、右の対応する項目をタップして結んでください
        </span>
        {!isConfirmed && Object.keys(userConnections).length > 0 && (
          <button
            onClick={handleResetConnections}
            className="flex items-center gap-1 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer text-[11px] font-bold shrink-0 ml-2"
          >
            <RotateCcw className="w-3 h-3" />
            やり直す
          </button>
        )}
      </div>

      <div
        ref={containerRef}
        className="relative flex items-center justify-between p-3 sm:p-5 bg-slate-50/90 dark:bg-slate-900/80 rounded-2xl border-2 border-slate-200 dark:border-slate-800 min-h-[300px]"
      >
        {/* SVG overlay for drawing connecting lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {lines.map((line) => {
            const pair = pairs.find((p) => p.leftId === line.leftId);
            const connectedRight = rightItems.find((r) => r.rightId === line.rightId);
            const isCorrectPair = pair?.rightText === connectedRight?.rightText;

            let strokeColor = COLORS[line.colorIdx].stroke;
            if (isConfirmed) {
              strokeColor = isCorrectPair ? '#10b981' : '#ef4444'; // Emerald for correct, Red for wrong
            }

            const cx1 = line.x1 + (line.x2 - line.x1) * 0.45;
            const cx2 = line.x2 - (line.x2 - line.x1) * 0.45;

            return (
              <g key={`${line.leftId}-${line.rightId}`}>
                <path
                  d={`M ${line.x1} ${line.y1} C ${cx1} ${line.y1}, ${cx2} ${line.y2}, ${line.x2} ${line.y2}`}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={isConfirmed ? '4' : '3.5'}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
                <circle
                  cx={(line.x1 + line.x2) / 2}
                  cy={(line.y1 + line.y2) / 2}
                  r="6"
                  fill={strokeColor}
                />
              </g>
            );
          })}
        </svg>

        {/* Left Column */}
        <div className="w-[43%] max-w-[165px] sm:max-w-[190px] space-y-3 z-20 flex flex-col justify-center">
          <div className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider text-center">
            {leftTitle}
          </div>
          {leftItems.map((item, idx) => {
            const isSelected = selectedLeftId === item.leftId;
            const connectedRightId = userConnections[item.leftId];
            const connectedRightItem = rightItems.find((r) => r.rightId === connectedRightId);
            const pair = pairs.find((p) => p.leftId === item.leftId);

            const isCorrect = isConfirmed && connectedRightItem && connectedRightItem.rightText === pair?.rightText;
            const isWrong = isConfirmed && connectedRightItem && connectedRightItem.rightText !== pair?.rightText;

            let cardStyle =
              'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-blue-500 hover:shadow-md';
            if (isSelected) {
              cardStyle =
                'bg-blue-50 dark:bg-blue-950/80 border-blue-600 text-blue-900 dark:text-blue-100 ring-2 ring-blue-500/50 shadow-md font-black';
            } else if (connectedRightId) {
              cardStyle =
                'bg-blue-50/90 dark:bg-blue-950/60 border-blue-500 text-blue-900 dark:text-blue-100 font-bold shadow-sm';
            }

            if (isConfirmed) {
              if (isCorrect) {
                cardStyle =
                  'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-bold ring-2 ring-emerald-500/40';
              } else if (isWrong) {
                cardStyle =
                  'bg-rose-50 dark:bg-rose-950/80 border-rose-500 text-rose-900 dark:text-rose-100 font-bold ring-2 ring-rose-500/40';
              }
            }

            return (
              <div
                key={item.leftId}
                ref={(el) => {
                  itemRefs.current[`left_${item.leftId}`] = el;
                }}
                onClick={() => handleLeftClick(item.leftId)}
                className={`p-3 sm:p-3.5 rounded-xl border-2 leading-tight cursor-pointer transition-all duration-200 flex items-center justify-between relative select-none ${cardStyle}`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-4.5 h-4.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-black text-[10px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-xs sm:text-sm leading-tight break-words">{item.leftText}</span>
                </div>
                {isConfirmed && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />}
                {isConfirmed && isWrong && <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-1" />}
              </div>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="w-[43%] max-w-[165px] sm:max-w-[190px] space-y-3 z-20 flex flex-col justify-center">
          <div className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider text-center">
            {rightTitle}
          </div>
          {rightItems.map((item) => {
            const connectedLeftId = Object.keys(userConnections).find(
              (k) => userConnections[k] === item.rightId
            );
            const connectedLeftPair = pairs.find((p) => p.leftId === connectedLeftId);

            const isCorrect = isConfirmed && connectedLeftId && connectedLeftPair?.rightText === item.rightText;
            const isWrong = isConfirmed && connectedLeftId && connectedLeftPair?.rightText !== item.rightText;

            let cardStyle =
              'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200';
            if (selectedLeftId) {
              cardStyle +=
                ' border-blue-400 hover:border-blue-600 hover:bg-blue-50/60 dark:hover:bg-slate-700/80 cursor-pointer ring-2 ring-blue-400/40 animate-pulse';
            } else {
              cardStyle += ' cursor-pointer hover:border-slate-400';
            }

            if (connectedLeftId) {
              cardStyle =
                'bg-blue-50/90 dark:bg-blue-950/60 border-blue-500 text-blue-900 dark:text-blue-100 font-bold shadow-sm';
            }

            if (isConfirmed) {
              if (isCorrect) {
                cardStyle =
                  'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-bold ring-2 ring-emerald-500/40';
              } else if (isWrong) {
                cardStyle =
                  'bg-rose-50 dark:bg-rose-950/80 border-rose-500 text-rose-900 dark:text-rose-100 font-bold ring-2 ring-rose-500/40';
              }
            }

            return (
              <div
                key={item.rightId}
                ref={(el) => {
                  itemRefs.current[`right_${item.rightId}`] = el;
                }}
                onClick={() => handleRightClick(item.rightId)}
                className={`p-3 sm:p-3.5 rounded-xl border-2 leading-tight cursor-pointer transition-all duration-200 flex items-center justify-between relative select-none ${cardStyle}`}
              >
                <span className="font-bold text-xs sm:text-sm leading-tight break-words">{item.rightText}</span>
                {isConfirmed && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />}
                {isConfirmed && isWrong && <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-1" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
