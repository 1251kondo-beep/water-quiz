'use client';

import React, { useState, useEffect } from 'react';
import { ZoomIn, X } from 'lucide-react';
import { QuizImage } from '@/types/quiz';

interface ZoomableImageProps {
  image: QuizImage;
  className?: string;
  defaultAlt?: string;
}

export const ZoomableImage: React.FC<ZoomableImageProps> = ({
  image,
  className = '',
  defaultAlt = '図'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // ESCキーで閉じる & 背景スクロール固定
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <div className={`my-3 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 shadow-sm ${className}`}>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative w-full flex justify-center items-center bg-slate-50 dark:bg-slate-950/60 rounded-xl p-2 sm:p-4 cursor-zoom-in transition-all hover:bg-slate-100/80 dark:hover:bg-slate-900/80 active:scale-[0.99] text-left"
          title="タップして拡大"
          aria-label="画像を拡大表示"
        >
          <img
            src={image.url}
            alt={image.alt || defaultAlt}
            className="max-h-60 sm:max-h-72 w-auto object-contain rounded-lg transition-transform group-hover:scale-[1.01]"
          />
          {/* タップ拡大バッジ */}
          <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 px-2.5 py-1 rounded-full bg-slate-900/70 dark:bg-slate-800/80 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1 shadow-sm opacity-90 group-hover:opacity-100 group-hover:bg-blue-600 dark:group-hover:bg-blue-600 transition-all">
            <ZoomIn className="w-3.5 h-3.5" />
            <span>拡大</span>
          </div>
        </button>
        {image.caption && (
          <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-2 font-medium">
            {image.caption}
          </p>
        )}
      </div>

      {/* 拡大ライトボックスモーダル */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 cursor-zoom-out"
        >
          {/* 閉じるボタン */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur-md transition-all active:scale-95 flex items-center justify-center cursor-pointer shadow-lg border border-white/20"
            aria-label="閉じる"
          >
            <X className="w-5 h-5" />
          </button>

          {/* 画像カード（クリックしてもモーダルを閉じず、背景クリックや閉じるボタンで閉じる） */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-5 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200 cursor-default"
          >
            <div className="w-full flex justify-center items-center overflow-auto max-h-[75vh] p-1">
              <img
                src={image.url}
                alt={image.alt || defaultAlt}
                className="max-w-full max-h-[72vh] w-auto h-auto object-contain rounded-lg select-none"
              />
            </div>

            {image.caption && (
              <div className="mt-3 text-center px-4">
                <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                  {image.caption}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="mt-2 text-[11px] text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
            >
              タップまたは Esc キーで閉じる
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ZoomableImage;
