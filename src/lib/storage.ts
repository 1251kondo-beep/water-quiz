import { UserStats, LessonResult } from '@/types/quiz';

const STORAGE_KEY = 'water_quiz_user_stats_v1';

const defaultStats: UserStats = {
  completedLessons: {},
  bookmarks: [],
  mistakeHistory: [],
  soundEnabled: true,
  theme: 'light',
};

export function getUserStats(): UserStats {
  if (typeof window === 'undefined') return defaultStats;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultStats;
    const parsed = JSON.parse(raw);
    return { ...defaultStats, ...parsed };
  } catch (err) {
    console.error('Failed to load user stats from localStorage:', err);
    return defaultStats;
  }
}

export function saveUserStats(stats: UserStats): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error('Failed to save user stats:', err);
  }
}

export function saveLastCourseId(courseId: string): void {
  const current = getUserStats();
  if (current.lastCourseId === courseId) return;
  saveUserStats({ ...current, lastCourseId: courseId });
}

export function saveLastDomainId(domainId: string): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('water_quiz_last_domain_id', domainId);
    } catch {
      // ignore
    }
  }
  const current = getUserStats();
  if (current.lastDomainId === domainId) return;
  saveUserStats({ ...current, lastDomainId: domainId });
}

export function getLastDomainId(): string | null {
  if (typeof window !== 'undefined') {
    try {
      const explicit = localStorage.getItem('water_quiz_last_domain_id');
      if (explicit) return explicit;
    } catch {
      // ignore
    }
  }
  const current = getUserStats();
  return current.lastDomainId || null;
}

export function saveLessonResult(result: LessonResult, courseId?: string): UserStats {
  const current = getUserStats();
  const existing = current.completedLessons[result.lessonId];

  // Keep best score if previously completed with higher stars
  let shouldUpdate = true;
  if (existing) {
    if (existing.stars > result.stars) {
      shouldUpdate = false;
    } else if (existing.stars === result.stars && existing.score > result.score) {
      shouldUpdate = false;
    }
  }

  const updatedLessons = {
    ...current.completedLessons,
    [result.lessonId]: shouldUpdate ? result : { ...existing, passed: existing.passed || result.passed },
  };

  const newStats: UserStats = {
    ...current,
    completedLessons: updatedLessons,
    lastStudiedAt: new Date().toISOString(),
    ...(courseId ? { lastCourseId: courseId } : {}),
  };

  saveUserStats(newStats);
  return newStats;
}

export function toggleBookmark(questionId: string): boolean {
  const current = getUserStats();
  const exists = current.bookmarks.includes(questionId);
  const updatedBookmarks = exists
    ? current.bookmarks.filter((id) => id !== questionId)
    : [...current.bookmarks, questionId];

  saveUserStats({ ...current, bookmarks: updatedBookmarks });
  return !exists;
}

export function recordMistakes(questionIds: string[]): void {
  if (questionIds.length === 0) return;
  const current = getUserStats();
  const set = new Set([...current.mistakeHistory, ...questionIds]);
  saveUserStats({ ...current, mistakeHistory: Array.from(set) });
}

export function removeMistake(questionId: string): void {
  const current = getUserStats();
  const updated = current.mistakeHistory.filter((id) => id !== questionId);
  saveUserStats({ ...current, mistakeHistory: updated });
}

export function clearMistakes(): void {
  const current = getUserStats();
  saveUserStats({ ...current, mistakeHistory: [] });
}

export const SOUND_CHANGE_EVENT = 'water_quiz_sound_changed';

export function toggleSoundSetting(): boolean {
  const current = getUserStats();
  const newValue = !current.soundEnabled;
  saveUserStats({ ...current, soundEnabled: newValue });
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SOUND_CHANGE_EVENT, { detail: newValue }));
  }
  return newValue;
}

export function setThemeSetting(theme: 'dark' | 'light'): void {
  const current = getUserStats();
  saveUserStats({ ...current, theme });
}
