'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewPostPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    slug: '',
    title: '',
    excerpt: '',
    metaTitle: '',
    metaDesc: '',
    featuredImage: '',
    category: '',
    tags: '',
    status: 'draft',
    content: '',
    author: 'Mike Johnson',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        publishedAt: form.status === 'published' ? new Date().toISOString() : null,
      };
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create post');
      }
      router.push('/admin/posts');
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Add New Post</h1>
      {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Slug *</label>
            <input
              type="text"
              name="slug"
              required
              value={form.slug}
              onChange={handleChange}
              className="mt-1 w-full border p-2 rounded"
              placeholder="rockauto-canada-shipping-guide"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="mt-1 w-full border p-2 rounded">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Title *</label>
          <input
            type="text"
            name="title"
            required
            value={form.title}
            onChange={handleChange}
            className="mt-1 w-full border p-2 rounded"
            placeholder="RockAuto Canada Shipping Guide 2026..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Excerpt *</label>
          <textarea
            name="excerpt"
            required
            value={form.excerpt}
            onChange={handleChange}
            rows={2}
            className="mt-1 w-full border p-2 rounded"
            placeholder="Brief summary..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Meta Title</label>
            <input
              type="text"
              name="metaTitle"
              value={form.metaTitle}
              onChange={handleChange}
              className="mt-1 w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Meta Description</label>
            <input
              type="text"
              name="metaDesc"
              value={form.metaDesc}
              onChange={handleChange}
              className="mt-1 w-full border p-2 rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Category *</label>
            <input
              type="text"
              name="category"
              required
              value={form.category}
              onChange={handleChange}
              className="mt-1 w-full border p-2 rounded"
              placeholder="Parts Buying"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              className="mt-1 w-full border p-2 rounded"
              placeholder="rockauto, canada shipping, duties"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Featured Image URL (optional)</label>
          <input
            type="text"
            name="featuredImage"
            value={form.featuredImage}
            onChange={handleChange}
            className="mt-1 w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Content (HTML or plain text) *</label>
          <textarea
            name="content"
            required
            value={form.content}
            onChange={handleChange}
            rows={20}
            className="mt-1 w-full border p-2 rounded font-mono text-sm"
            placeholder="Paste your full article here..."
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-primary text-white px-6 py-2 rounded disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Post'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/posts')}
            className="border px-6 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
