'use client';
import { useState, useEffect } from 'react';
import { fetchAPI } from '@/lib/api';

export default function AdminAffiliates() {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    url: '',
    cloakSlug: '',
    network: '',
  });
  const [saving, setSaving] = useState(false);

  const loadAffiliates = async () => {
    setLoading(true);
    try {
      const data = await fetchAPI('/affiliates');
      setAffiliates(data);
      setError('');
    } catch (err: any) {
      setError('Failed to load affiliates: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAffiliates();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.url || !form.cloakSlug || !form.network) {
      alert('All fields are required');
      return;
    }
    setSaving(true);
    try {
      await fetchAPI('/affiliates', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setForm({ name: '', url: '', cloakSlug: '', network: '' });
      await loadAffiliates();
    } catch (err: any) {
      alert('Failed to add: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this affiliate?')) return;
    try {
      await fetchAPI(`/affiliates/${id}`, { method: 'DELETE' });
      await loadAffiliates();
    } catch (err: any) {
      alert('Failed to delete: ' + err.message);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Affiliates</h1>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h2 className="font-semibold mb-3">Add New Affiliate</h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="text"
            name="name"
            placeholder="Name (e.g., PartsAvatar)"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="url"
            placeholder="Destination URL"
            value={form.url}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="cloakSlug"
            placeholder="Cloak Slug (e.g., partsavatar)"
            value={form.cloakSlug}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="network"
            placeholder="Network (e.g., Amazon)"
            value={form.network}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <button
            type="submit"
            disabled={saving}
            className="bg-primary text-white px-4 py-2 rounded md:col-span-4 disabled:opacity-50"
          >
            {saving ? 'Adding...' : 'Add Affiliate'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Cloak Slug</th>
              <th className="p-2 text-left">Clicks</th>
              <th className="p-2 text-left">Revenue</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {affiliates.map((aff: any) => (
              <tr key={aff.id} className="border-b">
                <td className="p-2">{aff.name}</td>
                <td className="p-2">{aff.cloakSlug}</td>
                <td className="p-2">{aff.clicks}</td>
                <td className="p-2">${aff.revenue.toFixed(2)}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(aff.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {affiliates.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No affiliates yet. Add your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
