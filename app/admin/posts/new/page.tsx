'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAPI } from '@/lib/api';
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Quote, Save, X, Eye } from 'lucide-react';
import { autoFormatContent } from '@/lib/formatContent';

const initialForm = {
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
};

export default function NewPostPage() {
  const router = useRouter();
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [autoFormatMsg, setAutoFormatMsg] = useState('');

  useEffect(() => {
    fetchAPI('/categories')
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text/plain');
    const formatted = autoFormatContent(pastedText);
    const textarea = contentRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = form.content.substring(0, start) + formatted + form.content.substring(end);
      setForm({ ...form, content: newContent });
      setAutoFormatMsg('Auto-formatted! Check the content.');
      setTimeout(() => setAutoFormatMsg(''), 3000);
    }
  };

  const insertImageToContent = () => {
    if (!imageUrl) {
      alert('Please enter an image URL');
      return;
    }
    const alt = imageAlt || 'auto parts image';
    const imgTag = `<img src="${imageUrl}" alt="${alt}" loading="lazy" />`;
    const textarea = contentRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = form.content.substring(0, start) + imgTag + form.content.substring(end);
      setForm({ ...form, content: newContent });
      setImageUrl('');
      setImageAlt('');
      textarea.focus();
    }
  };

  const insertLink = () => {
    const url = prompt('Enter URL (e.g., https://partsavatar.ca)');
    const text = prompt('Link text', 'Buy Here');
    if (url && text) {
      const linkTag = `<a href="${url}" target="_blank" rel="nofollow">${text}</a>`;
      const textarea = contentRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newContent = form.content.substring(0, start) + linkTag + form.content.substring(end);
        setForm({ ...form, content: newContent });
        textarea.focus();
      }
    }
  };

  const openPreview = () => {
    if (!form.slug || !form.title || !form.content) {
      alert('Slug, Title, and Content are required for preview.');
      return;
    }
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(`
        <html>
          <head><title>${form.title}</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            img { max-width: 100%; height: auto; border-radius: 8px; margin: 1rem 0; }
            h2 { font-size: 1.8em; margin-top: 2rem; }
            h3 { font-size: 1.4em; margin-top: 1.5rem; }
            p { line-height: 1.7; }
            ul, ol { padding-left: 1.5rem; }
          </style>
          </head>
          <body>
            <h1>${form.title}</h1>
            <p><em>By ${form.author}</em></p>
            ${form.content}
          </body>
        </html>
      `);
      previewWindow.document.close();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.slug || !form.title || !form.excerpt || !form.metaTitle || !form.metaDesc || !form.category || !form.content) {
      setError('Please fill all required fields');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        content: form.content, // already HTML from paste/auto-format
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        publishedAt: form.status === 'published' ? new Date().toISOString() : null,
        schemaJson: form.schemaJson || null,
      };
      await fetchAPI('/posts', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setForm(initialForm);
      router.push('/admin/posts');
    } catch (err: any) {
      setError(err.message || 'Failed to save');
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Add New Post</h1>
        <div className="flex gap-2">
          <button type="button" onClick={openPreview} className="text-gray-600 hover:text-gray-800 flex items-center gap-1">
            <Eye size={18} /> Preview
          </button>
          <button onClick={() => router.push('/admin/posts')} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      {autoFormatMsg && <div className="bg-green-100 text-green-700 p-2 rounded mb-2">{autoFormatMsg}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Slug and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <label className="block text-sm font-medium mb-1">Slug *</label>
            <input type="text" name="slug" required value={form.slug} onChange={handleChange} className="w-full border p-2 rounded" placeholder="rockauto-canada-shipping-guide" />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <label className="block text-sm font-medium mb-1">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="w-full border p-2 rounded">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        {/* Title */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <input type="text" name="title" required value={form.title} onChange={handleChange} className="w-full text-2xl font-bold border-0 focus:ring-0 outline-none" placeholder="Post Title" />
        </div>

        {/* Textarea with toolbar */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b bg-gray-50 flex-wrap">
            <button type="button" onClick={() => insertTag('<strong>', 'bold text')} className="p-1 hover:bg-gray-200 rounded"><Bold size={16} /></button>
            <button type="button" onClick={() => insertTag('<em>', 'italic text')} className="p-1 hover:bg-gray-200 rounded"><Italic size={16} /></button>
            <button type="button" onClick={() => insertTag('<h2>', 'Heading')} className="p-1 hover:bg-gray-200 rounded"><Heading2 size={16} /></button>
            <button type="button" onClick={() => insertTag('<h3>', 'Subheading')} className="p-1 hover:bg-gray-200 rounded"><Heading3 size={16} /></button>
            <button type="button" onClick={() => insertTag('<ul><li>', 'List item')} className="p-1 hover:bg-gray-200 rounded"><List size={16} /></button>
            <button type="button" onClick={() => insertTag('<ol><li>', 'Numbered item')} className="p-1 hover:bg-gray-200 rounded"><ListOrdered size={16} /></button>
            <button type="button" onClick={insertLink} className="p-1 hover:bg-gray-200 rounded"><LinkIcon size={16} /></button>
            <button type="button" onClick={insertImageToContent} className="p-1 hover:bg-gray-200 rounded"><ImageIcon size={16} /></button>
          </div>

          {/* Image URL inputs */}
          <div className="flex flex-wrap gap-2 px-3 py-2 bg-gray-50 border-b">
            <input type="text" placeholder="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="border p-2 rounded flex-1 min-w-[200px]" />
            <input type="text" placeholder="Alt Text" value={imageAlt} onChange={e => setImageAlt(e.target.value)} className="border p-2 rounded flex-1 min-w-[200px]" />
            <button type="button" onClick={insertImageToContent} className="bg-primary text-white px-4 py-2 rounded">Insert Image</button>
          </div>

          <textarea
            ref={contentRef}
            name="content"
            required
            value={form.content}
            onChange={handleChange}
            onPaste={handlePaste}
            rows={25}
            className="w-full p-4 font-mono text-sm outline-none resize-y"
            placeholder="Paste your plain text article here. It will auto-format to HTML. Use the toolbar for formatting and image insertion."
          />
        </div>

        {/* Details */}
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

        {/* SEO */}
        <div className="bg-white p-4 rounded-lg shadow-sm space-y-3">
          <label className="block text-sm font-medium">Excerpt *</label>
          <textarea name="excerpt" required value={form.excerpt} onChange={handleChange} rows={2} className="w-full border p-2 rounded" />
          <label className="block text-sm font-medium">Meta Title *</label>
          <input type="text" name="metaTitle" required value={form.metaTitle} onChange={handleChange} className="w-full border p-2 rounded" />
          <label className="block text-sm font-medium">Meta Description *</label>
          <input type="text" name="metaDesc" required value={form.metaDesc} onChange={handleChange} className="w-full border p-2 rounded" />
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
