'use client';
import { useState, useEffect } from 'react';
import { fetchAPI } from '@/lib/api';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');

  const loadCategories = async () => {
    try {
      const data = await fetchAPI('/categories');
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories');
    }
  };

  useEffect(() => { loadCategories(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;
    try {
      await fetchAPI('/categories', {
        method: 'POST',
        body: JSON.stringify({ name, slug }),
      });
      setName('');
      setSlug('');
      loadCategories();
    } catch (err) {
      setError('Failed to create category');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <form onSubmit={handleCreate} className="flex gap-3">
          <input
            type="text"
            placeholder="Category Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="flex-1 border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Slug (e.g., brake-parts)"
            value={slug}
            onChange={e => setSlug(e.target.value)}
            className="flex-1 border p-2 rounded"
          />
          <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Add</button>
        </form>
      </div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Slug</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat: any) => (
              <tr key={cat.id} className="border-b">
                <td className="p-2">{cat.name}</td>
                <td className="p-2">{cat.slug}</td>
                <td className="p-2">
                  <button className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
