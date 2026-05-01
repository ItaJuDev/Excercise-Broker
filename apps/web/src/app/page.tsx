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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Brokers</h1>
        <p className="text-sm text-slate-600">
          Browse all brokers. Search by name or filter by type.
        </p>
      </div>
      {initError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          Failed to load brokers: {initError}
        </div>
      )}
      <BrokerListClient initialBrokers={initialBrokers} />
    </div>
  );
}
