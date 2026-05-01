'use client';

import { useEffect, useState } from 'react';
import { getBrokers } from '@/lib/api';
import { BROKER_TYPES, type Broker, type BrokerType } from '@/lib/types';
import { useDebounce } from '@/lib/useDebounce';
import { BrokerCard } from './BrokerCard';

interface Props {
  initialBrokers: Broker[];
}

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
      <div className='flex flex-col gap-3 sm:flex-row'>
        <input
          type='search'
          placeholder='Search by broker name...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none'
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value as BrokerType | '')}
          className='rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none'
        >
          <option value=''>All Partners</option>
          {BROKER_TYPES.map((t) => (
            <option key={t} value={t}>
              {t.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className='rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800'>{error}</div>
      )}

      <div className='text-xs text-slate-500'>
        {loading ? 'Loading...' : `${brokers.length} broker${brokers.length === 1 ? '' : 's'}`}
      </div>

      {brokers.length === 0 ? (
        <div className='rounded-md border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500'>
          No brokers match your filters.
        </div>
      ) : (
        <div className='grid gap-3 sm:grid-cols-2'>
          {brokers.map((b) => (
            <BrokerCard key={b.id} broker={b} />
          ))}
        </div>
      )}
    </div>
  );
}
