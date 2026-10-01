import { Course } from '@/types/quiz';
import { TECH_CONVEYANCE_DISTRIBUTION_UNIT_1 } from './unit_1';
import { TECH_CONVEYANCE_DISTRIBUTION_UNIT_2 } from './unit_2';

export const TECH_CONVEYANCE_DISTRIBUTION_COURSE: Course = {
  id: 'tech_conveyance_distribution',
  domainId: 'water_technical_manager',
  title: '導・送・配水施設及び漏水防止',
  subtitle: '導送配水体系・管網水理・耐震継手・アセットマネジメント・危機管理・漏水防止計画',
  description: '導送配水システムの全体構成、管路設計と耐震継手（NS・GX）、水運用と増圧ポンプ、危機管理と断水実務、配水池構造、漏水防止3大体系・音聴探査技術を学びます。',
  iconName: 'Layers',
  themeColor: 'from-blue-600 to-sky-700',
  category: 'facility_hydraulics',
  fieldNumber: 7,
  badge: '管路中核',
  estimatedQuestions: 140,
  keywords: [
    '導水施設',
    '送水施設',
    '配水管設計',
    '耐震継手',
    '動水圧基準',
    'スラスト防護',
    'アセットマネジメント',
    '水運用',
    '危機管理',
    '漏水防止体系',
    '夜間最小流量'
  ],
  units: [
    TECH_CONVEYANCE_DISTRIBUTION_UNIT_1,
    TECH_CONVEYANCE_DISTRIBUTION_UNIT_2,
  ],
};
