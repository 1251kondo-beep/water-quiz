import { Course } from '@/types/quiz';
import { TECH_PLANNING_UNIT_1 } from './unit_1';
import { TECH_PLANNING_UNIT_2 } from './unit_2';
import { TECH_PLANNING_UNIT_3 } from './unit_3';
import { TECH_PLANNING_UNIT_4 } from './unit_4';

export const TECH_PLANNING_COURSE: Course = {
  id: 'tech_planning',
  domainId: 'water_technical_manager',
  title: '水道計画',
  subtitle: '計画給水人口・一日最大給水量・負荷率・施設規模設定・縮退計画',
  description: '人口減少社会における水需要予測の算出手法、設計基準諸元、施設の最適規模（ダウンサイジング）を学びます。',
  iconName: 'TrendingUp',
  themeColor: 'from-emerald-600 to-teal-800',
  category: 'legal_planning',
  fieldNumber: 4,
  badge: '計画必須',
  estimatedQuestions: 140,
  keywords: ['計画給水人口', '一日最大給水量', '一日平均給水量', 'ピーク係数', '施設計画', 'コーホート要因法', '用途別推計', '水安全計画', 'アセットマネジメント'],
  units: [
    TECH_PLANNING_UNIT_1,
    TECH_PLANNING_UNIT_2,
    TECH_PLANNING_UNIT_3,
    TECH_PLANNING_UNIT_4,
  ],
};
