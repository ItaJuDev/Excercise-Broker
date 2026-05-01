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

const NAV = [
  { href: '/', label: 'Brokers' },
  { href: '#', label: 'Markets' },
  { href: '#', label: 'Analysis' },
  { href: '#', label: 'Education' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <header className='border-b border-white/5'>
          <nav className='mx-auto flex max-w-6xl items-center justify-between px-6 py-5'>
            <Link href='/' className='font-display text-xl font-bold text-white'>
              Woxa
            </Link>
            <div className='hidden items-center gap-8 text-sm text-muted sm:flex'>
              {NAV.map((n) => (
                <Link key={n.label} href={n.href} className='transition hover:text-white'>
                  {n.label}
                </Link>
              ))}
            </div>
            <div className='flex items-center gap-3 text-muted'>
              <button aria-label='Notifications' className='rounded-full border border-white/10 p-2 transition hover:text-white'>
                <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                  <path d='M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9' />
                  <path d='M10 21a2 2 0 0 0 4 0' />
                </svg>
              </button>
              <button aria-label='Account' className='rounded-full border border-white/10 p-2 transition hover:text-white'>
                <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                  <circle cx='12' cy='8' r='4' />
                  <path d='M4 21a8 8 0 0 1 16 0' />
                </svg>
              </button>
            </div>
          </nav>
        </header>

        <main className='mx-auto max-w-6xl px-6 py-10'>{children}</main>

        <footer className='mt-16 border-t border-white/5'>
          <div className='mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 text-xs text-muted sm:flex-row'>
            <span className='font-display text-base font-bold text-white'>Woxa</span>
            <div className='flex flex-wrap items-center gap-6 uppercase tracking-[0.16em]'>
              <a href='#'>Privacy Policy</a>
              <a href='#'>Terms of Service</a>
              <a href='#'>Risk Disclosure</a>
              <a href='#'>Contact</a>
            </div>
            <span>© 2026 Sterling Midnight. All rights reserved.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
