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
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Add a broker</h1>
        <p className="text-sm text-slate-600">
          Fill in the broker details. All fields are required.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
        <Field label="Name" required>
          <input
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            required
            className={inputCls}
            placeholder="Exness"
          />
        </Field>

        <Field label="Slug" required hint="lowercase letters, digits and hyphens">
          <input
            value={form.slug}
            onChange={(e) => update('slug', e.target.value)}
            required
            pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
            className={inputCls}
            placeholder="exness-broker"
          />
        </Field>

        <Field label="Description" required>
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            required
            rows={3}
            className={inputCls}
            placeholder="A short description of the broker..."
          />
        </Field>

        <Field label="Logo URL" required>
          <input
            type="url"
            value={form.logo_url}
            onChange={(e) => update('logo_url', e.target.value)}
            required
            className={inputCls}
            placeholder="https://example.com/logo.png"
          />
        </Field>

        <Field label="Website" required>
          <input
            type="url"
            value={form.website}
            onChange={(e) => update('website', e.target.value)}
            required
            className={inputCls}
            placeholder="https://example.com"
          />
        </Field>

        <Field label="Broker type" required>
          <select
            value={form.broker_type}
            onChange={(e) => update('broker_type', e.target.value as CreateBrokerInput['broker_type'])}
            className={inputCls}
          >
            {BROKER_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.toUpperCase()}
              </option>
            ))}
          </select>
        </Field>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}

const inputCls =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none';

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}
