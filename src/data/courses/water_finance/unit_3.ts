import { Unit, Lesson } from '@/types/quiz';

// ======================================================================
// SECTION 3: 企業債（借入金）・資金繰りと中長期財政シミュレーション (作成中)
// ======================================================================

const createPlaceholderLesson = (
  unitId: string,
  lessonNumber: number,
  title: string,
  subtitle: string,
  referenceSection: string
): Lesson => ({
  id: `wf_lesson_3_${lessonNumber}`,
  unitId,
  lessonNumber,
  title,
  subtitle,
  description: '【作成中】本レッスンは現在問題データを作成中です。（次回アップデートにて公開予定）',
  questions: [
    {
      id: `wf_3_${lessonNumber}_placeholder`,
      question: `【作成中】${title} は現在教材を作成中です。次回アップデートをお待ちください。`,
      options: [
        '準備完了までしばらくお待ちください（タップして次へ）',
        '次回アップデート予定',
        '教材作成中',
        '公開準備中'
      ],
      answerIndex: 0,
      explanation: '現在、高品質な設問を作成中です。公開まで今しばらくお待ちください。',
      analogy: '新棟の工事を行っている準備中の状態です。',
      referenceSection
    }
  ]
});

export const UNIT_3: Unit = {
  id: 'wf_unit_3',
  unitNumber: 3,
  title: 'Section 3: 企業債（借入金）・資金繰りと中長期財政シミュレーション',
  description: '企業債の起債・償還方式（30年元利均等・据置）、金利リスク、内部留保残高の維持、および10年間の投資財政計画（Excelシミュレーション）と平準化を学びます。',
  badgeText: '借入・資金計画編',
  lessons: [
    createPlaceholderLesson('wf_unit_3', 1, 'Lesson 3-1: 企業債の基本構造（充当事業・調達先：財投/機構/民間）', '起債対象事業と資金調達ルート・起債協議制度', '総務省『地方債同意等基準』'),
    createPlaceholderLesson('wf_unit_3', 2, 'Lesson 3-2: 償還方式（元金均等/元利均等・据置期間・30年償還）と金利リスク', '返済スケジュールと金利上昇が経営に与える影響', '総務省『地方債同意等基準』'),
    createPlaceholderLesson('wf_unit_3', 3, 'Lesson 3-3: 企業債充当率と内部留保の維持（適正な資金水準）', '自己資金と借入の黄金比率・資金ショート防止', '総務省『水道事業経営戦略策定マニュアル』'),
    createPlaceholderLesson('wf_unit_3', 4, 'Lesson 3-4: 財政計画の構造（Excelモデル・入力シートと出力シートの連携）', '水需要予測・料金算定から全体見通しへの連動', '総務省『水道事業経営戦略策定マニュアル』'),
    createPlaceholderLesson('wf_unit_3', 5, 'Lesson 3-5: 老朽管更新調整と事業費平準化のメカニズム', '更新集中による財政悪化防止と年度別工事調整', '厚生労働省『水道事業におけるアセットマネジメント』')
  ]
};
