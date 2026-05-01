import Link from 'next/link';
import type { Broker } from '@/lib/types';

const TYPE_BADGE: Record<Broker['broker_type'], string> = {
  cfd: 'bg-purple-100 text-purple-800',
  bond: 'bg-amber-100 text-amber-800',
  stock: 'bg-emerald-100 text-emerald-800',
  crypto: 'bg-sky-100 text-sky-800',
};

export function BrokerCard({ broker }: { broker: Broker }) {
  return (
    <Link
      href={`/broker/${broker.slug}`}
      className="flex gap-4 rounded-lg border border-slate-200 bg-white p-4 transition hover:border-slate-400 hover:shadow-sm"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={broker.logo_url}
        alt={`${broker.name} logo`}
        className="h-16 w-16 rounded-md object-cover"
      />
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-semibold text-slate-900">{broker.name}</h3>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium uppercase ${TYPE_BADGE[broker.broker_type]}`}
          >
            {broker.broker_type}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-slate-600">{broker.description}</p>
      </div>
    </Link>
  );
}
