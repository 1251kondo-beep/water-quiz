'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, RotateCcw, ListOrdered } from 'lucide-react';
import { getCourseTheme } from '@/data/themes';
import { soundFx } from '@/lib/audio';

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
  soundEnabled?: boolean;
  onSelectionChange: (isFullyFilled: boolean, isAllCorrect: boolean) => void;
}

export default function FillInTheBlankWidget({
  blankText,
  blanks = [],
  options,
  isConfirmed,
  courseId,
  soundEnabled = true,
  onSelectionChange,
}: FillInTheBlankWidgetProps) {
  const theme = getCourseTheme(courseId);
  // blanks definitions: e.g. [{ id: 1, answer: "..." }, { id: 2, answer: "..." }]
  // If not explicitly provided, detect 【空欄1】, 【空欄2】 or [____] patterns from blankText
  const blankCount = blanks.length > 0 ? blanks.length : (blankText.match(/【空欄\d+】|\[_{2,}\]|_{3,}/g) || []).length || 2;

  // Selected values for each blank slot: { 1: "メモリ", 2: "ストレージ" }
  const [filledSlots, setFilledSlots] = useState<Record<number, string>>({});
  const [activeSlotId, setActiveSlotId] = useState<number>(1);
  const [isAllCorrectState, setIsAllCorrectState] = useState<boolean>(false);

  // Reset state when blankText or options change
  useEffect(() => {
    setFilledSlots({});
    setActiveSlotId(1);
    setIsAllCorrectState(false);
  }, [blankText, options]);

  // Split text by blank placeholders
  // Supports 【空欄1】, 【空欄2】, [____], [____1], etc.
  const parts = React.useMemo(() => {
    const regex = /(【空欄\d+】|\[_{2,}\d*\]|_{3,})/g;
    const splitArr = blankText.split(regex);
    let blankIndex = 1;

    return splitArr.map((part) => {
      if (regex.test(part)) {
        const numMatch = part.match(/\d+/);
        const currentSlotId = numMatch ? parseInt(numMatch[0], 10) : blankIndex++;
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

    setIsAllCorrectState(isAllCorrect);
    onSelectionChange(isFullyFilled, isAllCorrect);
  }, [filledSlots, blankCount, blanks, onSelectionChange]);

  const handleSelectOption = (option: string) => {
    if (isConfirmed) return;
    soundFx.playClick(soundEnabled);

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
    soundFx.playClick(soundEnabled);
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
                {!isConfirmed ? (
                  filledVal ? (
                    <span className="inline-flex items-center gap-1 leading-none">
                      <span>{filledVal}</span>
                      <span className="text-[11px] text-slate-400 hover:text-rose-500 transition-colors ml-0.5">
                        ✕
                      </span>
                    </span>
                  ) : (
                    <span className="text-xs sm:text-sm font-black opacity-70 px-0.5 leading-none">
                      {slotId}
                    </span>
                  )
                ) : isCorrect ? (
                  <span className="inline-flex items-center gap-1 leading-none">
                    <span>{filledVal}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 leading-none py-0.5">
                    {filledVal ? (
                      <span className="line-through text-rose-500/80 dark:text-rose-400/80 text-sm">
                        {filledVal}
                      </span>
                    ) : (
                      <span className="text-xs text-rose-500 font-bold">（未入力）</span>
                    )}
                    <span className="inline-flex items-center gap-0.5 text-emerald-800 dark:text-emerald-200 font-black bg-emerald-100/90 dark:bg-emerald-900/70 px-1.5 py-0.5 rounded text-sm sm:text-base border border-emerald-300 dark:border-emerald-700 shadow-2xs">
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mr-0.5">正解:</span>
                      {targetBlank?.answer || '—'}
                    </span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 1.5 正解の完成文エリア（不正解時に完成文で確認） */}
      {isConfirmed && !isAllCorrectState && blanks.length > 0 && (
        <div className="p-4 sm:p-5 rounded-3xl bg-emerald-50/90 dark:bg-emerald-950/40 border-2 border-emerald-500/40 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300 space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-bold text-sm sm:text-base">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 stroke-[2.5]" />
            <span>📖 完成文で確認：</span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-white/90 dark:bg-slate-850/90 border border-emerald-200 dark:border-emerald-800/80 text-sm sm:text-base text-slate-800 dark:text-slate-100 leading-[2.2] shadow-2xs">
            {parts.map((p, idx) => {
              if (!p.isBlank) return <span key={idx}>{p.text}</span>;
              const targetB = blanks.find((b) => b.id === p.slotId);
              return (
                <span
                  key={idx}
                  className="inline-block font-black text-emerald-800 dark:text-emerald-300 bg-emerald-100/90 dark:bg-emerald-900/70 border border-emerald-300 dark:border-emerald-600 px-2 py-0.5 rounded-lg mx-1 shadow-2xs"
                >
                  {targetB?.answer || `空欄${p.slotId}`}
                </span>
              );
            })}
          </div>
        </div>
      )}

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
                soundFx.playClick(soundEnabled);
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
            const isTargetCorrect = isConfirmed && blanks.some((b) => b.answer === opt);

            let chipStyle = `bg-white dark:bg-slate-800 border-2 ${theme.quiz.cardBorder} text-slate-800 dark:text-slate-100 ${theme.quiz.optionHoverBorder} hover:${theme.quiz.optionSelectedBg} shadow-sm hover:shadow active:scale-95 cursor-pointer`;

            if (isConfirmed) {
              if (isTargetCorrect) {
                chipStyle =
                  'bg-emerald-50 dark:bg-emerald-950/70 border-2 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-bold shadow-sm';
              } else if (isUsed) {
                chipStyle =
                  'bg-rose-50/80 dark:bg-rose-950/50 border-2 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 opacity-60';
              } else {
                chipStyle =
                  'bg-slate-100/50 dark:bg-slate-800/30 border-2 border-slate-200/50 dark:border-slate-800 text-slate-400 opacity-40';
              }
            } else if (isUsed) {
              chipStyle =
                'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-600 opacity-40 cursor-not-allowed';
            }

            return (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectOption(opt)}
                disabled={isConfirmed || isUsed}
                className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-black transition-all border-2 flex items-center gap-1.5 ${chipStyle}`}
              >
                <span>{opt}</span>
                {isConfirmed && isTargetCorrect && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
