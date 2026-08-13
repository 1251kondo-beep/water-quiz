'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Droplet, Volume2, VolumeX, Moon, Sun, BookOpen, RotateCcw, Home } from 'lucide-react';
import { getUserStats, toggleSoundSetting, setThemeSetting } from '@/lib/storage';
import { soundFx } from '@/lib/audio';

export default function Header() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [mistakeCount, setMistakeCount] = useState(0);

  useEffect(() => {
    const stats = getUserStats();
    setSoundEnabled(stats.soundEnabled);
    setTheme(stats.theme);
    setMistakeCount(stats.mistakeHistory.length);

    if (stats.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleToggleSound = () => {
    const nextVal = toggleSoundSetting();
    setSoundEnabled(nextVal);
    if (nextVal) {
      soundFx.playClick(true);
    }
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    setThemeSetting(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    soundFx.playClick(soundEnabled);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-blue-200 px-4 py-3 shadow-sm bg-white">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform">
            <Droplet className="w-5 h-5 text-white fill-white/20" />
          </div>
          <div>
            <h1 className="font-black text-base md:text-lg tracking-tight text-blue-700">
              水道財政クイズ
            </h1>
            <p className="text-[10px] text-slate-600 font-black leading-none">
              財政投資計画 用語マスター
            </p>
          </div>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Home */}
          <Link
            href="/"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer border border-slate-300"
            title="ホーム"
          >
            <Home className="w-4 h-4" />
          </Link>

          {/* Glossary */}
          <Link
            href="/glossary"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-700 text-xs font-black transition-colors cursor-pointer"
            title="用語辞書"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">用語辞書</span>
          </Link>

          {/* Review Mistakes */}
          <Link
            href="/review"
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black transition-colors cursor-pointer"
            title="弱点復習"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">復習</span>
            {mistakeCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-black rounded-full bg-amber-500 text-white">
                {mistakeCount}
              </span>
            )}
          </Link>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer border border-slate-300"
            title={soundEnabled ? '効果音 ON' : '効果音 OFF'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={handleToggleTheme}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer border border-slate-300"
            title="テーマ切り替え"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
        </div>
      </div>
    </header>
  );
}
