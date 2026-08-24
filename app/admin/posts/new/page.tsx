'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAPI } from '@/lib/api';
import { Bold, Italic, Heading2, Image, List, Save, X } from 'lucide-react';

export default function NewPostPage() {
  const router = useRouter();
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [form, setForm] = useState({...}); // same as before
  const [categories, setCategories] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  // ... other image state
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAPI('/categories')
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const insertTag = (tag: string, placeholder: string = '') => {
    const textarea = contentRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = form.content.substring(start, end) || placeholder;
    const newTag = `${tag}${selected}${tag.includes('/') ? '' : ''}`;
    const newContent = form.content.substring(0, start) + newTag + form.content.substring(end);
    setForm({ ...form, content: newContent });
    textarea.focus();
  };

  // handleSubmit uses fetchAPI as before

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Add New Post</h1>
        <button onClick={() => router.push('/admin/posts')} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <input
            type="text"
            name="title"
            required
            value={form.title}
            onChange={handleChange}
            className="w-full text-2xl font-bold border-0 focus:ring-0 outline-none"
            placeholder="Post Title"
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Editor Toolbar */}
          <div className="flex items-center gap-2 px-3 py-2 border-b bg-gray-50">
            <button type="button" onClick={() => insertTag('**', 'bold text')} className="p-1 hover:bg-gray-200 rounded"><Bold size={16} /></button>
            <button type="button" onClick={() => insertTag('*', 'italic text')} className="p-1 hover:bg-gray-200 rounded"><Italic size={16} /></button>
            <button type="button" onClick={() => insertTag('## ', 'Heading')} className="p-1 hover:bg-gray-200 rounded"><Heading2 size={16} /></button>
            <button type="button" onClick={() => insertTag('- ', 'List item')} className="p-1 hover:bg-gray-200 rounded"><List size={16} /></button>
            <button type="button" onClick={() => { /* open image modal or set state */ }} className="p-1 hover:bg-gray-200 rounded"><Image size={16} /></button>
          </div>
          <textarea
            ref={contentRef}
            name="content"
            required
            value={form.content}
            onChange={handleChange}
            rows={20}
            className="w-full p-4 font-mono text-sm outline-none resize-y"
            placeholder="Write your article..."
          />
        </div>

        {/* Image Insertion Modal */}
        {/* ... (simplified: paste URL and insert) */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-2">Insert Image</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Image URL"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              className="flex-1 border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Alt text"
              value={imageAlt}
              onChange={e => setImageAlt(e.target.value)}
              className="flex-1 border p-2 rounded"
            />
            <button type="button" onClick={insertImageToContent} className="bg-primary text-white px-4 py-2 rounded">
              Insert
            </button>
          </div>
        </div>

        {/* SEO & Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm space-y-3">
            <label className="block text-sm font-medium">Category *</label>
            <select name="category" value={form.category} onChange={handleChange} className="w-full border p-2 rounded">
              <option value="">Select Category</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
            <label className="block text-sm font-medium">Tags (comma separated)</label>
            <input type="text" name="tags" value={form.tags} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm space-y-3">
            <label className="block text-sm font-medium">Featured Image URL</label>
            <input type="text" name="featuredImage" value={form.featuredImage} onChange={handleChange} className="w-full border p-2 rounded" />
            <label className="block text-sm font-medium">Featured Image Alt Text</label>
            <input type="text" name="featuredImageAlt" value={form.featuredImageAlt} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm space-y-3">
          <label className="block text-sm font-medium">Excerpt</label>
          <textarea name="excerpt" required value={form.excerpt} onChange={handleChange} rows={2} className="w-full border p-2 rounded" />
          <label className="block text-sm font-medium">Meta Title</label>
          <input type="text" name="metaTitle" value={form.metaTitle} onChange={handleChange} className="w-full border p-2 rounded" />
          <label className="block text-sm font-medium">Meta Description</label>
          <input type="text" name="metaDesc" value={form.metaDesc} onChange={handleChange} className="w-full border p-2 rounded" />
          <label className="block text-sm font-medium">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="flex justify-end gap-3">
          <button type="submit" disabled={saving} className="bg-primary text-white px-6 py-2 rounded-lg disabled:opacity-50 flex items-center gap-2">
            <Save size={16} /> {saving ? 'Saving...' : 'Save Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
