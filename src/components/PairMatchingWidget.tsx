'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MatchPair } from '@/types/quiz';
import { CheckCircle2, XCircle, RotateCcw, Link2 } from 'lucide-react';

import { getCourseTheme } from '@/data/themes';

interface PairMatchingWidgetProps {
  pairs: MatchPair[];
  extraRightItems?: { rightId: string; rightText: string }[];
  leftTitle?: string;
  rightTitle?: string;
  isConfirmed: boolean;
  courseId?: string;
  onSelectionChange: (isFullyMatched: boolean, isAllCorrect: boolean) => void;
}

interface RightItem {
  rightId: string;
  rightText: string;
}

export default function PairMatchingWidget({
  pairs,
  extraRightItems,
  leftTitle = '【配水場】',
  rightTitle = '【送水系統】',
  isConfirmed,
  courseId,
  onSelectionChange,
}: PairMatchingWidgetProps) {
  const theme = getCourseTheme(courseId);
  const UNIFIED_STROKE_COLOR = theme.streamGradMid || '#0284c7';
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
    let attempts = 0;
    // シャッフルし、初期状態で左側と完全に同じ順序（真横同士）にならないように保証
    while (attempts < 10) {
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      const isIdentical =
        pairs.length > 1 &&
        pairs.every((p, idx) => shuffled[idx]?.rightText === p.rightText);
      if (!isIdentical) break;
      attempts++;
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
    { leftId: string; rightId: string; x1: number; y1: number; x2: number; y2: number }[]
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
      }[] = [];

      leftItems.forEach((item) => {
        const rId = userConnections[item.leftId];
        if (!rId) return;

        const leftDotEl = itemRefs.current[`dot_left_${item.leftId}`];
        const rightDotEl = itemRefs.current[`dot_right_${rId}`];

        if (leftDotEl && rightDotEl) {
          const lDotRect = leftDotEl.getBoundingClientRect();
          const rDotRect = rightDotEl.getBoundingClientRect();

          const x1 = lDotRect.left + lDotRect.width / 2 - cRect.left;
          const y1 = lDotRect.top + lDotRect.height / 2 - cRect.top;
          const x2 = rDotRect.left + rDotRect.width / 2 - cRect.left;
          const y2 = rDotRect.top + rDotRect.height / 2 - cRect.top;

          newLines.push({
            leftId: item.leftId,
            rightId: rId,
            x1,
            y1,
            x2,
            y2,
          });
        }
      });

      setLines(newLines);
    };

    updateLines();
    window.addEventListener('resize', updateLines);
    window.addEventListener('scroll', updateLines, true);
    const timer = setTimeout(updateLines, 50);
    return () => {
      window.removeEventListener('resize', updateLines);
      window.removeEventListener('scroll', updateLines, true);
      clearTimeout(timer);
    };
  }, [userConnections, leftItems, rightItems]);

  return (
    <div className="space-y-3 my-4 touch-manipulation">
      <div className="flex items-center justify-between text-xs text-slate-500 font-bold px-1">
        <span className="flex items-center gap-1.5 text-sky-700 dark:text-sky-300 font-bold">
          <Link2 className="w-4 h-4 text-sky-600 shrink-0" />
          左右の対応する項目をタップしてペアを作ってください
        </span>
        {!isConfirmed && Object.keys(userConnections).length > 0 && (
          <button
            onClick={handleResetConnections}
            className="flex items-center gap-1 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer text-[11px] font-bold shrink-0 ml-2"
          >
            <RotateCcw className="w-3 h-3" />
            リセット
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

            let strokeColor = UNIFIED_STROKE_COLOR;
            if (isConfirmed) {
              strokeColor = isCorrectPair ? '#10b981' : '#ef4444'; // Emerald for correct, Red for wrong
            }

            const cx1 = line.x1 + (line.x2 - line.x1) * 0.45;
            const cx2 = line.x2 - (line.x2 - line.x1) * 0.45;

            return (
              <g key={`${line.leftId}-${line.rightId}`}>
                {/* Connecting S-Curve Line (太さ約2.5px〜3px) */}
                <path
                  d={`M ${line.x1} ${line.y1} C ${cx1} ${line.y1}, ${cx2} ${line.y2}, ${line.x2} ${line.y2}`}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={isConfirmed ? '3.5' : '3'}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
                {/* Left End Connector Dot (左端の丸：HTMLドット中心と100%完全一致) */}
                <circle
                  cx={line.x1}
                  cy={line.y1}
                  r="5"
                  fill={strokeColor}
                  className="transition-all duration-300"
                />
                {/* Right End Connector Dot (右端の丸：HTMLドット中心と100%完全一致) */}
                <circle
                  cx={line.x2}
                  cy={line.y2}
                  r="5"
                  fill={strokeColor}
                  className="transition-all duration-300"
                />
              </g>
            );
          })}
        </svg>

        {/* Left Column */}
        <div className="w-[44%] max-w-[200px] sm:max-w-[280px] space-y-3 z-20 flex flex-col justify-center">
          {leftTitle && (
            <div className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 tracking-wider text-center">
              {leftTitle}
            </div>
          )}
          {leftItems.map((item) => {
            const isSelected = selectedLeftId === item.leftId;
            const connectedRightId = userConnections[item.leftId];
            const connectedRightItem = rightItems.find((r) => r.rightId === connectedRightId);
            const pair = pairs.find((p) => p.leftId === item.leftId);

            const isCorrect = isConfirmed && connectedRightItem && connectedRightItem.rightText === pair?.rightText;
            const isWrong = isConfirmed && connectedRightItem && connectedRightItem.rightText !== pair?.rightText;

            let cardStyle =
              `bg-[#edf5f6] dark:bg-slate-800 border-2 ${theme.quiz.cardBorder} text-slate-800 dark:text-slate-200 ${theme.quiz.optionHoverBorder} shadow-sm`;
            let dotStyle = `${theme.quiz.optionBadgeActive} border border-white dark:border-slate-900`;

            if (isSelected) {
              cardStyle =
                `${theme.quiz.widgetActiveBg} border-2 ${theme.quiz.widgetActiveBorder} ring-2 ${theme.quiz.widgetActiveRing} shadow-md font-bold`;
              dotStyle = `${theme.quiz.optionBadgeActive} border-2 border-white dark:border-slate-900 scale-125`;
            } else if (connectedRightId) {
              cardStyle =
                `${theme.quiz.widgetActiveBg} border-2 ${theme.quiz.widgetActiveBorder} font-bold shadow-sm`;
              dotStyle = `${theme.quiz.optionBadgeActive} border border-white dark:border-slate-900`;
            }

            if (isConfirmed) {
              if (isCorrect) {
                cardStyle =
                  'bg-emerald-50 dark:bg-emerald-950/80 border-2 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-bold ring-2 ring-emerald-500/40';
                dotStyle = 'bg-emerald-500 border border-white dark:border-slate-900';
              } else if (isWrong) {
                cardStyle =
                  'bg-rose-50 dark:bg-rose-950/80 border-2 border-rose-500 text-rose-900 dark:text-rose-100 font-bold ring-2 ring-rose-500/40';
                dotStyle = 'bg-rose-500 border border-white dark:border-slate-900';
              }
            }

            return (
              <div
                key={item.leftId}
                ref={(el) => {
                  itemRefs.current[`left_${item.leftId}`] = el;
                }}
                onClick={() => handleLeftClick(item.leftId)}
                className={`p-3 sm:p-4 rounded-2xl leading-relaxed cursor-pointer transition-all duration-200 flex items-center justify-center text-center relative select-none min-h-[64px] sm:min-h-[72px] ${cardStyle}`}
              >
                <span className="font-bold text-sm sm:text-base leading-snug sm:leading-relaxed break-words">
                  {item.leftText}
                </span>

                {/* Right side connector circle dot (中心位置を完全一致) */}
                <div
                  ref={(el) => {
                    itemRefs.current[`dot_left_${item.leftId}`] = el;
                  }}
                  className={`absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full transition-all shadow-sm ${dotStyle}`}
                />

                {/* 正解・不正解バッジ（文字に重ならないよう左上外側に配置） */}
                {isConfirmed && isCorrect && (
                  <div className="absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full p-0.5 shadow-md z-30 animate-in zoom-in-50 duration-200">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
                {isConfirmed && isWrong && (
                  <div className="absolute -top-2 -left-2 bg-rose-500 text-white rounded-full p-0.5 shadow-md z-30 animate-in zoom-in-50 duration-200">
                    <XCircle className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="w-[44%] max-w-[200px] sm:max-w-[280px] space-y-3 z-20 flex flex-col justify-center">
          {rightTitle && (
            <div className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 tracking-wider text-center">
              {rightTitle}
            </div>
          )}
          {rightItems.map((item) => {
            const connectedLeftId = Object.keys(userConnections).find(
              (k) => userConnections[k] === item.rightId
            );
            const connectedLeftPair = pairs.find((p) => p.leftId === connectedLeftId);

            const isCorrect = isConfirmed && connectedLeftId && connectedLeftPair?.rightText === item.rightText;
            const isWrong = isConfirmed && connectedLeftId && connectedLeftPair?.rightText !== item.rightText;

            let cardStyle =
              `bg-[#edf5f6] dark:bg-slate-800 border-2 ${theme.quiz.cardBorder} text-slate-800 dark:text-slate-200 ${theme.quiz.optionHoverBorder} shadow-sm`;
            let dotStyle = `${theme.quiz.optionBadgeActive} border border-white dark:border-slate-900`;

            if (selectedLeftId) {
              cardStyle +=
                ` ${theme.quiz.optionHoverBorder} hover:${theme.quiz.widgetActiveBorder} hover:${theme.quiz.widgetActiveBg} cursor-pointer`;
            } else {
              cardStyle += ` cursor-pointer ${theme.quiz.optionHoverBorder}`;
            }

            if (connectedLeftId) {
              cardStyle =
                `${theme.quiz.widgetActiveBg} border-2 ${theme.quiz.widgetActiveBorder} font-bold shadow-sm`;
              dotStyle = `${theme.quiz.optionBadgeActive} border border-white dark:border-slate-900`;
            }

            if (isConfirmed) {
              if (isCorrect) {
                cardStyle =
                  'bg-emerald-50 dark:bg-emerald-950/80 border-2 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-bold ring-2 ring-emerald-500/40';
                dotStyle = 'bg-emerald-500 border border-white dark:border-slate-900';
              } else if (isWrong) {
                cardStyle =
                  'bg-rose-50 dark:bg-rose-950/80 border-2 border-rose-500 text-rose-900 dark:text-rose-100 font-bold ring-2 ring-rose-500/40';
                dotStyle = 'bg-rose-500 border border-white dark:border-slate-900';
              }
            }

            return (
              <div
                key={item.rightId}
                ref={(el) => {
                  itemRefs.current[`right_${item.rightId}`] = el;
                }}
                onClick={() => handleRightClick(item.rightId)}
                className={`p-3 sm:p-4 rounded-2xl leading-relaxed cursor-pointer transition-all duration-200 flex items-center justify-center text-center relative select-none min-h-[64px] sm:min-h-[72px] ${cardStyle}`}
              >
                {/* Left side connector circle dot (中心位置を完全一致) */}
                <div
                  ref={(el) => {
                    itemRefs.current[`dot_right_${item.rightId}`] = el;
                  }}
                  className={`absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full transition-all shadow-sm ${dotStyle}`}
                />

                <span className="font-bold text-sm sm:text-base leading-snug sm:leading-relaxed break-words">
                  {item.rightText}
                </span>

                {/* 正解・不正解バッジ（文字に重ならないよう右上外側に配置） */}
                {isConfirmed && isCorrect && (
                  <div className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full p-0.5 shadow-md z-30 animate-in zoom-in-50 duration-200">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
                {isConfirmed && isWrong && (
                  <div className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-0.5 shadow-md z-30 animate-in zoom-in-50 duration-200">
                    <XCircle className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
