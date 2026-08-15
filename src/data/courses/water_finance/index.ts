import { Course, Unit } from '@/types/quiz';
import { UNIT_1 } from './unit_1';
import { UNIT_2 } from './unit_2';
import { UNIT_3 } from './unit_3';

export { UNIT_1 } from './unit_1';
export { UNIT_2 } from './unit_2';
export { UNIT_3 } from './unit_3';

export const WATER_FINANCE_UNITS: Unit[] = [UNIT_1, UNIT_2, UNIT_3];

export const WATER_FINANCE_COURSE: Course = {
  id: 'water_finance',
  domainId: 'water_supply',
  title: '水道事業 投資財政計画・企業会計入門',
  subtitle: '異動したての職員向け用語解説・3条4条・企業債・経営指標マスター',
  description: '水道事業の財政・経営実務の必須知識を網羅した全150問の4択ドリル。各単元5レッスン（計15レッスン）、1レッスン10問でスキマ時間に効率よく学習できます。',
  iconName: 'Building2',
  themeColor: 'from-cyan-500 to-blue-600',
  units: WATER_FINANCE_UNITS,
};
