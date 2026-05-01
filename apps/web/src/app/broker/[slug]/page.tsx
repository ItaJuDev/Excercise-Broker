import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBroker } from '@/lib/api';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const broker = await getBroker(slug).catch(() => null);
  if (!broker) {
    return {
      title: 'Broker not found',
      description: 'The requested broker could not be found.',
    };
  }
  const desc = broker.description.slice(0, 160);
  return {
    title: broker.name,
    description: desc,
    alternates: { canonical: `/broker/${broker.slug}` },
    openGraph: {
      title: broker.name,
      description: desc,
      type: 'website',
      images: broker.logo_url ? [{ url: broker.logo_url }] : undefined,
    },
    twitter: {
      card: 'summary',
      title: broker.name,
      description: desc,
    },
  };
}

export const dynamic = 'force-dynamic';

const MARKETS = [
  { label: 'Forex Pairs', value: '80+' },
  { label: 'Indices', value: '25' },
  { label: 'Commodities', value: '18' },
  { label: 'Equities', value: '4,000+' },
  { label: 'Sovereign Bonds', value: '12' },
  { label: 'Cryptos', value: '5' },
];

export default async function BrokerDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const broker = await getBroker(slug);
  if (!broker) notFound();

  const created = new Date(broker.created_at).getFullYear();

  return (
    <article className='space-y-12'>
      {/* Hero */}
      <header className='relative overflow-hidden rounded-3xl border border-white/5'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={broker.logo_url}
          alt=''
          className='absolute inset-0 h-full w-full object-cover opacity-50'
        />
        <div className='absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-transparent' />
        <div className='relative px-8 py-14 sm:px-12 sm:py-20'>
          <div className='flex items-center gap-3'>
            <span className='eyebrow text-accent'>Institutional Grade</span>
            <span className='text-accent'>· · · · ·</span>
          </div>
          <h1 className='mt-4 max-w-2xl font-display text-5xl font-bold leading-tight text-white sm:text-6xl'>
            {broker.name}
          </h1>
          <p className='mt-4 max-w-xl text-sm text-muted sm:text-base'>
            {broker.description.split('. ').slice(0, 1).join('. ')}.
          </p>
          <div className='mt-8 flex flex-wrap gap-3'>
            <a
              href={broker.website}
              target='_blank'
              rel='noopener noreferrer'
              className='rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover'
            >
              Visit Website
            </a>
            <button className='rounded-lg border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10'>
              Download Prospectus
            </button>
          </div>
        </div>
      </header>

      {/* Body two-column */}
      <section className='grid gap-8 lg:grid-cols-[1.6fr_1fr]'>
        <div className='space-y-5'>
          <h2 className='font-display text-3xl font-bold text-white'>The Sovereign Mandate</h2>
          <p className='whitespace-pre-line text-sm leading-relaxed text-muted'>
            {broker.description}
          </p>

          <div className='mt-8 grid gap-4 sm:grid-cols-2'>
            <Feature
              icon={
                <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                  <path d='M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4Z' />
                </svg>
              }
              title='SEC & FCA Regulated'
              text='Operating under the strictest global mandates for transparency and capital reserve requirements.'
            />
            <Feature
              icon={
                <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                  <circle cx='12' cy='12' r='10' />
                  <path d='M12 6v6l4 2' />
                </svg>
              }
              title='12ms Execution'
              text='Industry-leading throughput powered by our proprietary Sterling Core engine.'
            />
          </div>
        </div>

        <aside className='panel space-y-6 p-6'>
          <h3 className='font-display text-2xl font-bold text-white'>Performance Metrics</h3>
          <Metric label='AUM Growth (YoY)' value='+24.8%' tag='↗' />
          <Metric label='Liquidity Access' value='$12.4B' tag='Daily Average' />
          <Metric label='Client Retention' value='98.2%' tag='H1 2026' />
          <button className='w-full rounded-lg border border-white/10 bg-ink-800/60 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-700'>
            View Full Audit Report
          </button>

          <div className='border-t border-white/5 pt-5'>
            <p className='eyebrow mb-3'>Contact & Details</p>
            <ul className='space-y-2 text-xs text-muted'>
              <li>One Canary Wharf, London, E14 5AB</li>
              <li>institutions@{broker.slug}.com</li>
              <li className='text-accent'>{broker.website}</li>
              <li className='text-[11px] uppercase tracking-wider text-muted'>
                Established {created}
              </li>
            </ul>
          </div>
        </aside>
      </section>

      {/* Markets */}
      <section className='space-y-6'>
        <h2 className='font-display text-3xl font-bold text-white'>Available Markets</h2>
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6'>
          {MARKETS.map((m) => (
            <div key={m.label} className='panel p-4 text-center'>
              <p className='eyebrow'>{m.label}</p>
              <p className='mt-2 font-display text-2xl font-bold text-white'>{m.value}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className='panel p-5'>
      <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent'>
        {icon}
      </div>
      <h4 className='mt-3 text-sm font-semibold text-white'>{title}</h4>
      <p className='mt-1 text-xs leading-relaxed text-muted'>{text}</p>
    </div>
  );
}

function Metric({ label, value, tag }: { label: string; value: string; tag: string }) {
  return (
    <div>
      <p className='eyebrow'>{label}</p>
      <div className='mt-1 flex items-baseline justify-between'>
        <span className='font-display text-2xl font-bold text-white'>{value}</span>
        <span className='text-[11px] uppercase tracking-wider text-muted'>{tag}</span>
      </div>
    </div>
  );
}
