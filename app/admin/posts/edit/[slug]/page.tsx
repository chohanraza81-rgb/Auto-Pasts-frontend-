'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { fetchAPI } from '@/lib/api';
import { Bold, Italic, Heading2, Image as ImageIcon, List, Link as LinkIcon, Save, X, Eye } from 'lucide-react';
import { autoFormatContent } from '@/lib/formatContent';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [form, setForm] = useState({
    id: '',
    slug: '',
    title: '',
    excerpt: '',
    metaTitle: '',
    metaDesc: '',
    featuredImage: '',
    featuredImageAlt: '',
    middleImage: '',
    middleImageAlt: '',
    finalImage: '',
    finalImageAlt: '',
    category: '',
    tags: '',
    status: 'draft',
    content: '',
    author: 'Mike Johnson',
    schemaJson: '',
  });
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageTitle, setImageTitle] = useState('');
  const [imageWidth, setImageWidth] = useState('');
  const [imageHeight, setImageHeight] = useState('');
  const [loading, setLoading] = useState(true);
  const [autoFormatMsg, setAutoFormatMsg] = useState('');

  useEffect(() => {
    const loadPostAndCategories = async () => {
      if (!slug) {
        setError('No slug provided');
        setLoading(false);
        return;
      }
      try {
        const [post, cats] = await Promise.all([
          fetchAPI(`/posts/${encodeURIComponent(slug)}`),
          fetchAPI('/categories'),
        ]);
        setForm({
          id: post.id,
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          metaTitle: post.metaTitle,
          metaDesc: post.metaDesc,
          featuredImage: post.featuredImage || '',
          featuredImageAlt: post.featuredImageAlt || '',
          middleImage: post.middleImage || '',
          middleImageAlt: post.middleImageAlt || '',
          finalImage: post.finalImage || '',
          finalImageAlt: post.finalImageAlt || '',
          category: post.category,
          tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
          status: post.status,
          content: post.content,
          author: post.author || 'Mike Johnson',
          schemaJson: post.schemaJson || '',
        });
        setCategories(cats);
      } catch (err) {
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    loadPostAndCategories();
  }, [slug]);

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

  const insertTag = (tag: string, placeholder: string = '') => {
    const textarea = contentRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = form.content.substring(start, end) || placeholder;
    const newContent = form.content.substring(0, start) + tag + selected + form.content.substring(end);
    setForm({ ...form, content: newContent });
    textarea.focus();
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
    insertTag(imgTag, '');
    setImageUrl('');
    setImageAlt('');
    setImageTitle('');
    setImageWidth('');
    setImageHeight('');
  };

  const insertLink = () => {
    const url = prompt('Enter URL (e.g., https://partsavatar.ca)');
    const text = prompt('Link text', 'Buy Here');
    if (url && text) {
      const linkTag = `<a href="${url}" target="_blank" rel="nofollow">${text}</a>`;
      insertTag(linkTag, '');
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
          <head><title>${form.title}</title></head>
          <body>
            <h1>${form.title}</h1>
            <p><em>By ${form.author}</em></p>
            <div>${form.content}</div>
          </body>
        </html>
      `);
      previewWindow.document.close();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.slug || !form.title || !form.excerpt || !form.metaTitle || !form.metaDesc || !form.category || !form.content) {
      setError('Please fill all required fields: Slug, Title, Excerpt, Meta Title, Meta Description, Category, Content');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const formattedContent = autoFormatContent(form.content);
      const payload = {
        ...form,
        content: formattedContent,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        publishedAt: form.status === 'published' ? new Date().toISOString() : null,
        schemaJson: form.schemaJson || null,
      };
      await fetchAPI(`/posts/${form.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      router.push('/admin/posts');
    } catch (err: any) {
      setError(err.message || 'Failed to save');
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Edit Post</h1>
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
            <input type="text" name="slug" required value={form.slug} onChange={handleChange} className="w-full border p-2 rounded" />
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

        {/* Editor */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b bg-gray-50 flex-wrap">
            <button type="button" onClick={() => insertTag('<strong>', 'bold text')} className="p-1 hover:bg-gray-200 rounded"><Bold size={16} /></button>
            <button type="button" onClick={() => insertTag('<em>', 'italic text')} className="p-1 hover:bg-gray-200 rounded"><Italic size={16} /></button>
            <button type="button" onClick={() => insertTag('<h2>', 'Heading')} className="p-1 hover:bg-gray-200 rounded"><Heading2 size={16} /></button>
            <button type="button" onClick={() => insertTag('<ul><li>', 'List item')} className="p-1 hover:bg-gray-200 rounded"><List size={16} /></button>
            <button type="button" onClick={insertImageToContent} className="p-1 hover:bg-gray-200 rounded"><ImageIcon size={16} /></button>
            <button type="button" onClick={insertLink} className="p-1 hover:bg-gray-200 rounded"><LinkIcon size={16} /></button>
          </div>
          <textarea ref={contentRef} name="content" required value={form.content} onChange={handleChange} onPaste={handlePaste} rows={20} className="w-full p-4 font-mono text-sm outline-none resize-y" placeholder="Write your article..." />
        </div>

        {/* Image insertion */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-2">Insert Image</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input type="text" placeholder="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="border p-2 rounded" />
            <input type="text" placeholder="Alt Text (SEO)" value={imageAlt} onChange={e => setImageAlt(e.target.value)} className="border p-2 rounded" />
            <input type="text" placeholder="Title (optional)" value={imageTitle} onChange={e => setImageTitle(e.target.value)} className="border p-2 rounded" />
            <div className="flex gap-2">
              <input type="text" placeholder="Width" value={imageWidth} onChange={e => setImageWidth(e.target.value)} className="border p-2 rounded w-full" />
              <input type="text" placeholder="Height" value={imageHeight} onChange={e => setImageHeight(e.target.value)} className="border p-2 rounded w-full" />
            </div>
          </div>
        </div>

        {/* Post Images */}
        <div className="bg-white p-4 rounded-lg shadow-sm space-y-3">
          <h3 className="font-semibold">Post Images (SEO Optimized)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Main Image URL</label>
              <input type="text" name="featuredImage" value={form.featuredImage} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium">Main Image Alt Text</label>
              <input type="text" name="featuredImageAlt" value={form.featuredImageAlt} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium">Middle Image URL</label>
              <input type="text" name="middleImage" value={form.middleImage} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium">Middle Image Alt Text</label>
              <input type="text" name="middleImageAlt" value={form.middleImageAlt} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium">Final Image URL</label>
              <input type="text" name="finalImage" value={form.finalImage} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium">Final Image Alt Text</label>
              <input type="text" name="finalImageAlt" value={form.finalImageAlt} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
          </div>
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
            <Save size={16} /> {saving ? 'Saving...' : 'Update Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
