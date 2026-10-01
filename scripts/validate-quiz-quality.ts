import { DOMAINS } from '../src/data/domains';

// 1. 禁止語彙ブロックリスト（ネタ・無関係ドメインの語彙）
const BANNED_PATTERNS = [
  { pattern: /株式/, reason: '金融・株式用語' },
  { pattern: /配当金?/, reason: '金融・株式用語' },
  { pattern: /民間ファンド/, reason: '金融用語' },
  { pattern: /株価/, reason: '金融用語' },
  { pattern: /政党/, reason: '政治用語' },
  { pattern: /支持率調査/, reason: '世論調査用語' },
  { pattern: /内閣/, reason: '政治用語' },
  { pattern: /自首/, reason: '警察・刑事用語' },
  { pattern: /逮捕/, reason: '警察・刑事用語' },
  { pattern: /爆破/, reason: '荒唐無稽・破壊用語' },
  { pattern: /高圧送電線/, reason: '荒唐無稽用語' },
  { pattern: /強制解体/, reason: '極端な荒唐無稽用語' },
];

let totalQuestions = 0;
let errorsCount = 0;

console.log('🔍 クイズ品質・ディストラクター自動検証を開始します...\n');

for (const domain of DOMAINS) {
  for (const course of domain.courses) {
    for (const unit of course.units) {
      for (const lesson of unit.lessons) {
        for (const q of lesson.questions) {
          totalQuestions++;
          const options = q.options || [];

          // 1. 禁止語彙チェック
          options.forEach((opt, idx) => {
            for (const { pattern, reason } of BANNED_PATTERNS) {
              if (pattern.test(opt)) {
                console.error(
                  `❌ [禁止語検出] ${course.id} > ${lesson.id} > ${q.id} (選択肢 ${idx + 1}): "${opt}" [理由: ${reason}]`
                );
                errorsCount++;
              }
            }
          });

          // 2. 否定形問題の太字チェック
          const negativeWords = ['含まれない', '該当しない', '誤っている', '適切でない', '正しくない'];
          for (const neg of negativeWords) {
            const isBolded = new RegExp(`\\*\\*[^*]*${neg}[^*]*\\*\\*`).test(q.question);
            if (q.question.includes(neg) && !isBolded) {
              console.warn(
                `⚠️  [太字推奨] ${course.id} > ${lesson.id} > ${q.id}: 「${neg}」が太字（**${neg}**）になっていません`
              );
            }
          }
        }
      }
    }
  }
}

console.log(`\n========================================`);
console.log(`総問題数: ${totalQuestions} 問の検査完了`);
if (errorsCount > 0) {
  console.error(`💥 ネタ・禁止語エラーが ${errorsCount} 件検出されました。修正が必要です。`);
  process.exit(1);
} else {
  console.log(`✅ すべての問題が品質基準・禁止語規程をクリアしています！`);
}
