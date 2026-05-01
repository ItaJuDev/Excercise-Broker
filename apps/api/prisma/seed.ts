import { PrismaClient, BrokerType } from '@prisma/client';

const prisma = new PrismaClient();

const brokers = [
  {
    name: 'Exness',
    slug: 'exness-broker',
    description:
      'Exness is a multi-asset broker offering CFDs on forex, metals, crypto, stocks and indices with tight spreads and instant withdrawals.',
    logo_url: 'https://placehold.co/200x200?text=Exness',
    website: 'https://www.exness.com',
    broker_type: BrokerType.cfd,
  },
  {
    name: 'Interactive Brokers',
    slug: 'interactive-brokers',
    description:
      'Interactive Brokers gives traders direct market access to stocks, options, futures, forex, bonds and funds across 150+ markets.',
    logo_url: 'https://placehold.co/200x200?text=IBKR',
    website: 'https://www.interactivebrokers.com',
    broker_type: BrokerType.stock,
  },
  {
    name: 'Binance',
    slug: 'binance',
    description:
      'Binance is the world\'s largest cryptocurrency exchange by trading volume, offering hundreds of digital assets.',
    logo_url: 'https://placehold.co/200x200?text=Binance',
    website: 'https://www.binance.com',
    broker_type: BrokerType.crypto,
  },
  {
    name: 'TreasuryDirect',
    slug: 'treasury-direct',
    description:
      'TreasuryDirect lets individual investors buy U.S. government bonds, notes, and bills directly from the Treasury.',
    logo_url: 'https://placehold.co/200x200?text=TreasuryDirect',
    website: 'https://www.treasurydirect.gov',
    broker_type: BrokerType.bond,
  },
  {
    name: 'IG Group',
    slug: 'ig-group',
    description:
      'IG is a global leader in online trading, offering CFDs across forex, indices, shares, commodities and cryptocurrencies.',
    logo_url: 'https://placehold.co/200x200?text=IG',
    website: 'https://www.ig.com',
    broker_type: BrokerType.cfd,
  },
];

async function main() {
  for (const data of brokers) {
    await prisma.broker.upsert({
      where: { slug: data.slug },
      update: {},
      create: data,
    });
  }
  console.log(`Seeded ${brokers.length} brokers.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
