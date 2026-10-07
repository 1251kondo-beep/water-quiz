import { Course } from '@/types/quiz';
import { TECH_PURIFICATION_UNIT_1 } from './unit_1';
import { TECH_PURIFICATION_UNIT_2 } from './unit_2';
import { TECH_PURIFICATION_UNIT_3 } from './unit_3';
import { TECH_PURIFICATION_UNIT_4 } from './unit_4';

export const TECH_PURIFICATION_COURSE: Course = {
  id: 'tech_purification',
  domainId: 'water_technical_manager',
  title: '浄水施設',
  subtitle: '凝集沈殿・急速ろ過・緩速ろ過・膜ろ過・高度浄水（オゾン活性炭）・紫外線・排水処理',
  description: '凝集理論、薬品混和、フロック形成、沈殿池、急速砂ろ過・緩速ろ過から、膜ろ過（MF/UF）、オゾン生物活性炭、紫外線照射、クリプトスポリジウム対策、浄水スラッジ脱水処理まで、浄水技術の全体系を網羅します。',
  iconName: 'Filter',
  themeColor: 'from-indigo-600 to-blue-700',
  category: 'purification_machinery',
  fieldNumber: 9,
  badge: '★浄水根幹',
  estimatedQuestions: 108,
  keywords: ['凝集沈殿', '急速ろ過', '緩速ろ過', '膜ろ過（MF/UF）', 'オゾン接触', '生物活性炭（BAC）', '紫外線処理', 'クリプト対策', '排泥脱水'],
  units: [
    TECH_PURIFICATION_UNIT_1,
    TECH_PURIFICATION_UNIT_2,
    TECH_PURIFICATION_UNIT_3,
    TECH_PURIFICATION_UNIT_4,
  ],
};
