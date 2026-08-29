'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUpDown, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import { OrderItem } from '@/types/quiz';

interface OrderingWidgetProps {
  items: OrderItem[];
  correctOrder: string[];
  isConfirmed: boolean;
  onSelectionChange: (isFullyOrdered: boolean, isAllCorrect: boolean) => void;
}

export default function OrderingWidget({
  items,
  correctOrder,
  isConfirmed,
  onSelectionChange,
}: OrderingWidgetProps) {
  // Ordered item IDs placed in top area: e.g. ["step_2", "step_1", ...]
  const [placedItemIds, setPlacedItemIds] = useState<string[]>([]);

  // Check completion and correctness
  useEffect(() => {
    const isFullyOrdered = placedItemIds.length === items.length && items.length > 0;
    const isAllCorrect =
      isFullyOrdered &&
      placedItemIds.every((id, idx) => id === correctOrder[idx]);

    onSelectionChange(isFullyOrdered, isAllCorrect);
  }, [placedItemIds, items.length, correctOrder, onSelectionChange]);

  const handlePlaceItem = (itemId: string) => {
    if (isConfirmed) return;
    setPlacedItemIds((prev) => [...prev, itemId]);
  };

  const handleRemovePlacedItem = (itemId: string) => {
    if (isConfirmed) return;
    setPlacedItemIds((prev) => prev.filter((id) => id !== itemId));
  };

  const handleReset = () => {
    if (isConfirmed) return;
    setPlacedItemIds([]);
  };

  // Available items not yet placed
  const availableItems = items.filter((item) => !placedItemIds.includes(item.id));

  return (
    <div className="space-y-4 my-2 select-none">
      {/* Subtitle Indicator */}
      <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1 text-cyan-700 dark:text-cyan-400">
          <ArrowUpDown className="w-4 h-4" />
          正しい順番に並べてください
        </span>
        {!isConfirmed && placedItemIds.length > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-cyan-600 hover:underline flex items-center gap-1 cursor-pointer font-bold"
          >
            <RotateCcw className="w-3 h-3" />
            やり直す
          </button>
        )}
      </div>

      {/* 1. Top Placed Container (点線配置スロットエリア) */}
      <div className="bg-slate-50/70 dark:bg-slate-900/60 rounded-3xl p-4 sm:p-5 border-2 border-dashed border-sky-300 dark:border-sky-700/80 min-h-[120px] sm:min-h-[140px] flex flex-col justify-center transition-all shadow-inner">
        {placedItemIds.length === 0 ? (
          <p className="text-center text-xs sm:text-sm text-slate-400 dark:text-slate-500 font-bold py-6">
            下の選択肢をタップして順番に並べてね
          </p>
        ) : (
          <div className="space-y-2.5 w-full">
            {placedItemIds.map((itemId, idx) => {
              const item = items.find((i) => i.id === itemId);
              if (!item) return null;

              const isItemCorrect = isConfirmed ? correctOrder[idx] === itemId : true;

              let cardStyle =
                'bg-white dark:bg-slate-800 border-2 border-cyan-400/80 dark:border-cyan-600 shadow-sm text-slate-800 dark:text-slate-100 hover:border-cyan-500';
              let badgeStyle = 'bg-cyan-600 text-white';

              if (isConfirmed) {
                if (isItemCorrect) {
                  cardStyle =
                    'bg-emerald-50 dark:bg-emerald-950/70 border-2 border-emerald-500 shadow-sm text-emerald-950 dark:text-emerald-100';
                  badgeStyle = 'bg-emerald-600 text-white';
                } else {
                  cardStyle =
                    'bg-rose-50 dark:bg-rose-950/70 border-2 border-rose-500 shadow-sm text-rose-950 dark:text-rose-100';
                  badgeStyle = 'bg-rose-600 text-white';
                }
              }

              return (
                <button
                  key={itemId}
                  type="button"
                  onClick={() => handleRemovePlacedItem(itemId)}
                  disabled={isConfirmed}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-2xl flex items-center justify-between gap-3 transition-all cursor-pointer ${cardStyle} ${
                    !isConfirmed ? 'active:scale-[0.99]' : 'cursor-default'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center shrink-0 shadow-xs ${badgeStyle}`}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-[15px] sm:text-base font-bold leading-relaxed">
                      {item.text}
                    </span>
                  </div>

                  {!isConfirmed && (
                    <span className="text-xs text-slate-400 hover:text-slate-600 shrink-0 ml-2 font-black">
                      ✕
                    </span>
                  )}

                  {isConfirmed && isItemCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {isConfirmed && !isItemCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Bottom Available Cards List (未配置カードリスト) */}
      {!isConfirmed && availableItems.length > 0 && (
        <div className="space-y-2.5 pt-1">
          {availableItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handlePlaceItem(item.id)}
              className="w-full text-left p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/90 border-2 border-slate-200 dark:border-slate-700 shadow-sm hover:border-cyan-400 hover:bg-cyan-50/40 text-slate-800 dark:text-slate-100 transition-all active:scale-[0.99] cursor-pointer flex items-center justify-between gap-3 text-[15px] sm:text-base font-bold leading-relaxed"
            >
              <span>{item.text}</span>
              <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-400 text-xs font-black flex items-center justify-center shrink-0">
                +
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
