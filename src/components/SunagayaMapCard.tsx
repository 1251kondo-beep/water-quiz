'use client';

import React from 'react';
import Image from 'next/image';
import { MapPin, Compass } from 'lucide-react';

interface SunagayaMapCardProps {
  showCapacities?: boolean;
}

export default function SunagayaMapCard({ showCapacities = true }: SunagayaMapCardProps) {
  return (
    <div className="my-4 rounded-3xl overflow-hidden border-2 border-slate-200/90 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 shadow-md">
      {/* Title Bar */}
      <div className="px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-black flex items-center justify-between border-b bg-slate-100/90 text-slate-800 border-slate-200/90 dark:bg-slate-700/80 dark:text-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
          <span>砂谷配水場 敷地内4配水池の配置図（合計 15,470 m³）</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
          <Compass className="w-3.5 h-3.5" />
          <span>北 ⬆</span>
        </div>
      </div>

      {/* Diagram Container */}
      <div className="p-3 sm:p-5 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-900/50">
        <div className="relative w-full max-w-[480px] aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-700 shadow-sm bg-white">
          <Image
            src="/images/facilities/sunagaya_layout.jpg"
            alt="砂谷配水場 敷地内4配水池の配置図"
            fill
            className="object-contain p-1"
            priority
          />
        </div>

        {/* Summary Caption */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[11px] sm:text-xs font-bold text-slate-600 dark:text-slate-300">
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-200">
            第1池: 4,000m³ (RC)
          </span>
          <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 px-2 py-0.5 rounded-md border border-sky-200">
            第2池: 4,970m³ (PC・最大)
          </span>
          <span className="inline-flex items-center gap-1 bg-cyan-50 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 px-2 py-0.5 rounded-md border border-cyan-200">
            第3池: 3,500m³ (PC)
          </span>
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200 px-2 py-0.5 rounded-md border border-slate-300">
            第4池: 3,000m³ (RC)
          </span>
        </div>
      </div>
    </div>
  );
}
