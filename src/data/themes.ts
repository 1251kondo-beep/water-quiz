export interface CourseTheme {
  id: string;
  name: string;
  gradient: string;
  border: string;
  shadow: string;
  tagBg: string;
  waveType: number;
  // Detail page specific colors
  pageBg: string;
  headerBg: string;
  headerBorder: string;
  courseBadgeBg: string;
  progressBarGradient: string;
  progressTrackBg: string;
  progressCardBorder: string;
  sectionJumpBtn: string;
  sectionJumpBadge: string;
  sectionHeaderBadge: string;
  streamGradStart: string;
  streamGradMid: string;
  streamGradEnd: string;
  streamBaseColor: string;
  nodeCompletedGrad: string;
  nodeActiveGrad: string;
  nodeCompletedBorder: string;
  nodeActiveBorder: string;
  nodeActiveRing: string;
  bgBlur1: string;
  bgBlur2: string;
  bgBlur3: string;
  accentText: string;
}

export const COURSE_PAGE_THEMES: Record<string, CourseTheme> = {
  handa_vision: {
    id: 'handa_vision',
    name: '清流スカイアクア',
    gradient: 'bg-gradient-to-br from-sky-400 via-cyan-500 to-blue-600',
    border: 'border-sky-300',
    shadow: 'shadow-sky-500/20',
    tagBg: 'bg-white/25',
    waveType: 1,
    pageBg: 'bg-gradient-to-b from-sky-100/70 via-blue-50/50 to-sky-100/60',
    headerBg: 'bg-sky-200/90',
    headerBorder: 'border-sky-300/80',
    courseBadgeBg: 'bg-blue-600 text-white',
    progressBarGradient: 'from-cyan-400 via-sky-500 to-blue-600',
    progressTrackBg: 'bg-sky-100 border-sky-200',
    progressCardBorder: 'border-sky-200',
    sectionJumpBtn: 'bg-sky-50 text-slate-700 hover:bg-sky-100 border-sky-200',
    sectionJumpBadge: 'bg-sky-200 text-sky-800',
    sectionHeaderBadge: 'bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-600 text-white shadow-blue-500/25',
    streamGradStart: '#0284c7',
    streamGradMid: '#06b6d4',
    streamGradEnd: '#0284c7',
    streamBaseColor: '#bae6fd',
    nodeCompletedGrad: 'from-sky-400 to-cyan-500',
    nodeActiveGrad: 'from-blue-500 to-cyan-500',
    nodeCompletedBorder: 'border-sky-300',
    nodeActiveBorder: 'border-blue-500',
    nodeActiveRing: 'ring-sky-300/60',
    bgBlur1: 'bg-cyan-200/50',
    bgBlur2: 'bg-blue-200/50',
    bgBlur3: 'bg-sky-200/50',
    accentText: 'text-blue-700',
  },
  water_finance: {
    id: 'water_finance',
    name: '深層水クリスタルオーシャン',
    gradient: 'bg-gradient-to-br from-teal-400 via-cyan-600 to-blue-700',
    border: 'border-teal-300',
    shadow: 'shadow-teal-500/20',
    tagBg: 'bg-white/25',
    waveType: 2,
    pageBg: 'bg-gradient-to-b from-teal-100/75 via-cyan-50/50 to-blue-100/60',
    headerBg: 'bg-teal-200/90',
    headerBorder: 'border-teal-300/80',
    courseBadgeBg: 'bg-gradient-to-r from-teal-600 to-cyan-700 text-white',
    progressBarGradient: 'from-teal-400 via-cyan-600 to-blue-700',
    progressTrackBg: 'bg-teal-100 border-teal-200',
    progressCardBorder: 'border-teal-200',
    sectionJumpBtn: 'bg-teal-50 text-teal-950 hover:bg-teal-100 border-teal-200',
    sectionJumpBadge: 'bg-teal-200 text-teal-900',
    sectionHeaderBadge: 'bg-gradient-to-r from-teal-700 via-cyan-700 to-blue-800 text-white shadow-teal-500/25',
    streamGradStart: '#0d9488',
    streamGradMid: '#0891b2',
    streamGradEnd: '#1d4ed8',
    streamBaseColor: '#99f6e4',
    nodeCompletedGrad: 'from-teal-400 via-cyan-500 to-blue-600',
    nodeActiveGrad: 'from-teal-500 via-cyan-600 to-blue-700',
    nodeCompletedBorder: 'border-teal-300',
    nodeActiveBorder: 'border-teal-600',
    nodeActiveRing: 'ring-teal-300/60',
    bgBlur1: 'bg-teal-200/50',
    bgBlur2: 'bg-cyan-200/50',
    bgBlur3: 'bg-blue-200/50',
    accentText: 'text-teal-700',
  },
  water_asset: {
    id: 'water_asset',
    name: '水流インディゴマリン',
    gradient: 'bg-gradient-to-br from-blue-400 via-indigo-500 to-sky-600',
    border: 'border-indigo-300',
    shadow: 'shadow-indigo-500/20',
    tagBg: 'bg-white/25',
    waveType: 3,
    pageBg: 'bg-gradient-to-b from-blue-100/70 via-indigo-50/50 to-sky-100/60',
    headerBg: 'bg-indigo-200/90',
    headerBorder: 'border-indigo-300/80',
    courseBadgeBg: 'bg-indigo-600 text-white',
    progressBarGradient: 'from-blue-400 via-indigo-500 to-sky-600',
    progressTrackBg: 'bg-indigo-100 border-indigo-200',
    progressCardBorder: 'border-indigo-200',
    sectionJumpBtn: 'bg-indigo-50 text-slate-700 hover:bg-indigo-100 border-indigo-200',
    sectionJumpBadge: 'bg-indigo-200 text-indigo-800',
    sectionHeaderBadge: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white shadow-indigo-500/25',
    streamGradStart: '#2563eb',
    streamGradMid: '#6366f1',
    streamGradEnd: '#0284c7',
    streamBaseColor: '#c7d2fe',
    nodeCompletedGrad: 'from-blue-400 to-indigo-500',
    nodeActiveGrad: 'from-indigo-600 to-blue-500',
    nodeCompletedBorder: 'border-indigo-300',
    nodeActiveBorder: 'border-indigo-500',
    nodeActiveRing: 'ring-indigo-300/60',
    bgBlur1: 'bg-indigo-200/50',
    bgBlur2: 'bg-blue-200/50',
    bgBlur3: 'bg-sky-200/50',
    accentText: 'text-indigo-700',
  },
  water_law: {
    id: 'water_law',
    name: '湧水エメラルドスプリング',
    gradient: 'bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-700',
    border: 'border-emerald-300',
    shadow: 'shadow-emerald-500/20',
    tagBg: 'bg-white/25',
    waveType: 4,
    pageBg: 'bg-gradient-to-b from-emerald-100/70 via-teal-50/50 to-cyan-100/60',
    headerBg: 'bg-emerald-200/90',
    headerBorder: 'border-emerald-300/80',
    courseBadgeBg: 'bg-emerald-700 text-white',
    progressBarGradient: 'from-emerald-400 via-teal-500 to-cyan-700',
    progressTrackBg: 'bg-emerald-100 border-emerald-200',
    progressCardBorder: 'border-emerald-200',
    sectionJumpBtn: 'bg-emerald-50 text-slate-700 hover:bg-emerald-100 border-emerald-200',
    sectionJumpBadge: 'bg-emerald-200 text-emerald-800',
    sectionHeaderBadge: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white shadow-emerald-500/25',
    streamGradStart: '#059669',
    streamGradMid: '#0d9488',
    streamGradEnd: '#0891b2',
    streamBaseColor: '#a7f3d0',
    nodeCompletedGrad: 'from-emerald-400 to-teal-500',
    nodeActiveGrad: 'from-emerald-600 to-cyan-600',
    nodeCompletedBorder: 'border-emerald-300',
    nodeActiveBorder: 'border-emerald-500',
    nodeActiveRing: 'ring-emerald-300/60',
    bgBlur1: 'bg-emerald-200/50',
    bgBlur2: 'bg-teal-200/50',
    bgBlur3: 'bg-cyan-200/50',
    accentText: 'text-emerald-700',
  },
  sewerage_finance: {
    id: 'sewerage_finance',
    name: '水の循環アクアレイン',
    gradient: 'bg-gradient-to-br from-cyan-600 via-sky-600 to-indigo-700',
    border: 'border-cyan-300',
    shadow: 'shadow-cyan-500/20',
    tagBg: 'bg-white/25',
    waveType: 1,
    pageBg: 'bg-gradient-to-b from-cyan-100/70 via-sky-50/50 to-indigo-100/60',
    headerBg: 'bg-cyan-200/90',
    headerBorder: 'border-cyan-300/80',
    courseBadgeBg: 'bg-cyan-800 text-white',
    progressBarGradient: 'from-cyan-600 via-sky-600 to-indigo-700',
    progressTrackBg: 'bg-cyan-100 border-cyan-200',
    progressCardBorder: 'border-cyan-200',
    sectionJumpBtn: 'bg-cyan-50 text-slate-700 hover:bg-cyan-100 border-cyan-200',
    sectionJumpBadge: 'bg-cyan-200 text-cyan-800',
    sectionHeaderBadge: 'bg-gradient-to-r from-cyan-700 via-sky-700 to-indigo-800 text-white shadow-cyan-500/25',
    streamGradStart: '#0891b2',
    streamGradMid: '#0284c7',
    streamGradEnd: '#4338ca',
    streamBaseColor: '#a5f3fc',
    nodeCompletedGrad: 'from-cyan-500 to-indigo-600',
    nodeActiveGrad: 'from-cyan-600 to-indigo-700',
    nodeCompletedBorder: 'border-cyan-300',
    nodeActiveBorder: 'border-cyan-500',
    nodeActiveRing: 'ring-cyan-300/60',
    bgBlur1: 'bg-cyan-200/50',
    bgBlur2: 'bg-sky-200/50',
    bgBlur3: 'bg-indigo-200/50',
    accentText: 'text-cyan-800',
  },
};

export function getCourseTheme(courseId?: string): CourseTheme {
  if (!courseId) return COURSE_PAGE_THEMES.handa_vision;
  return COURSE_PAGE_THEMES[courseId] || COURSE_PAGE_THEMES.handa_vision;
}
