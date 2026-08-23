'use client';
import { useState, useEffect } from 'react';

export default function AdminAffiliates() {
  const [affiliates, setAffiliates] = useState([]);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [cloakSlug, setCloakSlug] = useState('');
  const [network, setNetwork] = useState('');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/affiliates`)
      .then(res => res.json())
      .then(setAffiliates);
  }, []);

  const handleAdd = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/affiliates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, url, cloakSlug, network })
    });
    // refresh list
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/affiliates`).then(r => r.json()).then(setAffiliates);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Affiliates</h1>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="border p-2 rounded" />
        <input placeholder="URL" value={url} onChange={e => setUrl(e.target.value)} className="border p-2 rounded" />
        <input placeholder="Cloak Slug" value={cloakSlug} onChange={e => setCloakSlug(e.target.value)} className="border p-2 rounded" />
        <input placeholder="Network" value={network} onChange={e => setNetwork(e.target.value)} className="border p-2 rounded" />
      </div>
      <button onClick={handleAdd} className="mt-4 bg-primary text-white px-4 py-2 rounded">Add Affiliate</button>
      <table className="w-full mt-6 border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Name</th>
            <th className="p-2">Cloak Slug</th>
            <th className="p-2">Clicks</th>
            <th className="p-2">Revenue</th>
          </tr>
        </thead>
        <tbody>
          {affiliates.map((aff: any) => (
            <tr key={aff.id} className="border-b">
              <td className="p-2">{aff.name}</td>
              <td className="p-2">{aff.cloakSlug}</td>
              <td className="p-2">{aff.clicks}</td>
              <td className="p-2">${aff.revenue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
