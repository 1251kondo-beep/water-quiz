import { Unit, Lesson } from '@/types/quiz';

// ======================================================================
// SECTION 3: 設計水量（計画瞬時最大水量）の算出方法 (作成中)
// ======================================================================

const createPlaceholderLesson = (
  unitId: string,
  lessonNumber: number,
  title: string,
  subtitle: string,
  referenceSection: string
): Lesson => ({
  id: `wd_lesson_3_${lessonNumber}`,
  unitId,
  lessonNumber,
  title,
  subtitle,
  description: '【作成中】本レッスンは現在問題データを作成中です。（次回アップデートにて公開予定）',
  isComingSoon: true,
  questions: [
    {
      id: `wd_3_${lessonNumber}_placeholder`,
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
  id: 'wd_unit_3',
  unitNumber: 3,
  title: 'Section 3: 設計水量（計画瞬時最大水量）の算出方法',
  description: '戸建住宅の同時使用率法・水量比法、事務所等の器具給水負荷単位法、集合住宅戸数算定式、および器具の最低作動水圧・最低必要水圧を学びます。',
  badgeText: '設計水量算定編',
  lessons: [
    createPlaceholderLesson('wd_unit_3', 1, 'Lesson 3-1: 住宅・個別住戸の水量算定①（同時使用率を考慮した給水器具設定法）', '総給水器具数と同時使用器具数、器具別標準吐水量の積算', '『参考設計資料』3.(1) P.28'),
    createPlaceholderLesson('wd_unit_3', 2, 'Lesson 3-2: 住宅・個別住戸の水量算定②（給水器具数と同時使用水量比法）', '最大吐水量qmと同時使用水量比βによる瞬時最大水量算定', '『参考設計資料』3.(2) P.29'),
    createPlaceholderLesson('wd_unit_3', 3, 'Lesson 3-3: 住宅以外の建物（事務所・ビル）の水量算定（器具給水負荷単位法）', '衛生器具負荷単位（FU）の積算、洗浄弁・洗浄タンク別流量換算', '『参考設計資料』3.(3) P.30〜33'),
    createPlaceholderLesson('wd_unit_3', 4, 'Lesson 3-4: 集合住宅の戸数算定式（住宅部品開発センター式：42N^0.33・19N^0.67)', '戸数Nからの同時使用流量推計、10戸未満・以上の区分計算', '『参考設計資料』3.(4) P.34〜35'),
    createPlaceholderLesson('wd_unit_3', 5, 'Lesson 3-5: 給水器具の最低作動水圧と最低必要水圧（直圧大便器・給湯器・混合栓）', '直圧式便器・給湯器の作動水圧、サーモ混合栓等の必要水頭', '『参考設計資料』4.(1)〜(3) P.36')
  ]
};
