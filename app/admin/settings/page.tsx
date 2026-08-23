'use client';
import { useState, useEffect } from 'react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({ siteName: '', adsenseId: '', analyticsId: '' });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings`)
      .then(res => res.json())
      .then(setSettings);
  }, []);

  const handleSave = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    alert('Saved!');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Settings</h1>
      <div className="mt-6 space-y-4">
        <div>
          <label className="block">Site Name</label>
          <input
            type="text"
            value={settings.siteName}
            onChange={e => setSettings({ ...settings, siteName: e.target.value })}
            className="w-full border p-2 rounded mt-1"
          />
        </div>
        <div>
          <label className="block">AdSense ID</label>
          <input
            type="text"
            value={settings.adsenseId}
            onChange={e => setSettings({ ...settings, adsenseId: e.target.value })}
            className="w-full border p-2 rounded mt-1"
          />
        </div>
        <div>
          <label className="block">Google Analytics ID</label>
          <input
            type="text"
            value={settings.analyticsId}
            onChange={e => setSettings({ ...settings, analyticsId: e.target.value })}
            className="w-full border p-2 rounded mt-1"
          />
        </div>
        <button onClick={handleSave} className="bg-primary text-white px-6 py-2 rounded">Save</button>
      </div>
    </div>
  );
}
