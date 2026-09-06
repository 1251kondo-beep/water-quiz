'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, RotateCcw, ListOrdered } from 'lucide-react';
import { getCourseTheme } from '@/data/themes';

interface BlankDef {
  id: number;
  answer: string;
}

interface FillInTheBlankWidgetProps {
  blankText: string;
  blanks?: BlankDef[];
  options: string[];
  isConfirmed: boolean;
  courseId?: string;
  onSelectionChange: (isFullyFilled: boolean, isAllCorrect: boolean) => void;
}

export default function FillInTheBlankWidget({
  blankText,
  blanks = [],
  options,
  isConfirmed,
  courseId,
  onSelectionChange,
}: FillInTheBlankWidgetProps) {
  const theme = getCourseTheme(courseId);
  // blanks definitions: e.g. [{ id: 1, answer: "..." }, { id: 2, answer: "..." }]
  // If not explicitly provided, detect 【空欄1】, 【空欄2】 or [____] patterns from blankText
  const blankCount = blanks.length > 0 ? blanks.length : (blankText.match(/【空欄\d+】|\[_{2,}\]|_{3,}/g) || []).length || 2;

  // Selected values for each blank slot: { 1: "メモリ", 2: "ストレージ" }
  const [filledSlots, setFilledSlots] = useState<Record<number, string>>({});
  const [activeSlotId, setActiveSlotId] = useState<number>(1);

  // Reset state when blankText or options change
  useEffect(() => {
    setFilledSlots({});
    setActiveSlotId(1);
  }, [blankText, options]);

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
      const exactMatch = blanks.every((b) => filledSlots[b.id] === b.answer);
      if (exactMatch) {
        isAllCorrect = true;
      } else {
        const expectedAnswers = blanks.map((b) => b.answer).sort();
        const selectedAnswers = Object.values(filledSlots).sort();
        isAllCorrect = expectedAnswers.every((ans, idx) => ans === selectedAnswers[idx]);
      }
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
      <div className={`${theme.quiz.widgetCardBg} border-2 rounded-3xl p-5 sm:p-7 shadow-sm`}>
        <div className="text-base sm:text-lg text-slate-900 dark:text-slate-100 font-bold leading-[2.2] sm:leading-[2.4]">
          {parts.map((p, idx) => {
            if (!p.isBlank) {
              return <span key={idx}>{p.text}</span>;
            }

            const slotId = p.slotId!;
            const filledVal = filledSlots[slotId];
            const isActive = activeSlotId === slotId && !isConfirmed;
            const targetBlank = blanks.find((b) => b.id === slotId);
            const isCorrect = isConfirmed && targetBlank ? filledVal === targetBlank.answer : true;

            let slotStyle =
              'border border-dashed border-slate-300 dark:border-slate-600 bg-white/80 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500';

            if (isActive) {
              slotStyle =
                `border ${theme.quiz.widgetActiveBorder} ring-1 ${theme.quiz.widgetActiveRing} ${theme.quiz.widgetActiveBg} font-bold`;
            } else if (filledVal && !isConfirmed) {
              slotStyle =
                `border ${theme.quiz.widgetActiveBorder} bg-white dark:bg-slate-850 font-bold shadow-2xs`;
            }

            if (isConfirmed) {
              if (isCorrect) {
                slotStyle =
                  'border border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold';
              } else {
                slotStyle =
                  'border border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 font-bold';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleClearSlot(slotId)}
                disabled={isConfirmed}
                className={`inline-flex items-center justify-center align-baseline mx-1 px-2.5 py-0.5 rounded-md transition-all text-base sm:text-lg min-w-[44px] sm:min-w-[52px] ${slotStyle} ${
                  !isConfirmed ? `cursor-pointer ${theme.quiz.optionHoverBorder}` : 'cursor-default'
                }`}
              >
                {filledVal ? (
                  <span className="inline-flex items-center gap-1 leading-none">
                    <span>{filledVal}</span>
                    {!isConfirmed && (
                      <span className="text-[11px] text-slate-400 hover:text-rose-500 transition-colors ml-0.5">
                        ✕
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="text-xs sm:text-sm font-black opacity-70 px-0.5 leading-none">
                    {slotId}
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
          <span className={`flex items-center gap-1.5 ${theme.quiz.accentText}`}>
            <ListOrdered className="w-4 h-4" />
            選択肢から選んでください
          </span>
          {!isConfirmed && usedOptions.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setFilledSlots({});
                setActiveSlotId(1);
              }}
              className={`text-xs hover:underline flex items-center gap-1 cursor-pointer font-bold ${theme.quiz.accentText}`}
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
                    : `bg-white dark:bg-slate-800 border-2 ${theme.quiz.cardBorder} text-slate-800 dark:text-slate-100 ${theme.quiz.optionHoverBorder} hover:${theme.quiz.optionSelectedBg} shadow-sm hover:shadow active:scale-95 cursor-pointer`
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
