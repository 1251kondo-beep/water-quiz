export type DifficultyLevel = 1 | 2 | 3;

export interface Question {
  id: string;
  question: string;
  options: [string, string, string, string];
  answerIndex: number;
  explanation: string;
  analogy: string; // 日常のたとえ
  referenceSection: string; // 投資財政計画_用語解説.md の対応セクション
  difficulty?: DifficultyLevel;
  sdgsGoals?: number[]; // e.g. [3, 6, 7, 9, 11, 14]
}

export interface Lesson {
  id: string;
  unitId: string;
  lessonNumber: number; // 1, 2, 3...
  title: string;
  subtitle: string;
  description: string;
  questions: Question[];
}

export interface Unit {
  id: string;
  unitNumber: number; // 1, 2, 3...
  title: string;
  description: string;
  badgeText: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  domainId: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  themeColor: string;
  units: Unit[];
}

export interface Domain {
  id: string;
  name: string;
  description: string;
  courses: Course[];
  available: boolean;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  reading?: string; // 読み仮名
  category: string;
  oneLineSummary: string; // 一言イメージ
  analogy: string; // 日常のたとえ
  fullExplanation: string;
  relatedLessonId?: string;
}

export interface LessonResult {
  lessonId: string;
  score: number; // e.g. 9
  totalQuestions: number; // e.g. 10
  percentage: number; // e.g. 90
  passed: boolean; // >= 80%
  stars: number; // 1 to 3 stars
  completedAt: string;
}

export interface UserStats {
  completedLessons: Record<string, LessonResult>; // lessonId -> result
  bookmarks: string[]; // questionIds
  mistakeHistory: string[]; // questionIds needing review
  soundEnabled: boolean;
  theme: 'dark' | 'light';
  lastStudiedAt?: string;
}
