import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: '水道財政クイズ - 財政投資計画・公営企業会計をスマホで学べるアプリ',
  description: '異動したての職員向け！『投資財政計画_用語解説.md』に基づく3条・4条、企業債、減価償却、料金回収率の全90問4択クイズ。1レッスン10問で短時間学習。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased min-h-screen flex flex-col selection:bg-cyan-500 selection:text-white">
        <Header />
        <main className="flex-1 pb-12">{children}</main>
        <footer className="w-full py-6 border-t border-slate-800 text-center text-xs text-slate-500">
          水道事業 財政投資計画 学習プラットフォーム &copy; 2026
        </footer>
      </body>
    </html>
  );
}
