import Link from 'next/link';
import type { Broker } from '@/lib/types';

const TYPE_TAG: Record<Broker['broker_type'], string> = {
  cfd: 'High Yield',
  bond: 'Sovereign Grade',
  stock: 'Top Liquidity',
  crypto: 'Digital Asset',
};

export function BrokerCard({ broker }: { broker: Broker }) {
  return (
    <Link
      href={`/broker/${broker.slug}`}
      className='group flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-ink-850/70 transition hover:border-accent/40 hover:shadow-glow'
    >
      <div className='relative h-40 w-full overflow-hidden'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={broker.logo_url}
          alt={`${broker.name}`}
          className='h-full w-full object-cover transition duration-500 group-hover:scale-105'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/30 to-transparent' />
        <span className='absolute right-3 top-3 rounded-md bg-black/40 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur'>
          {TYPE_TAG[broker.broker_type]}
        </span>
      </div>

      <div className='flex flex-1 flex-col gap-3 p-5'>
        <div>
          <h3 className='font-display text-xl font-bold text-white'>{broker.name}</h3>
          <p className='mt-1 line-clamp-2 text-xs leading-relaxed text-muted'>
            {broker.description}
          </p>
        </div>

        <div className='mt-auto flex items-center justify-between border-t border-white/5 pt-3 text-[11px] uppercase tracking-wider text-muted'>
          <span className='flex items-center gap-1.5'>
            <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
              <path d='M12 22s-8-4.5-8-12a8 8 0 1 1 16 0c0 7.5-8 12-8 12Z' />
              <circle cx='12' cy='10' r='3' />
            </svg>
            {broker.broker_type.toUpperCase()}
          </span>
          <span className='inline-flex items-center gap-1 font-semibold text-accent'>
            View Details
            <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
              <path d='M5 12h14M13 5l7 7-7 7' />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
