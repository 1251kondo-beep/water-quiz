import { Course } from '@/types/quiz';
import { TECH_HYDRAULICS_UNIT_1 } from './unit_1';
import { TECH_HYDRAULICS_UNIT_2 } from './unit_2';

export const TECH_HYDRAULICS_COURSE: Course = {
  id: 'tech_hydraulics',
  domainId: 'water_technical_manager',
  title: '水道水理学・構造力学',
  subtitle: '静水圧・動水勾配・ベルヌーイ定理・管路摩擦損失・水撃圧・構造力学',
  description: '管水路・開水路の流れ、ヘーゼン・ウィリアムス公式、管網水理解析、サージタンク・調圧水槽、水管橋や耐震構造計算の基本を学びます。',
  iconName: 'Network',
  themeColor: 'from-sky-700 to-blue-900',
  category: 'facility_hydraulics',
  fieldNumber: 5,
  badge: '力学計算',
  estimatedQuestions: 140,
  keywords: ['ベルヌーイ定理', '動水勾配線', 'ヘーゼン公式', '水撃圧（ウォーターハンマー）', '構造力学'],
  units: [
    TECH_HYDRAULICS_UNIT_1,
    TECH_HYDRAULICS_UNIT_2,
  ],
};
