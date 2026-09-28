import { Course } from '@/types/quiz';
import { TECH_MGMT_UNIT_1 } from './unit_1';

export const TECH_MANAGEMENT_COURSE: Course = {
  id: 'tech_management',
  domainId: 'water_technical_manager',
  title: '水道経営・公営企業会計',
  subtitle: '経営原則・給水契約・公営企業会計・減価償却・総括原価料金・経営分析指標・債権回収',
  description: '水道事業の健全な継続に必要な経営の原則、給水契約の法理、地方公営企業法に基づく組織、発生主義会計と減価償却、総括原価方式と二部料金制の設計、経営分析指標の活用、水道料金債権回収の実務まで完全網羅します。',
  iconName: 'PieChart',
  themeColor: 'from-indigo-700 to-blue-800',
  category: 'legal_management',
  fieldNumber: 3,
  badge: '経営必須',
  estimatedQuestions: 140,
  keywords: ['独立採算', '市町村主義', '供給規程', '発生主義', '減価償却', '総括原価方式', '二部料金制', '資産維持費', '経営分析', '支払督促'],
  units: [
    TECH_MGMT_UNIT_1,
  ],
};
