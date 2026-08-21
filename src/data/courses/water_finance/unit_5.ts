import { Unit, Lesson } from '@/types/quiz';

// ======================================================================
// SECTION 5: コスト・料金・老朽化指標と実践複合診断 (作成中)
// ======================================================================

const createPlaceholderLesson = (
  unitId: string,
  lessonNumber: number,
  title: string,
  subtitle: string,
  referenceSection: string
): Lesson => ({
  id: `wf_lesson_5_${lessonNumber}`,
  unitId,
  lessonNumber,
  title,
  subtitle,
  description: '【作成中】本レッスンは現在問題データを作成中です。（次回アップデートにて公開予定）',
  questions: [
    {
      id: `wf_5_${lessonNumber}_placeholder`,
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

export const UNIT_5: Unit = {
  id: 'wf_unit_5',
  unitNumber: 5,
  title: 'Section 5: コスト・料金・老朽化指標と実践複合診断',
  description: '料金回収率、給水原価の算定ロジック（長期前受金戻入控除）、有収率（漏水・メーター管理）、老朽化3指標、および複数の指標を掛け合わせた実践クロス診断を学びます。',
  badgeText: '複合診断・戦略編',
  lessons: [
    createPlaceholderLesson('wf_unit_5', 1, 'Lesson 5-1: 料金回収率・供給単価と水道料金の基本構造（二部料金制）', '独立採算の達成度と逆ザヤ・二部料金制の仕組み', '総務省『経営指標の概要（水道事業）』'),
    createPlaceholderLesson('wf_unit_5', 2, 'Lesson 5-2: 給水原価の算定ロジック（長期前受金戻入控除・固定費の罠）', '水1m³供給コストの算出と人口減少の影響', '総務省『経営指標の概要（水道事業）』'),
    createPlaceholderLesson('wf_unit_5', 3, 'Lesson 5-3: 有収率・無収水対策（漏水調査とメーター8年満期交換）', '売上になった水量の割合と計量法8年満期交換の義務', '総務省『経営指標の概要（水道事業）』'),
    createPlaceholderLesson('wf_unit_5', 4, 'Lesson 5-4: 老朽化3指標（減価償却率・管路経年化率・管路更新率2.5%）', '資産老朽度合と法定耐用年数40年・更新ペース', '総務省『経営指標の概要（水道事業）』'),
    createPlaceholderLesson('wf_unit_5', 5, 'Lesson 5-5: 実践クロス診断・経営戦略（10年計画・広域化・料金改定判断）', '複数指標の掛け合わせ診断と持続可能な好循環経営', '総務省『水道事業経営戦略策定マニュアル』')
  ]
};
