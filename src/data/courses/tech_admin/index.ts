import { Course } from '@/types/quiz';
import { TECH_ADMIN_UNIT_1 } from './unit_1';
import { TECH_ADMIN_UNIT_2 } from './unit_2';
import { TECH_ADMIN_UNIT_3 } from './unit_3';

export const TECH_ADMIN_COURSE: Course = {
  id: 'tech_admin',
  domainId: 'water_technical_manager',
  title: '水道行政',
  subtitle: '水道法体系・技術管理者の責務・経営耐震化・水質基準・官民連携まで完全網羅',
  description: '水道法第1条の理念、水道の定義・分類、技術管理者の法的責任、近年の法改正、アセットマネジメント、震災対応、水質基準51項目、PFAS対策、給水装置まで、水道行政の全論点を徹底習得します。',
  iconName: 'ShieldCheck',
  themeColor: 'from-blue-700 via-indigo-700 to-cyan-600',
  category: 'legal_management',
  fieldNumber: 1,
  badge: '★最重要・必修',
  estimatedQuestions: 150,
  keywords: ['水道法第1条', '技術管理者責務', '国交省移管', 'アセットマネジメント', 'ウォーターPPP', '水質基準51項目', 'PFAS', '給水装置'],
  units: [
    TECH_ADMIN_UNIT_1,
    TECH_ADMIN_UNIT_2,
    TECH_ADMIN_UNIT_3,
    {
      id: 'tech_admin_u4',
      unitNumber: 4,
      title: '水安全計画・PFAS対策・給水装置管理',
      description: '水安全計画（WSP）、鉛製給水管対策、PFAS（PFOS/PFOA）規制、給水装置管理責任、指定工事業者5年更新制、メーター検定8年',
      badgeText: 'Unit 4: 新基準・給水装置',
      lessons: [
        {
          id: 'tech_admin_l4_1',
          unitId: 'tech_admin_u4',
          lessonNumber: 1,
          title: '水安全計画（WSP）と鉛製給水管解消対策',
          subtitle: '危害評価・危機管理の統合システム、鉛管の3大リスク（耐震・漏水・朝一番溶出）',
          description: '水源から給水栓までのリスクマネジメント手法と、鉛製給水管の計画的解消に向けた国の施策を学びます。',
          questions: [],
        },
        {
          id: 'tech_admin_l4_2',
          unitId: 'tech_admin_u4',
          lessonNumber: 2,
          title: '有機フッ素化合物（PFAS）と水道水源保全',
          subtitle: '合算50ng/L基準、活性炭・膜処理技術、水質汚濁防止法（1万m³/日以上排水適用）',
          description: '最新の水質課題であるPFOS・PFOAの規制・除去工法と、水源保全に関わる環境法規制を整理します。',
          questions: [],
        },
        {
          id: 'tech_admin_l4_3',
          unitId: 'tech_admin_u4',
          lessonNumber: 3,
          title: '給水装置の管理責任とクロスコネクション厳禁',
          subtitle: '需要者管理原則、基準不適合時の給水拒否・停止権限、誤接合による逆流汚染防止',
          description: '給水装置の法的性格、水道事業者の監督権限、配水管網全体を守るためのクロスコネクション防止を徹底します。',
          questions: [],
        },
        {
          id: 'tech_admin_l4_4',
          unitId: 'tech_admin_u4',
          lessonNumber: 4,
          title: '指定工事店制度・受水槽・メーター・環境対策',
          subtitle: '主任技術者必置・5年更新制、簡易専用水道（10m³超）、メーター検定8年、電力1%消費と省エネ',
          description: '指定工事業者の適正化、受水槽衛生管理、計量法上の検定有効期間、脱炭素に向けた省エネ施策を押さえます。',
          questions: [],
        },
      ],
    },
  ],
};
