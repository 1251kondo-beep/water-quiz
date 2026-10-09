import { Course } from '@/types/quiz';
import { TECH_INSTRUMENTATION_UNIT_1 } from './unit_1';
import { TECH_INSTRUMENTATION_UNIT_2 } from './unit_2';
import { TECH_INSTRUMENTATION_UNIT_3 } from './unit_3';
import { TECH_INSTRUMENTATION_UNIT_4 } from './unit_4';

export const TECH_INSTRUMENTATION_COURSE: Course = {
  id: 'tech_instrumentation',
  domainId: 'water_technical_manager',
  title: '計装設備',
  subtitle: 'SCADA監視制御・テレメータ・流量計・水質計器・サイバーセキュリティ・経済安保',
  description: '計装設備の定義と目的、超音波流量計・電磁流量計、残留塩素計・濁度計などのオンライン水質計器、SCADA遠隔制御、計装通信回線、経済安全保障推進法に基づく基幹インフラ防護を体系的に習得します。',
  iconName: 'MonitorCheck',
  themeColor: 'from-indigo-700 to-slate-800',
  category: 'purification_machinery',
  fieldNumber: 11,
  badge: '監視計装',
  estimatedQuestions: 80,
  keywords: ['SCADA', '電磁流量計', 'オンライン水質計', 'テレメータ', '経済安保事前審査'],
  units: [
    TECH_INSTRUMENTATION_UNIT_1,
    TECH_INSTRUMENTATION_UNIT_2,
    TECH_INSTRUMENTATION_UNIT_3,
    TECH_INSTRUMENTATION_UNIT_4,
  ],
};
