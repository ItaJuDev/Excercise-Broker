import type { Broker, BrokerType, CreateBrokerInput } from './types';

function apiBase(): string {
  if (typeof window === 'undefined') {
    return process.env.API_URL_INTERNAL ?? 'http://localhost:3001/api';
  }
  return '/api';
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      if (body?.message) {
        message = Array.isArray(body.message) ? body.message.join(', ') : body.message;
      }
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export interface BrokerListParams {
  search?: string;
  type?: BrokerType | '';
}

export async function getBrokers(params: BrokerListParams = {}): Promise<Broker[]> {
  const qs = new URLSearchParams();
  if (params.search) qs.set('search', params.search);
  if (params.type) qs.set('type', params.type);
  const url = `${apiBase()}/brokers${qs.toString() ? `?${qs.toString()}` : ''}`;
  const res = await fetch(url, { cache: 'no-store' });
  return handle<Broker[]>(res);
}

export async function getBroker(slug: string): Promise<Broker | null> {
  const res = await fetch(`${apiBase()}/brokers/${encodeURIComponent(slug)}`, {
    cache: 'no-store',
  });
  if (res.status === 404) return null;
  return handle<Broker>(res);
}

export async function createBroker(input: CreateBrokerInput): Promise<Broker> {
  const res = await fetch(`${apiBase()}/brokers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return handle<Broker>(res);
}
