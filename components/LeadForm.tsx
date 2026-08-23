'use client';
import { useState } from 'react';

export default function LeadForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setSubmitted(true);
    } catch (error) {
      alert('Error submitting form');
    }
  };

  if (submitted) {
    return <div className="text-green-600 font-semibold">Thanks! I'll be in touch.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Name *</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          className="w-full border p-2 rounded mt-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Email *</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          className="w-full border p-2 rounded mt-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Company</label>
        <input
          type="text"
          value={formData.company}
          onChange={e => setFormData({ ...formData, company: e.target.value })}
          className="w-full border p-2 rounded mt-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Phone</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={e => setFormData({ ...formData, phone: e.target.value })}
          className="w-full border p-2 rounded mt-1"
        />
      </div>
      <button type="submit" className="bg-primary text-white px-6 py-2 rounded">Get Leads</button>
    </form>
  );
}
