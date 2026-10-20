import { DOMAINS } from '../src/data/domains';

// 1. 常時禁止語彙ブロックリスト（ネタ・SF・荒唐無稽・無関係ドメインの語彙：正誤問わず禁止）
const ALWAYS_BANNED_PATTERNS = [
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
  { pattern: /金（ゴールド）|純金|ゴールドに変化/, reason: '荒唐無稽・錬金術' },
  { pattern: /ブラックホール/, reason: '荒唐無稽・SF' },
  { pattern: /巨大な岩石|突き破る/, reason: '荒唐無稽・物理破壊' },
  { pattern: /有毒ガスとなり|有毒ガス.*充満/, reason: '荒唐無稽・毒劇物化' },
  { pattern: /立ち退か/, reason: '非現実的な強制措置' },
  { pattern: /地中深く埋設/, reason: '非現実的な埋設' },
  { pattern: /完全滅菌/, reason: '極端・非現実的な滅菌' },
  { pattern: /未来永劫/, reason: '極端な永続表現' },
  { pattern: /沸騰させ/, reason: '荒唐無稽な沸騰表現' },
  { pattern: /氷点下まで冷却/, reason: '荒唐無稽な冷却表現' },
];

// 2. 極端・ネタ化しやすい表現（誤答ディストラクターでの使用は厳格禁止）
const EXTREME_PATTERNS = [
  { pattern: /強制的に/, reason: '極端な強制表現' },
  { pattern: /永久に/, reason: '極端な永続表現' },
  { pattern: /全廃/, reason: '極端な全廃表現' },
  { pattern: /永久遮断/, reason: '極端な永続遮断' },
  { pattern: /永久停止/, reason: '極端な永続停止' },
];

// 3. 正当な工学・法規用語としてのホワイトリスト（検知除外）
const WHITELIST_PATTERNS = [
  /永久ひずみ/,
  /永久伸び/,
  /永久磁石/,
  /永久歪/,
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

          // 1. 禁止語彙 & 極端表現チェック
          options.forEach((opt, idx) => {
            // ホワイトリストに合致する正規専門用語はパス
            if (WHITELIST_PATTERNS.some((w) => w.test(opt))) return;

            // ① 常時禁止パターン（正解・誤答問わずNG）
            for (const { pattern, reason } of ALWAYS_BANNED_PATTERNS) {
              if (pattern.test(opt)) {
                console.error(
                  `❌ [ネタ・禁止語検出] ${course.id} > ${lesson.id} > ${q.id} (選択肢 ${idx + 1}): "${opt}" [理由: ${reason}]`
                );
                errorsCount++;
              }
            }

            // ② 極端表現チェック（誤答、またはネタ選択肢として機能している場合NG）
            const isCorrectOption =
              q.type === 'multiple_choice' || (q.answerIndices && q.answerIndices.length > 0)
                ? (q.answerIndices || []).includes(idx)
                : q.answerIndex === idx;

            for (const { pattern, reason } of EXTREME_PATTERNS) {
              if (pattern.test(opt)) {
                if (!isCorrectOption) {
                  // 誤答（ディストラクター）に極端ワードが入っている場合は一発でエラー
                  console.error(
                    `❌ [極端な誤答検出] ${course.id} > ${lesson.id} > ${q.id} (誤答肢 ${idx + 1}): "${opt}" [理由: ${reason}（安易な消去法を誘発）]`
                  );
                  errorsCount++;
                } else {
                  // 正解選択肢の場合：否定形問題で「不適切なものを選べ」の正解としてネタ選択肢になっているか警告/エラー
                  const isNegativeQ = /適切でない|誤っている|含まれない|正しくない/.test(q.question);
                  if (isNegativeQ) {
                    console.error(
                      `❌ [極端な不正解肢検出] ${course.id} > ${lesson.id} > ${q.id} (正解肢 ${idx + 1}): "${opt}" [理由: 否定形問題の正解として極端・ネタ選択肢が設定されています]`
                    );
                    errorsCount++;
                  } else {
                    // 肯定形問題で正当な文脈で使われている場合は情報ログのみ
                    console.info(
                      `ℹ️  [正解内極端語] ${course.id} > ${lesson.id} > ${q.id} (正解肢 ${idx + 1}): "${opt}" [文脈確認推奨]`
                    );
                  }
                }
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

          // 3. 穴埋め問題（fill_in_the_blank）のプレースホルダー検証
          if (q.type === 'fill_in_the_blank' || q.blankText) {
            if (!q.blankText) {
              console.error(`❌ [穴埋め不備] ${course.id} > ${lesson.id} > ${q.id}: blankText が未定義です`);
              errorsCount++;
            } else {
              const blanks = q.blanks || [];
              if (blanks.length === 0) {
                console.error(`❌ [穴埋め不備] ${course.id} > ${lesson.id} > ${q.id}: blanks 定義が空です`);
                errorsCount++;
              }
              for (const b of blanks) {
                const placeholder = `【空欄${b.id}】`;
                if (!q.blankText.includes(placeholder)) {
                  console.error(
                    `❌ [穴埋め不備] ${course.id} > ${lesson.id} > ${q.id}: blankText に "${placeholder}" が見つかりません (blankText: "${q.blankText}")`
                  );
                  errorsCount++;
                }
                if (!options.includes(b.answer)) {
                  console.error(
                    `❌ [穴埋め不備] ${course.id} > ${lesson.id} > ${q.id}: blanks の正解 "${b.answer}" が options に含まれていません`
                  );
                  errorsCount++;
                }
              }
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
