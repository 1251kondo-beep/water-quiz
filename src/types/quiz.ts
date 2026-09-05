export type DifficultyLevel = 1 | 2 | 3;

export interface MatchPair {
  leftId: string;
  leftText: string;
  rightId: string;
  rightText: string;
}

export interface QuizTable {
  title?: string;
  headers?: string[];
  rows: (string | number)[][];
}

export interface BreakdownItem {
  label: string;
  value: string;
  percentage: number;
  color?: string;
  icon?: string;
}

export interface BreakdownGraph {
  title?: string;
  totalLabel?: string;
  subLabel?: string;
  items: BreakdownItem[];
}

export interface DiagramNode {
  label: string;
  icon?: string;
  subText?: string;
}

export interface QuizDiagram {
  title?: string;
  type?: 'flow' | 'cycle' | 'compare' | 'grid';
  nodes: DiagramNode[];
}

export interface OrderItem {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  type?: 'choice' | 'true_false' | 'matching' | 'fill_in_the_blank' | 'ordering' | 'multiple_choice';
  question: string;
  options: string[];
  answerIndex: number;
  answerIndices?: number[]; // 複数選択（multiple_choice）用の正解インデックス配列
  explanation: string;
  analogy?: string; // 日常のたとえ（任意：初学者がイメージしにくい場合のみ補足）
  referenceSection: string; // 投資財政計画_用語解説.md の対応セクション
  difficulty?: DifficultyLevel;
  sdgsGoals?: number[]; // e.g. [3, 6, 7, 9, 11, 14]
  table?: QuizTable; // 問題文に付随する表・スペック表・財務諸表抜粋など
  explanationTable?: QuizTable; // 解説に付随する比較表など
  breakdownGraph?: BreakdownGraph; // 帯グラフ・内訳バーカード
  diagram?: QuizDiagram; // 概念図解・フロー図カード
  facilityMap?: string;
  explanationBreakdownGraph?: BreakdownGraph; // 解説用帯グラフ
  explanationDiagram?: QuizDiagram; // 解説用概念図解
  blankText?: string; // 穴埋め問題用の文章
  blanks?: { id: number; answer: string }[]; // 空欄定義
  orderItems?: OrderItem[]; // 並び替え問題のアイテム一覧
  correctOrder?: string[]; // 正しいIDの並び順配列
  matchPairs?: MatchPair[];
  extraRightItems?: { rightId: string; rightText: string }[];
  leftTitle?: string;
  rightTitle?: string;
}

export interface Lesson {
  id: string;
  unitId: string;
  lessonNumber: number; // 1, 2, 3...
  title: string;
  subtitle: string;
  description: string;
  questions: Question[];
  isComingSoon?: boolean;
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
  lastCourseId?: string; // 直近で学習・閲覧したコースID
}

