import { Unit, Lesson } from '@/types/quiz';

// ======================================================================
// SECTION 5: 給水分岐判断と水道法・審査関連規定 (作成中)
// ======================================================================

const createPlaceholderLesson = (
  unitId: string,
  lessonNumber: number,
  title: string,
  subtitle: string,
  referenceSection: string
): Lesson => ({
  id: `wd_lesson_5_${lessonNumber}`,
  unitId,
  lessonNumber,
  title,
  subtitle,
  description: '【作成中】本レッスンは現在問題データを作成中です。（次回アップデートにて公開予定）',
  isComingSoon: true,
  questions: [
    {
      id: `wd_5_${lessonNumber}_placeholder`,
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
  id: 'wd_unit_5',
  unitNumber: 5,
  title: 'Section 5: 給水分岐判断と水道法・審査関連規定',
  description: '管径均等表による配水管分岐判断、主管口径別PP枝管許容本数、給水戸数125戸の設計境界線、水道法施行令第5条の構造材質基準、受水槽以下切替審査を学びます。',
  badgeText: '分岐判断・法規編',
  lessons: [
    createPlaceholderLesson('wd_unit_5', 1, 'Lesson 5-1: 配水管からの給水分岐判断①（ヘーゼン式・ダルシー式管径均等表）', '平行閉管路への分解理論、ヘーゼン式・ダルシー式管径均等表の導出', '『参考設計資料』7.(1) P.60〜61'),
    createPlaceholderLesson('wd_unit_5', 2, 'Lesson 5-2: 配水管からの給水分岐判断②（主管口径別PP枝管分岐許容本数）', 'PP管実内径データに基づく分岐本数計算、私設主管分岐の指導', '『参考設計資料』7.(2) P.62'),
    createPlaceholderLesson('wd_unit_5', 3, 'Lesson 5-3: 配水管・支管の設計流量決定法（時間係数K・給水戸数125戸の境界線）', '時間最大給水量QH vs 同時開栓水量Q1、給水規模と時間係数K', '『参考設計資料』7.(3) P.62〜65'),
    createPlaceholderLesson('wd_unit_5', 4, 'Lesson 5-4: 水道法施行令第5条（構造材質基準・30cm離隔・過大口径・直接ポンプ）', '耐圧性能、浸出性能、汚染防止、過大口径制限、直結加圧ポンプ禁止', '『水道法施行令』第5条、『参考設計資料』6.(1) P.56'),
    createPlaceholderLesson('wd_unit_5', 5, 'Lesson 5-5: 受水槽以下設備の給水装置切替え審査（事前確認・耐圧試験1.75MPa等）', '事前調査、耐圧試験1.75MPa・1分間保持、浸出性能適合確認', '厚生労働省通知（健水発0905002号）、『参考設計資料』6.(2) P.57〜59')
  ]
};
