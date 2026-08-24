'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { fetchAPI } from '@/lib/api';
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Quote, Save, X, Eye } from 'lucide-react';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const [form, setForm] = useState({
    id: '',
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
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [loading, setLoading] = useState(true);

  const editor = useEditor({
    extensions: [StarterKit, Image, Link.configure({ openOnClick: false })],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] px-4 py-3',
      },
    },
  });

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) { setError('No slug'); setLoading(false); return; }
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
          category: post.category,
          tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
          status: post.status,
          content: post.content,
          author: post.author || 'Mike Johnson',
          schemaJson: post.schemaJson || '',
        });
        setCategories(cats);
        if (editor) {
          editor.commands.setContent(post.content || '');
        }
      } catch (err) {
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [slug, editor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const insertImage = () => {
    if (!imageUrl) { alert('Please enter an image URL'); return; }
    const alt = imageAlt || 'image';
    editor?.chain().focus().setImage({ src: imageUrl, alt }).run();
    setImageUrl('');
    setImageAlt('');
  };

  const setLink = () => {
    const url = prompt('Enter URL');
    if (url) {
      editor?.chain().focus().setLink({ href: url, target: '_blank', rel: 'nofollow' }).run();
    }
  };

  const openPreview = () => {
    if (!form.slug || !form.title || !editor?.getHTML()) { alert('Content required'); return; }
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
            ${editor.getHTML()}
          </body>
        </html>
      `);
      previewWindow.document.close();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const contentHtml = editor?.getHTML() || '';
    if (!form.slug || !form.title || !form.excerpt || !form.metaTitle || !form.metaDesc || !form.category || !contentHtml) {
      setError('Please fill all required fields');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        content: contentHtml,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        publishedAt: form.status === 'published' ? new Date().toISOString() : null,
        schemaJson: form.schemaJson || null,
      };
      await fetchAPI(`/posts/${form.id}`, { method: 'PUT', body: JSON.stringify(payload) });
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
          <button type="button" onClick={openPreview} className="text-gray-600 hover:text-gray-800 flex items-center gap-1"><Eye size={18} /> Preview</button>
          <button onClick={() => router.push('/admin/posts')} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
        </div>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

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

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <input type="text" name="title" required value={form.title} onChange={handleChange} className="w-full text-2xl font-bold border-0 focus:ring-0 outline-none" placeholder="Post Title" />
        </div>

        {/* Rich Text Editor */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b bg-gray-50 flex-wrap">
            <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className="p-1 hover:bg-gray-200 rounded"><Bold size={16} /></button>
            <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className="p-1 hover:bg-gray-200 rounded"><Italic size={16} /></button>
            <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className="p-1 hover:bg-gray-200 rounded"><Heading2 size={16} /></button>
            <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} className="p-1 hover:bg-gray-200 rounded"><Heading3 size={16} /></button>
            <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()} className="p-1 hover:bg-gray-200 rounded"><List size={16} /></button>
            <button type="button" onClick={() => editor?.chain().focus().toggleOrderedList().run()} className="p-1 hover:bg-gray-200 rounded"><ListOrdered size={16} /></button>
            <button type="button" onClick={setLink} className="p-1 hover:bg-gray-200 rounded"><LinkIcon size={16} /></button>
            <button type="button" onClick={insertImage} className="p-1 hover:bg-gray-200 rounded"><ImageIcon size={16} /></button>
            <button type="button" onClick={() => editor?.chain().focus().toggleBlockquote().run()} className="p-1 hover:bg-gray-200 rounded"><Quote size={16} /></button>
          </div>

          <div className="flex flex-wrap gap-2 px-3 py-2 bg-gray-50 border-b">
            <input type="text" placeholder="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="border p-2 rounded flex-1 min-w-[200px]" />
            <input type="text" placeholder="Alt Text" value={imageAlt} onChange={e => setImageAlt(e.target.value)} className="border p-2 rounded flex-1 min-w-[200px]" />
            <button type="button" onClick={insertImage} className="bg-primary text-white px-4 py-2 rounded">Insert Image</button>
          </div>

          <EditorContent editor={editor} />
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
            <Save size={16} /> {saving ? 'Saving...' : 'Update Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
