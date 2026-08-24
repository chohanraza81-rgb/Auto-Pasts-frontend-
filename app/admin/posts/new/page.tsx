'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function NewPostPage() {
  const router = useRouter();
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [form, setForm] = useState({
    slug: '',
    title: '',
    excerpt: '',
    metaTitle: '',
    metaDesc: '',
    featuredImage: '',
    featuredImageAlt: '',
    category: '',
    tags: '',
    status: 'draft',
    content: '',
    author: 'Mike Johnson',
    schemaJson: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageTitle, setImageTitle] = useState('');
  const [imageWidth, setImageWidth] = useState('');
  const [imageHeight, setImageHeight] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const insertImageToContent = () => {
    if (!imageUrl) {
      alert('Please enter an image URL');
      return;
    }
    const alt = imageAlt || 'auto parts image';
    const title = imageTitle || alt;
    const widthAttr = imageWidth ? ` width="${imageWidth}"` : '';
    const heightAttr = imageHeight ? ` height="${imageHeight}"` : '';
    const imgTag = `<img src="${imageUrl}" alt="${alt}" title="${title}" loading="lazy"${widthAttr}${heightAttr} />`;
    
    const textarea = contentRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = form.content.substring(0, start) + imgTag + form.content.substring(end);
      setForm({ ...form, content: newContent });
      // Clear image fields
      setImageUrl('');
      setImageAlt('');
      setImageTitle('');
      setImageWidth('');
      setImageHeight('');
      // Focus back to textarea after state update
      setTimeout(() => textarea.focus(), 0);
    }
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
        schemaJson: form.schemaJson || null,
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
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Featured Image URL</label>
            <input
              type="text"
              name="featuredImage"
              value={form.featuredImage}
              onChange={handleChange}
              className="mt-1 w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Featured Image Alt Text</label>
            <input
              type="text"
              name="featuredImageAlt"
              value={form.featuredImageAlt}
              onChange={handleChange}
              className="mt-1 w-full border p-2 rounded"
              placeholder="Describe image for SEO"
            />
          </div>
        </div>

        {/* Image Insertion Tool */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="font-semibold mb-3">Insert Image into Content</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Image URL"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Alt Text (SEO)"
              value={imageAlt}
              onChange={e => setImageAlt(e.target.value)}
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Title (optional)"
              value={imageTitle}
              onChange={e => setImageTitle(e.target.value)}
              className="w-full border p-2 rounded"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Width (e.g., 600)"
                value={imageWidth}
                onChange={e => setImageWidth(e.target.value)}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Height"
                value={imageHeight}
                onChange={e => setImageHeight(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={insertImageToContent}
            className="mt-3 bg-primary text-white px-4 py-2 rounded"
          >
            Insert Image
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Image will be inserted at cursor position in the content area below.
          </p>
        </div>

        {/* Large Content Area */}
        <div>
          <label className="block text-sm font-medium">Content (HTML or plain text) *</label>
          <textarea
            ref={contentRef}
            name="content"
            required
            value={form.content}
            onChange={handleChange}
            rows={30}
            className="mt-1 w-full border p-4 rounded font-mono text-sm"
            placeholder="Paste your full article here... Use the image tool above to add images with alt text."
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Schema JSON (optional)</label>
          <textarea
            name="schemaJson"
            value={form.schemaJson}
            onChange={handleChange}
            rows={4}
            className="mt-1 w-full border p-2 rounded font-mono text-sm"
            placeholder='{"@type": "FAQPage", ...}'
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
