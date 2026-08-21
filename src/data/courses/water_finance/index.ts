import { Course, Unit } from '@/types/quiz';
import { UNIT_1 } from './unit_1';
import { UNIT_2 } from './unit_2';
import { UNIT_3 } from './unit_3';
import { UNIT_4 } from './unit_4';
import { UNIT_5 } from './unit_5';

export { UNIT_1 } from './unit_1';
export { UNIT_2 } from './unit_2';
export { UNIT_3 } from './unit_3';
export { UNIT_4 } from './unit_4';
export { UNIT_5 } from './unit_5';

export const WATER_FINANCE_UNITS: Unit[] = [UNIT_1, UNIT_2, UNIT_3, UNIT_4, UNIT_5];

export const WATER_FINANCE_COURSE: Course = {
  id: 'water_finance',
  domainId: 'water_supply',
  title: '水道事業　企業会計入門',
  subtitle: '異動者向け公営企業会計・3条4条・企業債・経営指標マスター',
  description: '一般会計とは異なる公営企業会計の原則（独立採算制・発生主義）、3条（損益）・4条（資本）の連動、減価償却と内部留保、企業債、総務省経営指標、および複合診断を体系的にマスターする実践ドリル。全5セクション・25レッスン構成。',
  iconName: 'Building2',
  themeColor: 'from-cyan-500 to-blue-600',
  units: WATER_FINANCE_UNITS,
};
