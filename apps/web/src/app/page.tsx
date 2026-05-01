import { getBrokers } from '@/lib/api';
import { BrokerListClient } from '@/components/BrokerListClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let initialBrokers = [] as Awaited<ReturnType<typeof getBrokers>>;
  let initError: string | null = null;
  try {
    initialBrokers = await getBrokers();
  } catch (e) {
    initError = (e as Error).message;
  }

  return (
    <div className='space-y-10'>
      <section>
        <h1 className='font-display text-5xl font-bold text-white sm:text-6xl'>
          Institutional Brokers
        </h1>
        <p className='mt-4 max-w-xl text-sm text-muted'>
          Access global liquidity through our curated network of elite financial
          institutions and market makers.
        </p>
      </section>

      {initError && (
        <div className='rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200'>
          Failed to load brokers: {initError}
        </div>
      )}

      <BrokerListClient initialBrokers={initialBrokers} />
    </div>
  );
}
