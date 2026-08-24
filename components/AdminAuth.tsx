'use client';
import { useState } from 'react';

export default function AdminAuth({ children }: { children: React.ReactNode }) {
  const [isAuthed, setIsAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const checkAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/proxy/auth/simple-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('admin_authenticated', 'true');
        setIsAuthed(true);
      } else {
        setError('Wrong password');
      }
    } catch {
      setError('Connection failed');
    }
  };

  if (isAuthed) return <>{children}</>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Admin Access</h2>
      <form onSubmit={checkAuth} className="space-y-4">
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter admin password"
          className="w-full border p-2 rounded"
          required
        />
        {error && <p className="text-red-600">{error}</p>}
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
