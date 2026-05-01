import type { Metadata } from 'next';
import Link from 'next/link';
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

export default async function BrokerDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const broker = await getBroker(slug);
  if (!broker) notFound();

  return (
    <article className="space-y-6">
      <Link href="/" className="text-sm text-slate-500 hover:text-slate-900">
        ← Back to brokers
      </Link>

      <header className="flex items-start gap-4 rounded-lg border border-slate-200 bg-white p-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={broker.logo_url}
          alt={`${broker.name} logo`}
          className="h-24 w-24 rounded-md object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">{broker.name}</h1>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium uppercase text-slate-700">
              {broker.broker_type}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">slug: {broker.slug}</p>
          <a
            href={broker.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm text-blue-600 hover:underline"
          >
            {broker.website} ↗
          </a>
        </div>
      </header>

      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Description
        </h2>
        <p className="whitespace-pre-line text-sm text-slate-800">{broker.description}</p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Details
        </h2>
        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <Detail term="ID" value={broker.id} />
          <Detail term="Type" value={broker.broker_type} />
          <Detail term="Slug" value={broker.slug} />
          <Detail term="Created" value={new Date(broker.created_at).toLocaleString()} />
          <Detail term="Logo URL" value={broker.logo_url} />
          <Detail term="Website" value={broker.website} />
        </dl>
      </section>
    </article>
  );
}

function Detail({ term, value }: { term: string; value: string | number }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-slate-500">{term}</dt>
      <dd className="break-all text-slate-800">{value}</dd>
    </div>
  );
}
