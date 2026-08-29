'use client';

import React from 'react';
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

      {/* SVG Diagram Container */}
      <div className="p-3 sm:p-5 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-900/50">
        <svg
          viewBox="0 0 540 380"
          className="w-full max-w-[480px] h-auto drop-shadow-sm select-none"
        >
          {/* Site Background (敷地境界・アスファルトエリア) */}
          <polygon
            points="40,320 120,200 240,60 360,50 480,90 380,240 220,350 140,360"
            fill="#475569"
            opacity="0.15"
            stroke="#64748b"
            strokeWidth="2"
            strokeDasharray="4 4"
            rx="12"
          />

          {/* Site Road / Path */}
          <path
            d="M 220 370 L 210 310 L 260 220 L 320 140"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.4"
          />

          {/* 1. 砂谷第1配水池 (左下: 緑色の矩形 RC造 4,000m³) */}
          <g className="cursor-pointer transition-transform hover:scale-[1.02]">
            <rect
              x="50"
              y="200"
              width="130"
              height="110"
              rx="12"
              fill="#10b981"
              fillOpacity="0.25"
              stroke="#059669"
              strokeWidth="2.5"
            />
            {/* Top grid pattern simulating turf / roof */}
            <line x1="50" y1="255" x2="180" y2="255" stroke="#059669" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <line x1="115" y1="200" x2="115" y2="310" stroke="#059669" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            
            {/* Badge & Label */}
            <rect x="58" y="208" width="114" height="24" rx="6" fill="#047857" />
            <text x="115" y="224" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="900">
              砂谷第1配水池
            </text>
            <text x="115" y="258" textAnchor="middle" fill="#065f46" className="dark:fill-emerald-300" fontSize="11" fontWeight="800">
              RC造（矩形）
            </text>
            <rect x="68" y="272" width="94" height="22" rx="11" fill="#ffffff" stroke="#059669" strokeWidth="1.5" />
            <text x="115" y="287" textAnchor="middle" fill="#047857" fontSize="12" fontWeight="900">
              {showCapacities ? '4,000 m³' : '？ m³'}
            </text>
          </g>

          {/* 2. 砂谷第2配水池 (中央: 円筒形タンク PC造 4,970m³ 最大容量) */}
          <g className="cursor-pointer transition-transform hover:scale-[1.02]">
            {/* Shadow under circle */}
            <circle cx="225" cy="180" r="54" fill="#0284c7" opacity="0.15" />
            {/* Tank Main Circle */}
            <circle
              cx="225"
              cy="176"
              r="52"
              fill="#f0f9ff"
              stroke="#0284c7"
              strokeWidth="3"
            />
            {/* Tank Roof Highlight / Dome line */}
            <circle cx="225" cy="176" r="42" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 2" />
            
            {/* Badge & Label */}
            <rect x="165" y="142" width="120" height="24" rx="6" fill="#0369a1" />
            <text x="225" y="158" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="900">
              砂谷第2配水池
            </text>
            <text x="225" y="184" textAnchor="middle" fill="#0369a1" className="dark:fill-sky-300" fontSize="10.5" fontWeight="800">
              PC造（円筒形・最大）
            </text>
            <rect x="178" y="196" width="94" height="22" rx="11" fill="#0284c7" />
            <text x="225" y="211" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="900">
              {showCapacities ? '4,970 m³' : '？ m³'}
            </text>
          </g>

          {/* 3. 砂谷第3配水池 (上側: 円筒形タンク PC造 3,500m³) */}
          <g className="cursor-pointer transition-transform hover:scale-[1.02]">
            {/* Shadow under circle */}
            <circle cx="295" cy="80" r="46" fill="#0ea5e9" opacity="0.15" />
            {/* Tank Main Circle */}
            <circle
              cx="295"
              cy="76"
              r="44"
              fill="#f8fafc"
              stroke="#0ea5e9"
              strokeWidth="2.5"
            />
            <circle cx="295" cy="76" r="34" fill="none" stroke="#7dd3fc" strokeWidth="1.5" strokeDasharray="3 2" />

            {/* Badge & Label */}
            <rect x="235" y="46" width="120" height="22" rx="6" fill="#0284c7" />
            <text x="295" y="61" textAnchor="middle" fill="#ffffff" fontSize="11.5" fontWeight="900">
              砂谷第3配水池
            </text>
            <text x="295" y="84" textAnchor="middle" fill="#0369a1" className="dark:fill-sky-300" fontSize="10.5" fontWeight="800">
              PC造（円筒形）
            </text>
            <rect x="248" y="94" width="94" height="20" rx="10" fill="#ffffff" stroke="#0ea5e9" strokeWidth="1.5" />
            <text x="295" y="108" textAnchor="middle" fill="#0284c7" fontSize="11.5" fontWeight="900">
              {showCapacities ? '3,500 m³' : '？ m³'}
            </text>
          </g>

          {/* 4. 砂谷第4配水池 (右上: グレーの矩形 RC造 3,000m³) */}
          <g className="cursor-pointer transition-transform hover:scale-[1.02]">
            <polygon
              points="380,50 490,70 450,140 340,110"
              fill="#64748b"
              fillOpacity="0.25"
              stroke="#475569"
              strokeWidth="2.5"
            />
            {/* Badge & Label */}
            <rect x="365" y="65" width="114" height="24" rx="6" fill="#334155" />
            <text x="422" y="81" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="900">
              砂谷第4配水池
            </text>
            <text x="422" y="105" textAnchor="middle" fill="#334155" className="dark:fill-slate-300" fontSize="10.5" fontWeight="800">
              RC造（矩形）
            </text>
            <rect x="375" y="115" width="94" height="22" rx="11" fill="#ffffff" stroke="#475569" strokeWidth="1.5" />
            <text x="422" y="130" textAnchor="middle" fill="#1e293b" fontSize="12" fontWeight="900">
              {showCapacities ? '3,000 m³' : '？ m³'}
            </text>
          </g>

          {/* Legend (凡例) */}
          <g transform="translate(320, 310)">
            <rect x="0" y="0" width="200" height="55" rx="10" fill="#ffffff" fillOpacity="0.9" stroke="#cbd5e1" strokeWidth="1.5" />
            <rect x="12" y="12" width="14" height="12" rx="2" fill="#10b981" fillOpacity="0.6" stroke="#059669" strokeWidth="1.5" />
            <text x="32" y="22" fill="#334155" fontSize="10.5" fontWeight="bold">RC造（矩形地下・覆土）</text>
            <circle cx="19" cy="38" r="7" fill="#f0f9ff" stroke="#0284c7" strokeWidth="1.5" />
            <text x="32" y="42" fill="#334155" fontSize="10.5" fontWeight="bold">PC造（円筒形地上タンク）</text>
          </g>
        </svg>

        {/* Caption */}
        <p className="mt-2 text-center text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400">
          砂谷配水場：4池合計有効容量 <span className="text-cyan-700 dark:text-cyan-400 font-black">15,470 m³</span>（市内全体の約54%を貯留）
        </p>
      </div>
    </div>
  );
}
