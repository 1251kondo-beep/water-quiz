import { Unit, Lesson } from '@/types/quiz';

// ======================================================================
// SECTION 2: 重要勘定科目・減価償却・除却の実務 (作成中)
// ======================================================================

const createPlaceholderLesson = (
  unitId: string,
  lessonNumber: number,
  title: string,
  subtitle: string,
  referenceSection: string
): Lesson => ({
  id: `wf_lesson_2_${lessonNumber}`,
  unitId,
  lessonNumber,
  title,
  subtitle,
  description: '【作成中】本レッスンは現在問題データを作成中です。（次回アップデートにて公開予定）',
  questions: [
    {
      id: `wf_2_${lessonNumber}_placeholder`,
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

export const UNIT_2: Unit = {
  id: 'wf_unit_2',
  unitNumber: 2,
  title: 'Section 2: 重要勘定科目・減価償却・除却の実務',
  description: '3条・4条の各勘定科目（給水収益、受水費、長期前受金戻入等）、定額法による減価償却計算、固定資産の除却と資産減耗費の実務処理を学びます。',
  badgeText: '科目・実務編',
  lessons: [
    createPlaceholderLesson('wf_unit_2', 1, 'Lesson 2-1: 3条収益科目（給水収益・長期前受金戻入・他会計補助金）', '本業収入と現金が入らない収益の仕組み', '『地方公営企業法施行規則』勘定科目表'),
    createPlaceholderLesson('wf_unit_2', 2, 'Lesson 2-2: 3条費用科目（受水費・人件費・物件費・支払利息）', '固定費偏重のコスト構造と受水費の二部料金制', '『地方公営企業法施行規則』勘定科目表'),
    createPlaceholderLesson('wf_unit_2', 3, 'Lesson 2-3: 4条科目（建設改良費・企業債・補助金・負担金）', '設備投資・借入・国県補助金の会計整理', '『地方公営企業法』第30条（決算）'),
    createPlaceholderLesson('wf_unit_2', 4, 'Lesson 2-4: 減価償却費の計算と法定耐用年数（規則別表第二号）', '定額法計算と配水管40年の法的根拠', '『地方公営企業法施行規則』別表第二号'),
    createPlaceholderLesson('wf_unit_2', 5, 'Lesson 2-5: 固定資産の除却と資産減耗費の会計処理', '老朽管更新時の帳簿清算と残存簿価の費用化', '総務省『地方公営企業会計基準』')
  ]
};
