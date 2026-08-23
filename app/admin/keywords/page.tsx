'use client';
import { useState, useEffect } from 'react';

export default function AdminKeywords() {
  const [keywords, setKeywords] = useState([]);
  const [csv, setCsv] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/keywords`)
      .then(res => res.json())
      .then(data => { setKeywords(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleImport = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/keywords/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ csv })
    });
    alert('Imported!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Keywords</h1>
      <div className="mt-6 flex gap-4">
        <textarea
          value={csv}
          onChange={e => setCsv(e.target.value)}
          placeholder="Paste CSV"
          rows={3}
          className="flex-1 border p-2 rounded"
        />
        <button onClick={handleImport} className="bg-primary text-white px-4 py-2 rounded">Import</button>
      </div>
      <table className="w-full mt-6 border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Keyword</th>
            <th className="p-2">Volume</th>
            <th className="p-2">KD</th>
            <th className="p-2">CPC</th>
            <th className="p-2">Intent</th>
          </tr>
        </thead>
        <tbody>
          {keywords.map((kw: any) => (
            <tr key={kw.id} className="border-b">
              <td className="p-2">{kw.keyword}</td>
              <td className="p-2">{kw.volume}</td>
              <td className="p-2">{kw.kd}</td>
              <td className="p-2">${kw.cpc}</td>
              <td className="p-2">{kw.intent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
