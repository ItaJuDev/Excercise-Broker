export const BROKER_TYPES = ['cfd', 'bond', 'stock', 'crypto'] as const;
export type BrokerType = (typeof BROKER_TYPES)[number];

export interface Broker {
  id: number;
  name: string;
  slug: string;
  description: string;
  logo_url: string;
  website: string;
  broker_type: BrokerType;
  created_at: string;
}

export interface CreateBrokerInput {
  name: string;
  slug: string;
  description: string;
  logo_url: string;
  website: string;
  broker_type: BrokerType;
}
