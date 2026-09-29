import { Course } from '@/types/quiz';
import { TECH_INTAKE_UNIT_1 } from './unit_1';

export const TECH_INTAKE_STORAGE_COURSE: Course = {
  id: 'tech_intake_storage',
  domainId: 'water_technical_manager',
  title: '水源・取水施設・貯水施設',
  subtitle: '表流水・地下水・ダム貯水池・取水堰・取水塔・沈砂池・水源保全',
  description: '表流水・伏流水・浅井戸・深井戸の特性と取水構造、ダム堆砂対策、原水調整池、渇水対策、水利権と水源保護対策を体系的に学びます。',
  iconName: 'Waves',
  themeColor: 'from-cyan-600 to-blue-700',
  category: 'facility_hydraulics',
  fieldNumber: 6,
  badge: '水源施設',
  estimatedQuestions: 130,
  keywords: ['取水堰', '取水塔', '沈砂池', '深井戸・浅井戸', '水利権', 'ダム貯水池'],
  units: [
    TECH_INTAKE_UNIT_1,
  ],
};
