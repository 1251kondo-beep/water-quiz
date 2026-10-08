import { Course } from '@/types/quiz';
import { TECH_MACHINERY_ELECTRICAL_UNIT_1 } from './unit_1';
import { TECH_MACHINERY_ELECTRICAL_UNIT_2 } from './unit_2';
import { TECH_MACHINERY_ELECTRICAL_UNIT_3 } from './unit_3';
import { TECH_MACHINERY_ELECTRICAL_UNIT_4 } from './unit_4';

export const TECH_MACHINERY_ELECTRICAL_COURSE: Course = {
  id: 'tech_machinery_electrical',
  domainId: 'water_technical_manager',
  title: '機械・電気設備',
  subtitle: 'ポンプ設備・受変電設備・自家発電設備・電動機・動力計算・保安管理',
  description: '遠心ポンプ・斜流ポンプの選定と性能曲線、最高効率点（BEP）、キャビテーション等の5大異常防止、インバータ制御、次亜注入設備、受水施設、高圧受変電、自家発電、消防法危険物規制、TBMからCBM予知保全を体系的に習得します。',
  iconName: 'Zap',
  themeColor: 'from-amber-600 to-blue-800',
  category: 'purification_machinery',
  fieldNumber: 10,
  badge: '機電設備',
  estimatedQuestions: 136,
  keywords: ['渦巻ポンプ', '性能曲線・BEP', 'キャビテーション', '次亜注入・ガスロック', '高圧受変電・保護協調', '自家発電・危険物規制', 'CBM状態監視・LCC'],
  units: [
    TECH_MACHINERY_ELECTRICAL_UNIT_1,
    TECH_MACHINERY_ELECTRICAL_UNIT_2,
    TECH_MACHINERY_ELECTRICAL_UNIT_3,
    TECH_MACHINERY_ELECTRICAL_UNIT_4,
  ],
};
