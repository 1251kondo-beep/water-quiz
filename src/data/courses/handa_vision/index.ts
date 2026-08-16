import { Course, Unit } from '@/types/quiz';
import { HV_UNIT_1 } from './unit_1';
import { HV_UNIT_2 } from './unit_2';
import { HV_UNIT_3 } from './unit_3';

export { HV_UNIT_1 } from './unit_1';
export { HV_UNIT_2 } from './unit_2';
export { HV_UNIT_3 } from './unit_3';

export const HANDA_VISION_UNITS: Unit[] = [HV_UNIT_1, HV_UNIT_2, HV_UNIT_3];

export const HANDA_VISION_COURSE: Course = {
  id: 'handa_vision',
  domainId: 'water_supply',
  title: '半田市水道ビジョン マスター',
  subtitle: '令和3〜12年度 10年計画・基本理念・歴史・安全・強靭・持続の完全習得',
  description: '「半田市水道ビジョン（R8.3）」の内容を網羅した全150問のドリル。半田市の水道事業に関わる職員必須の基礎知識が学べます。',
  iconName: 'Droplet',
  themeColor: 'from-blue-600 to-cyan-500',
  units: HANDA_VISION_UNITS,
};
