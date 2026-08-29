'use client';

import React from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';

export default function SunagayaMapCard() {
  return (
    <div className="my-4 rounded-3xl overflow-hidden border-2 border-slate-200/90 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 shadow-md">
      {/* Title Bar */}
      <div className="px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-black flex items-center justify-between border-b bg-slate-100/90 text-slate-800 border-slate-200/90 dark:bg-slate-700/80 dark:text-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
          <span>砂谷配水場 敷地内4配水池の配置図（合計 15,470 m³）</span>
        </div>
      </div>

      {/* Illustrated Map */}
      <div className="p-3 sm:p-5 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-900/50">
        <div className="relative w-full max-w-[540px] aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-700 shadow-sm bg-white">
          <Image
            src="/images/facilities/sunagaya_layout.jpg"
            alt="砂谷配水場 敷地内4配水池の配置図"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Caption */}
        <p className="mt-2.5 text-center text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400">
          砂谷配水場：4池合計有効容量 <span className="text-cyan-700 dark:text-cyan-400 font-black">15,470 m³</span>（市内最大の配水拠点）
        </p>
      </div>
    </div>
  );
}
