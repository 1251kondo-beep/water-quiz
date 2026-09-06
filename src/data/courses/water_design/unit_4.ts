import { Unit, Lesson } from '@/types/quiz';

// ======================================================================
// SECTION 4: 実践！水理計算書と図面審査の実務 (作成中)
// ======================================================================

const createPlaceholderLesson = (
  unitId: string,
  lessonNumber: number,
  title: string,
  subtitle: string,
  referenceSection: string
): Lesson => ({
  id: `wd_lesson_4_${lessonNumber}`,
  unitId,
  lessonNumber,
  title,
  subtitle,
  description: '【作成中】本レッスンは現在問題データを作成中です。（次回アップデートにて公開予定）',
  isComingSoon: true,
  questions: [
    {
      id: `wd_4_${lessonNumber}_placeholder`,
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
  id: 'wd_unit_4',
  unitNumber: 4,
  title: 'Section 4: 実践！水理計算書と図面審査の実務',
  description: '戸建直圧、3階直圧、集合住宅、事務所ビル、受水槽給水の実例水理計算書をトレースし、審査技術者としての検証・指導能力を養います。',
  badgeText: '水理審査実践編',
  lessons: [
    createPlaceholderLesson('wd_unit_4', 1, 'Lesson 4-1: 一般住宅の直圧給水水理計算審査（末端給水栓の余裕水頭判定）', '区間流量、動水勾配、局所損失集計、末端器具の余裕水頭判定', '『参考設計資料』5.(1)① P.37〜42'),
    createPlaceholderLesson('wd_unit_4', 2, 'Lesson 4-2: 3階直圧給水及び配水支管の水理計算（同時開栓水量式 Q=q・N^0.475）', '立上り損失、配水支管の同時開栓式（Q=qN^0.475）と口径決定', '『参考設計資料』5.(1)②③ P.43〜44'),
    createPlaceholderLesson('wd_unit_4', 3, 'Lesson 4-3: アパート（2階・3階）及び直結増圧集合住宅の水理計算審査', '集中検針盤損失、増圧ポンプ全揚程、階層別減圧弁の審査', '『参考設計資料』5.(1)④〜⑥ P.45〜48'),
    createPlaceholderLesson('wd_unit_4', 4, 'Lesson 4-4: 事務所ビル（3階直圧）の水理計算審査（系統負荷単位の追跡）', '系統負荷単位の追跡、主管口径の選定、最遠器具の余裕水頭確認', '『参考設計資料』5.(1)⑦ P.49'),
    createPlaceholderLesson('wd_unit_4', 5, 'Lesson 4-5: 貯水槽給水方式の設計審査（受水槽有効容量・定水位弁・ボールタップ）', '受水槽有効容量算定、許容抵抗値R式、定水位弁・ボールタップ選定', '『参考設計資料』5.(2) P.50〜55')
  ]
};
