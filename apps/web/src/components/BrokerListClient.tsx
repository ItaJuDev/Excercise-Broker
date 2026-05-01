'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getBrokers } from '@/lib/api';
import { BROKER_TYPES, type Broker, type BrokerType } from '@/lib/types';
import { useDebounce } from '@/lib/useDebounce';
import { BrokerCard } from './BrokerCard';

interface Props {
  initialBrokers: Broker[];
}

const FILTERS: { value: BrokerType | ''; label: string }[] = [
  { value: '', label: 'All Partners' },
  ...BROKER_TYPES.map((t) => ({ value: t, label: t.toUpperCase() })),
];

export function BrokerListClient({ initialBrokers }: Props) {
  const [search, setSearch] = useState('');
  const [type, setType] = useState<BrokerType | ''>('');
  const [brokers, setBrokers] = useState<Broker[]>(initialBrokers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 400);
  const isFiltered = debouncedSearch !== '' || type !== '';

  useEffect(() => {
    if (!isFiltered) {
      setBrokers(initialBrokers);
      setError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getBrokers({ search: debouncedSearch, type })
      .then((data) => {
        if (!cancelled) {
          setBrokers(data);
          setError(null);
        }
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, type, isFiltered, initialBrokers]);

  return (
    <div className='space-y-6'>
      <div className='relative'>
        <svg
          className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted'
          width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'
        >
          <circle cx='11' cy='11' r='7' />
          <path d='m21 21-4.3-4.3' />
        </svg>
        <input
          type='search'
          placeholder='Find brokers by name, region, or asset class...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='w-full rounded-xl border border-white/10 bg-ink-850/70 py-3 pl-11 pr-4 text-sm text-white placeholder:text-muted focus:border-accent focus:outline-none'
        />
      </div>

      <div className='flex flex-wrap items-center gap-3'>
        <span className='eyebrow mr-2'>Asset Focus</span>
        {FILTERS.map((f) => {
          const active = type === f.value;
          return (
            <button
              key={f.label}
              onClick={() => setType(f.value)}
              className={`rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                active
                  ? 'bg-accent text-white shadow-glow'
                  : 'border border-white/10 bg-ink-800/60 text-muted hover:text-white'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {error && (
        <div className='rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200'>
          {error}
        </div>
      )}

      <div className='text-xs text-muted'>
        {loading ? 'Loading...' : `${brokers.length} broker${brokers.length === 1 ? '' : 's'}`}
      </div>

      {brokers.length === 0 ? (
        <div className='panel p-10 text-center text-sm text-muted'>
          No brokers match your filters.
        </div>
      ) : (
        <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
          {brokers.map((b) => (
            <BrokerCard key={b.id} broker={b} />
          ))}
          <PartnerCta />
        </div>
      )}
    </div>
  );
}

function PartnerCta() {
  return (
    <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-accent/40 bg-accent/5 p-6 text-center'>
      <div className='flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent'>
        <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
          <path d='M12 2 2 7l10 5 10-5-10-5Z' />
          <path d='M2 17l10 5 10-5' />
          <path d='M2 12l10 5 10-5' />
        </svg>
      </div>
      <h3 className='mt-3 text-base font-semibold text-white'>Partner with Us</h3>
      <p className='mt-1 text-xs text-muted'>
        Are you an institutional broker? Join our exclusive network of providers.
      </p>
      <Link
        href='/create'
        className='mt-4 rounded-lg bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-accent-hover'
      >
        Inquire Now
      </Link>
    </div>
  );
}
