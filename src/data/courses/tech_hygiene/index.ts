import { Course } from '@/types/quiz';
import { TECH_HYGIENE_UNIT_1 } from './unit_1';
import { TECH_HYGIENE_UNIT_2 } from './unit_2';

export const TECH_HYGIENE_COURSE: Course = {
  id: 'tech_hygiene',
  domainId: 'water_technical_manager',
  title: '公衆衛生・衛生管理',
  subtitle: '公衆衛生理念・疫学・水質基準全52項目・クリプト対策・WSP・労働安全衛生',
  description: '公衆衛生の定義と疾病予防、ジョン・スノーの疫学、日本近代水道史、飲料水健康危機管理、水質汚染事故対応、水質基準52項目・PFAS、耐塩素性原虫（クリプトスポリジウム）対策、水安全計画（WSP）、環境基準・排水基準、および労働安全衛生法に基づく化学物質管理まで、公衆衛生の全論点を凝縮マスターします。',
  iconName: 'HeartPulse',
  themeColor: 'from-teal-600 via-emerald-600 to-cyan-700',
  category: 'week1',
  fieldNumber: 2,
  scheduleDate: '9/25(金) 午後',
  scheduleTime: '15:00〜17:00',
  badge: '衛生根幹',
  estimatedQuestions: 72,
  keywords: ['公衆衛生', 'ジョン・スノー', '塩素消毒', '水質基準52項目', 'PFAS', 'クリプトスポリジウム', '濁度0.1度', 'WSP', '排水基準', '化学物質管理者'],
  units: [
    TECH_HYGIENE_UNIT_1,
    TECH_HYGIENE_UNIT_2,
  ],
};
