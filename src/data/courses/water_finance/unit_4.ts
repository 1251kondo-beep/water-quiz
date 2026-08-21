import { Unit, Lesson } from '@/types/quiz';

// ======================================================================
// SECTION 4: 経営の健全性・効率性指標マスター (作成中)
// ======================================================================

const createPlaceholderLesson = (
  unitId: string,
  lessonNumber: number,
  title: string,
  subtitle: string,
  referenceSection: string
): Lesson => ({
  id: `wf_lesson_4_${lessonNumber}`,
  unitId,
  lessonNumber,
  title,
  subtitle,
  description: '【作成中】本レッスンは現在問題データを作成中です。（次回アップデートにて公開予定）',
  isComingSoon: true,
  questions: [
    {
      id: `wf_4_${lessonNumber}_placeholder`,
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

export const UNIT_4: Unit = {
  id: 'wf_unit_4',
  unitNumber: 4,
  title: 'Section 4: 経営の健全性・効率性指標マスター',
  description: '総務省の公営企業経営比較表における主要指標（経常収支比率、累積欠損金比率、流動比率、企業債残高対給水収益比率、施設利用率）の計算式・基準・判定を学びます。',
  badgeText: '健全性指標編',
  lessons: [
    createPlaceholderLesson('wf_unit_4', 1, 'Lesson 4-1: 経常収支比率（法適用）と収益的収支比率（法非適用）', '100%基準と単年度黒字・改善傾向の評価', '総務省『経営指標の概要（水道事業）』'),
    createPlaceholderLesson('wf_unit_4', 2, 'Lesson 4-2: 累積欠損金比率と未処理欠損金の解消プロセス', '過去の累積赤字残高と0%達成への道筋', '総務省『経営指標の概要（水道事業）』'),
    createPlaceholderLesson('wf_unit_4', 3, 'Lesson 4-3: 流動比率と短期債務支払能力（1年以内償還企業債の扱い）', '手元の短期支払能力と100%基準の解釈', '総務省『経営指標の概要（水道事業）』'),
    createPlaceholderLesson('wf_unit_4', 4, 'Lesson 4-4: 企業債残高対給水収益比率（借入金規模の評価と落とし穴）', '類似団体平均との比較と「更新先送り」の見抜き方', '総務省『経営指標の概要（水道事業）』'),
    createPlaceholderLesson('wf_unit_4', 5, 'Lesson 4-5: 施設利用率・最大稼働率・負荷率（適正規模の診断）', '過大設備（オーバースペック）の判定とダウンサイジング', '総務省『経営指標の概要（水道事業）』')
  ]
};
