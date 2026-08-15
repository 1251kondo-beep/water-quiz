'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Droplet, Volume2, VolumeX, Moon, Sun, BookOpen, RotateCcw, Home, Menu, X } from 'lucide-react';
import { getUserStats, toggleSoundSetting, setThemeSetting } from '@/lib/storage';
import { soundFx } from '@/lib/audio';

export default function Header() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [mistakeCount, setMistakeCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    <header className="sticky top-0 z-50 w-full border-b-2 border-blue-200 dark:border-slate-800 px-4 py-3 shadow-sm bg-white dark:bg-slate-900">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group cursor-pointer" onClick={() => setIsMenuOpen(false)}>
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform">
            <Droplet className="w-5 h-5 text-white fill-white/20" />
          </div>
          <div>
            <h1 className="font-black text-base md:text-lg tracking-tight text-blue-700 dark:text-blue-400">
              水道事業ステップアップドリル
            </h1>
          </div>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-2 relative" ref={menuRef}>
          {/* Home Button (Always Visible) */}
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer border border-slate-300 dark:border-slate-700"
            title="ホーム"
          >
            <Home className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </Link>

          {/* Hamburger (三) Menu Button */}
          <button
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              soundFx.playClick(soundEnabled);
            }}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer border border-slate-300 dark:border-slate-700 flex items-center justify-center"
            title="メニュー"
            aria-label="メニューを開く"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Dropdown Menu (プルダウン) */}
          {isMenuOpen && (
            <div className="absolute right-0 top-12 w-56 bg-white dark:bg-slate-900 border-2 border-blue-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="space-y-1">
                {/* Glossary */}
                <Link
                  href="/glossary"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>用語辞書</span>
                </Link>

                {/* Review Mistakes */}
                <Link
                  href="/review"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-amber-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <RotateCcw className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>弱点復習</span>
                  </div>
                  {mistakeCount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-black rounded-full bg-amber-500 text-white">
                      {mistakeCount}
                    </span>
                  )}
                </Link>

                <div className="border-t border-slate-200 dark:border-slate-800 my-1" />

                {/* Sound Toggle */}
                <button
                  onClick={() => {
                    handleToggleSound();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    {soundEnabled ? (
                      <Volume2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-slate-400" />
                    )}
                    <span>効果音</span>
                  </div>
                  <span className="text-xs text-slate-500 font-semibold">
                    {soundEnabled ? 'ON' : 'OFF'}
                  </span>
                </button>

                {/* Theme Toggle */}
                <button
                  onClick={() => {
                    handleToggleTheme();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    {theme === 'dark' ? (
                      <Sun className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Moon className="w-4 h-4 text-indigo-600" />
                    )}
                    <span>テーマ設定</span>
                  </div>
                  <span className="text-xs text-slate-500 font-semibold">
                    {theme === 'dark' ? 'ダーク' : 'ライト'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
