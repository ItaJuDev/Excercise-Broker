import type { Metadata } from 'next';
import Link from 'next/link';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Woxa',
    template: '%s | Woxa',
  },
  description: 'Browse, search and manage brokers across CFDs, bonds, stocks and crypto.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <header className='border-b border-slate-200 bg-white'>
          <nav className='mx-auto flex max-w-5xl items-center justify-between px-4 py-3'>
            <Link href='/' className='text-lg font-semibold text-slate-900'>
              Woxa
            </Link>
            <div className='flex items-center gap-4 text-sm'>
              <Link href='/' className='text-slate-600 hover:text-slate-900'>
                Browse
              </Link>
              <Link href='/create' className='rounded-md bg-slate-900 px-3 py-1.5 text-white hover:bg-slate-700'>
                + Add broker
              </Link>
            </div>
          </nav>
        </header>
        <main className='mx-auto max-w-5xl px-4 py-8'>{children}</main>
      </body>
    </html>
  );
}
