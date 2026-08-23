'use client';
import { useState } from 'react';

export default function AIWriter() {
  const [keyword, setKeyword] = useState('');
  const [report, setReport] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, report })
      });
      const data = await res.json();
      setContent(data.content);
    } catch (error) {
      alert('Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">AI Writer</h1>
      <div className="mt-6 space-y-4">
        <input
          type="text"
          placeholder="Keyword (e.g., brake pads Toronto)"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <textarea
          placeholder="Paste your USER REPORT here"
          value={report}
          onChange={e => setReport(e.target.value)}
          rows={6}
          className="w-full border p-2 rounded"
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-primary text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Article'}
        </button>
        {content && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Generated Content</h2>
            <textarea value={content} readOnly rows={20} className="w-full border p-2 rounded mt-2" />
          </div>
        )}
      </div>
    </div>
  );
}
