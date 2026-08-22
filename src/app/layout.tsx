import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: '水ドリ - 水道事業ステップアップドリル',
  description: '異動したての職員向け！市の上水道事業に関する知識・基礎を習得するためのドリル。企業会計（3条・4条）、企業債、減価償却、アセットマネジメント、法規を短時間で学習。',
  icons: {
    icon: '/icon.jpg',
    apple: '/app-icon.jpg',
  },
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
        <footer className="w-full py-6 border-t border-sky-200 text-center text-xs text-sky-700/80 bg-sky-50/50">
          水道事業ステップアップドリル &copy; 2026
        </footer>
      </body>
    </html>
  );
}
