import { Unit, Lesson } from '@/types/quiz';

// ======================================================================
// SECTION 2: 給水方式の選定と管口径決定の計算実務 (作成中)
// ======================================================================

const createPlaceholderLesson = (
  unitId: string,
  lessonNumber: number,
  title: string,
  subtitle: string,
  referenceSection: string
): Lesson => ({
  id: `wd_lesson_2_${lessonNumber}`,
  unitId,
  lessonNumber,
  title,
  subtitle,
  description: '【作成中】本レッスンは現在問題データを作成中です。（次回アップデートにて公開予定）',
  isComingSoon: true,
  questions: [
    {
      id: `wd_2_${lessonNumber}_placeholder`,
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
  id: 'wd_unit_2',
  unitNumber: 2,
  title: 'Section 2: 給水方式の選定と管口径決定の計算実務',
  description: '直結給水方式と貯水槽給水方式の選定、設計計算フロー、管内流速基準（2.0m/sec以下）、継手類の局所損失、メーター・特殊器具の選定を学びます。',
  badgeText: '給水方式・口径決定編',
  lessons: [
    createPlaceholderLesson('wd_unit_2', 1, 'Lesson 2-1: 給水方式の分類とメリット・デメリット（直圧・増圧・受水槽）', '直圧・増圧・受水槽の特徴、水質衛生、災害対応力の比較', '『参考設計資料』2.(1) P.11〜12'),
    createPlaceholderLesson('wd_unit_2', 2, 'Lesson 2-2: 給水装置の設計計算フローと建物用途別標準水量（qd・qhの算出）', '計算フロー、建物種類別標準給水量と使用時間、qd・qhの算定', '『参考設計資料』2.(2)〜(3) P.13〜15'),
    createPlaceholderLesson('wd_unit_2', 3, 'Lesson 2-3: 管内流速の制限基準（流速2.0m/sec以下とウォーターハンマー防止）', '流速2.0m/sの技術的根拠、水撃作用防止、管種別許容最大流量', '『参考設計資料』1.(10)、2.(4) P.6, 16'),
    createPlaceholderLesson('wd_unit_2', 4, 'Lesson 2-4: 局所損失の算定（継手類の直管換算長・損失換算係数・弁栓類損失）', 'エルボ・チーズの直管換算長、逆止弁・止水栓の損失水頭集計', '『参考設計資料』2.(4) P.17〜21'),
    createPlaceholderLesson('wd_unit_2', 5, 'Lesson 2-5: メーター選定と特殊器具の損失（計量範囲・ヘッダー工法・減圧逆防）', '水道メーター適正口径、サヤ管ヘッダー工法、減圧式逆流防止器', '『参考設計資料』2.(4) P.26〜27')
  ]
};
