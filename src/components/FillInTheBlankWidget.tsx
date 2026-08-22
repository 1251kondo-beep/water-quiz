'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, RotateCcw, ListOrdered } from 'lucide-react';

interface BlankDef {
  id: number;
  answer: string;
}

interface FillInTheBlankWidgetProps {
  blankText: string;
  blanks?: BlankDef[];
  options: string[];
  isConfirmed: boolean;
  onSelectionChange: (isFullyFilled: boolean, isAllCorrect: boolean) => void;
}

export default function FillInTheBlankWidget({
  blankText,
  blanks = [],
  options,
  isConfirmed,
  onSelectionChange,
}: FillInTheBlankWidgetProps) {
  // blanks definitions: e.g. [{ id: 1, answer: "..." }, { id: 2, answer: "..." }]
  // If not explicitly provided, detect 【空欄1】, 【空欄2】 or [____] patterns from blankText
  const blankCount = blanks.length > 0 ? blanks.length : (blankText.match(/【空欄\d+】|\[_{2,}\]|_{3,}/g) || []).length || 2;

  // Selected values for each blank slot: { 1: "メモリ", 2: "ストレージ" }
  const [filledSlots, setFilledSlots] = useState<Record<number, string>>({});
  const [activeSlotId, setActiveSlotId] = useState<number>(1);

  // Split text by blank placeholders
  // Supports 【空欄1】, 【空欄2】, [____], [____1], etc.
  const parts = React.useMemo(() => {
    const regex = /(【空欄\d+】|\[_{2,}\d*\]|_{3,})/g;
    const splitArr = blankText.split(regex);
    let blankIndex = 1;

    return splitArr.map((part) => {
      if (regex.test(part)) {
        const currentSlotId = blankIndex++;
        return { isBlank: true, slotId: currentSlotId, original: part };
      }
      return { isBlank: false, text: part };
    });
  }, [blankText]);

  // Check completion and correctness
  useEffect(() => {
    const filledCount = Object.keys(filledSlots).filter((k) => filledSlots[Number(k)]).length;
    const isFullyFilled = filledCount === blankCount && blankCount > 0;

    let isAllCorrect = false;
    if (isFullyFilled && blanks.length > 0) {
      isAllCorrect = blanks.every((b) => filledSlots[b.id] === b.answer);
    } else if (isFullyFilled) {
      isAllCorrect = true;
    }

    onSelectionChange(isFullyFilled, isAllCorrect);
  }, [filledSlots, blankCount, blanks, onSelectionChange]);

  const handleSelectOption = (option: string) => {
    if (isConfirmed) return;

    // If activeSlotId is empty or needs to be set
    const nextSlotId = activeSlotId <= blankCount ? activeSlotId : 1;

    setFilledSlots((prev) => {
      // If this option is already used in another slot, remove it from that slot
      const newSlots = { ...prev };
      Object.keys(newSlots).forEach((k) => {
        if (newSlots[Number(k)] === option) {
          delete newSlots[Number(k)];
        }
      });
      newSlots[nextSlotId] = option;
      return newSlots;
    });

    // Advance to next empty slot
    const nextEmpty = Array.from({ length: blankCount }, (_, i) => i + 1).find(
      (id) => id !== nextSlotId && !filledSlots[id]
    );
    if (nextEmpty) {
      setActiveSlotId(nextEmpty);
    } else {
      setActiveSlotId(nextSlotId + 1);
    }
  };

  const handleClearSlot = (slotId: number) => {
    if (isConfirmed) return;
    setFilledSlots((prev) => {
      const next = { ...prev };
      delete next[slotId];
      return next;
    });
    setActiveSlotId(slotId);
  };

  const usedOptions = Object.values(filledSlots);

  return (
    <div className="space-y-4 my-2 select-none">
      {/* 1. Blank Sentence Card (文章穴埋めカード) */}
      <div className="bg-sky-50/60 dark:bg-slate-900/70 border-2 border-sky-200/90 dark:border-sky-800/60 rounded-3xl p-5 sm:p-7 shadow-sm">
        <div className="text-base sm:text-lg text-slate-900 dark:text-slate-100 font-bold leading-loose sm:leading-loose flex flex-wrap items-center gap-y-3">
          {parts.map((p, idx) => {
            if (!p.isBlank) {
              return <span key={idx}>{p.text}</span>;
            }

            const slotId = p.slotId!;
            const filledVal = filledSlots[slotId];
            const isActive = activeSlotId === slotId && !isConfirmed;
            const targetBlank = blanks.find((b) => b.id === slotId);
            const isCorrect = isConfirmed && targetBlank ? filledVal === targetBlank.answer : true;

            let slotStyle = 'border-b-2 border-dashed border-sky-400 bg-white dark:bg-slate-800 text-cyan-800 dark:text-cyan-200 min-w-[100px] sm:min-w-[120px]';

            if (isActive) {
              slotStyle = 'border-2 border-cyan-500 ring-4 ring-cyan-400/40 bg-cyan-50/90 dark:bg-cyan-950/70 text-cyan-950 font-black';
            } else if (filledVal && !isConfirmed) {
              slotStyle = 'border-2 border-cyan-400 bg-white dark:bg-slate-800 text-cyan-900 dark:text-cyan-200 font-black shadow-sm';
            }

            if (isConfirmed) {
              if (isCorrect) {
                slotStyle = 'border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-black';
              } else {
                slotStyle = 'border-2 border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 font-black';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleClearSlot(slotId)}
                disabled={isConfirmed}
                className={`inline-flex items-center justify-center px-3 py-1 mx-1.5 rounded-xl transition-all ${slotStyle} ${
                  !isConfirmed ? 'cursor-pointer hover:border-cyan-500' : 'cursor-default'
                }`}
              >
                {filledVal ? (
                  <span className="flex items-center gap-1">
                    {filledVal}
                    {!isConfirmed && <span className="text-xs text-slate-400 ml-1">✕</span>}
                  </span>
                ) : (
                  <span className="text-xs sm:text-sm text-cyan-600/70 dark:text-cyan-400/70 font-black px-2">
                    [ 空欄 {slotId} ]
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Options Chips Area (選択肢ピルエリア) */}
      <div className="bg-white dark:bg-slate-850 rounded-3xl p-4 sm:p-5 border-2 border-slate-200/90 dark:border-slate-700 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs sm:text-sm font-black text-slate-700 dark:text-slate-300">
          <span className="flex items-center gap-1.5">
            <ListOrdered className="w-4 h-4 text-cyan-600" />
            選択肢から選んでください
          </span>
          {!isConfirmed && usedOptions.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setFilledSlots({});
                setActiveSlotId(1);
              }}
              className="text-xs text-cyan-600 hover:underline flex items-center gap-1 cursor-pointer font-bold"
            >
              <RotateCcw className="w-3 h-3" />
              リセット
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2.5 sm:gap-3 pt-1">
          {options.map((opt, i) => {
            const isUsed = usedOptions.includes(opt);

            return (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectOption(opt)}
                disabled={isConfirmed || isUsed}
                className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-black transition-all border-2 flex items-center gap-1.5 ${
                  isUsed
                    ? 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-600 opacity-40 cursor-not-allowed'
                    : 'bg-white dark:bg-slate-800 border-sky-300 dark:border-sky-600 text-slate-800 dark:text-slate-100 hover:border-cyan-500 hover:bg-cyan-50/50 shadow-sm hover:shadow active:scale-95 cursor-pointer'
                }`}
              >
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
