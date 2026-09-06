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

export const WATER_DESIGN_UNITS: Unit[] = [UNIT_1, UNIT_2, UNIT_3, UNIT_4, UNIT_5];

export const WATER_DESIGN_COURSE: Course = {
  id: 'water_design',
  domainId: 'water_supply',
  title: '給水装置設計技術計算と審査実務',
  subtitle: '水理学基礎・管口径決定・水理計算書審査・水道法規マスター',
  description: '流量計算の基礎水理学から、管口径決定ロジック、各種設計水量の算出法、直結・貯水槽給水の実例水理計算書検証、そして水道法・施行令に基づく分岐・構造材質・受水槽直結切替えの審査判定までを体系的に学ぶ実践ドリル。全5セクション・25レッスン構成。',
  iconName: 'Wrench',
  themeColor: 'from-blue-600 to-indigo-900',
  units: WATER_DESIGN_UNITS,
};
