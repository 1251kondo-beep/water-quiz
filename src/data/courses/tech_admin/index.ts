import { Course } from '@/types/quiz';
import { TECH_ADMIN_UNIT_1 } from './unit_1';
import { TECH_ADMIN_UNIT_2 } from './unit_2';
import { TECH_ADMIN_UNIT_3 } from './unit_3';
import { TECH_ADMIN_UNIT_4 } from './unit_4';

export const TECH_ADMIN_COURSE: Course = {
  id: 'tech_admin',
  domainId: 'water_technical_manager',
  title: '水道行政',
  subtitle: '水道法体系・技術管理者の責務・経営耐震化・水質基準・官民連携まで完全網羅',
  description: '水道法第1条の理念、水道の定義・分類、技術管理者の法的責任、近年の法改正、アセットマネジメント、震災対応、水質基準51項目、PFAS対策、給水装置まで、水道行政の全論点を徹底習得します。',
  iconName: 'ShieldCheck',
  themeColor: 'from-blue-700 via-indigo-700 to-cyan-600',
  category: 'week1',
  fieldNumber: 1,
  scheduleDate: '9/25(金) 午前',
  scheduleTime: '9:50〜14:50',
  badge: '★最重要・必修',
  estimatedQuestions: 146,
  keywords: ['水道法第1条', '技術管理者責務', '国交省移管', 'アセットマネジメント', 'ウォーターPPP', '水質基準51項目', 'PFAS', '給水装置'],
  units: [
    TECH_ADMIN_UNIT_1,
    TECH_ADMIN_UNIT_2,
    TECH_ADMIN_UNIT_3,
    TECH_ADMIN_UNIT_4,
  ],
};
