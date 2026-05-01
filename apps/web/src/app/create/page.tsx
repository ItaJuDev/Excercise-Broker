'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createBroker } from '@/lib/api';
import { BROKER_TYPES, type CreateBrokerInput } from '@/lib/types';

const EMPTY: CreateBrokerInput = {
  name: '',
  slug: '',
  description: '',
  logo_url: '',
  website: '',
  broker_type: 'cfd',
};

export default function CreateBrokerPage() {
  const router = useRouter();
  const [form, setForm] = useState<CreateBrokerInput>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof CreateBrokerInput>(key: K, value: CreateBrokerInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createBroker(form);
      router.push('/');
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
      setSubmitting(false);
    }
  }

  return (
    <div className='space-y-8'>
      <header>
        <h1 className='font-display text-5xl font-bold text-white'>Submit Broker</h1>
        <p className='mt-3 max-w-xl text-sm text-muted'>
          Register a new institutional entity within the Sterling Midnight ecosystem.
          Please ensure all data points align with regulatory documentation.
        </p>
      </header>

      <form onSubmit={onSubmit} className='panel space-y-6 p-8'>
        <div className='grid gap-6 sm:grid-cols-2'>
          <Field label='Broker Name'>
            <input
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              required
              className={inputCls}
              placeholder='e.g. Sterling Capital Markets'
            />
          </Field>
          <Field label='Slug'>
            <input
              value={form.slug}
              onChange={(e) => update('slug', e.target.value)}
              required
              pattern='^[a-z0-9]+(?:-[a-z0-9]+)*$'
              className={inputCls}
              placeholder='sterling-capital-markets'
            />
          </Field>
        </div>

        <Field label='Broker Type'>
          <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
            {BROKER_TYPES.map((t) => {
              const active = form.broker_type === t;
              return (
                <button
                  key={t}
                  type='button'
                  onClick={() => update('broker_type', t)}
                  className={`rounded-lg px-4 py-3 text-sm font-semibold uppercase tracking-wider transition ${
                    active
                      ? 'bg-accent text-white shadow-glow'
                      : 'border border-white/10 bg-ink-800/60 text-muted hover:text-white'
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </Field>

        <div className='grid gap-6 sm:grid-cols-2'>
          <Field label='Logo URL'>
            <InputWithIcon
              icon={
                <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                  <rect x='3' y='3' width='18' height='18' rx='2' />
                  <circle cx='9' cy='9' r='2' />
                  <path d='m21 15-5-5L5 21' />
                </svg>
              }
            >
              <input
                type='url'
                value={form.logo_url}
                onChange={(e) => update('logo_url', e.target.value)}
                required
                className={inputCls + ' pl-9'}
                placeholder='https://assets.sterling.com/logo.png'
              />
            </InputWithIcon>
          </Field>
          <Field label='Website'>
            <InputWithIcon
              icon={
                <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                  <circle cx='12' cy='12' r='10' />
                  <path d='M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20' />
                </svg>
              }
            >
              <input
                type='url'
                value={form.website}
                onChange={(e) => update('website', e.target.value)}
                required
                className={inputCls + ' pl-9'}
                placeholder='https://sterlingmidnight.com'
              />
            </InputWithIcon>
          </Field>
        </div>

        <Field label='Broker Description'>
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            required
            rows={5}
            className={inputCls}
            placeholder='Provide a comprehensive institutional overview...'
          />
        </Field>

        {error && (
          <div className='rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200'>
            {error}
          </div>
        )}

        <div className='flex items-center justify-end gap-4 pt-2'>
          <button
            type='button'
            onClick={() => router.push('/')}
            className='text-sm font-semibold text-muted transition hover:text-white'
          >
            Discard Draft
          </button>
          <button
            type='submit'
            disabled={submitting}
            className='rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-50'
          >
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );
}

const inputCls =
  'w-full rounded-lg border border-white/10 bg-ink-900/60 px-4 py-2.5 text-sm text-white placeholder:text-muted/60 focus:border-accent focus:outline-none';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className='block'>
      <span className='eyebrow mb-2 block'>{label}</span>
      {children}
    </label>
  );
}

function InputWithIcon({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className='relative'>
      <span className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted'>{icon}</span>
      {children}
    </div>
  );
}
