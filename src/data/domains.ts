import { Domain } from '@/types/quiz';
import { HANDA_VISION_COURSE } from '@/data/courses/handa_vision';
import { WATER_FINANCE_COURSE } from '@/data/courses/water_finance';
import { WATER_DESIGN_COURSE } from '@/data/courses/water_design';

export const DOMAINS: Domain[] = [
  {
    id: 'water_supply',
    name: '水道事業',
    description: '半田市水道ビジョン、企業会計・投資財政計画、アセットマネジメント、関連法規、実務知識をマスターする',
    available: true,
    courses: [
      HANDA_VISION_COURSE,
      WATER_FINANCE_COURSE,
      WATER_DESIGN_COURSE,
      {
        id: 'water_asset',
        domainId: 'water_supply',
        title: '水道アセットマネジメント・管路更新 (準備中)',
        subtitle: '法定耐用年数とアセットマネジメント、老朽管耐震化、布設替え計画',
        description: '【次回拡張予定】管路・浄水施設の中長期更新需要推計と優先順位付けのアセットマネジメント基礎。',
        iconName: 'Pipette',
        themeColor: 'from-blue-500 to-indigo-600',
        units: [],
      },
      {
        id: 'water_law',
        domainId: 'water_supply',
        title: '水道法・地方公営企業法入門 (準備中)',
        subtitle: '地方公営企業法第17条の2（独立採算）、総務省繰出基準、二部料金制',
        description: '【次回拡張予定】公営企業会計の根拠法令、総括原価方式と料金設定に関する法制度。',
        iconName: 'Scale',
        themeColor: 'from-teal-500 to-emerald-600',
        units: [],
      },
    ],
  },
  {
    id: 'sewerage',
    name: '下水道事業',
    description: '下水道事業の公営企業会計、処理場維持管理、雨水・汚水施設経営',
    available: false,
    courses: [
      {
        id: 'sewerage_finance',
        domainId: 'sewerage',
        title: '下水道公営企業会計・雨水公費負担 (準備中)',
        subtitle: '汚水（使用者負担）と雨水（公費負担）の区分、雨水繰入金と起債',
        description: '【次回拡張予定】下水道特有の雨水・汚水経費区分と経営健全化計画。',
        iconName: 'Droplet',
        themeColor: 'from-emerald-500 to-teal-700',
        units: [],
      },
    ],
  },
];

export function getCourseById(courseId: string) {
  for (const domain of DOMAINS) {
    const found = domain.courses.find((c) => c.id === courseId);
    if (found) return found;
  }
  return null;
}

export function getLessonById(lessonId: string) {
  for (const domain of DOMAINS) {
    for (const course of domain.courses) {
      for (const unit of course.units) {
        const lesson = unit.lessons.find((l) => l.id === lessonId);
        if (lesson) return { lesson, unit, course };
      }
    }
  }
  return null;
}
