'use client';
import { useState } from 'react';
import { fetchAPI } from '@/lib/api';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await fetchAPI('/contact', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Contact</h1>
      <p className="mt-2">Have a question? Drop me a line.</p>

      {status === 'sent' && (
        <p className="mt-4 text-green-600">Thanks! Your message has been sent.</p>
      )}
      {status === 'error' && (
        <p className="mt-4 text-red-600">Failed to send. Please try again later.</p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          placeholder="Message"
          value={form.message}
          onChange={e => setForm({ ...form, message: e.target.value })}
          className="w-full border p-2 rounded"
          rows={4}
          required
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="bg-primary text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {status === 'sending' ? 'Sending...' : 'Send'}
        </button>
      </form>
    </main>
  );
}
