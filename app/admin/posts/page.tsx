'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchAPI } from '@/lib/api';

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPosts = async () => {
    try {
      const data = await fetchAPI('/posts?status=all');
      setPosts(data);
    } catch (err) {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = async (id: string, slug: string) => {
    if (!confirm(`Are you sure you want to delete "${slug}"?`)) return;
    try {
      await fetchAPI(`/posts/${id}`, { method: 'DELETE' });
      // Reload posts
      loadPosts();
    } catch (err: any) {
      alert('Failed to delete: ' + err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Posts</h1>
        <Link href="/admin/posts/new" className="bg-primary text-white px-4 py-2 rounded">
          + Add New Post
        </Link>
      </div>
      <table className="w-full mt-6 border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Title</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Views</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post: any) => (
            <tr key={post.slug} className="border-b">
              <td className="p-2">{post.title}</td>
              <td className="p-2">{post.status}</td>
              <td className="p-2">{post.viewCount}</td>
              <td className="p-2 flex gap-2">
                <Link href={`/admin/posts/edit/${encodeURIComponent(post.slug)}`} className="text-primary">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(post.id, post.slug)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {posts.length === 0 && (
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-500">
                No posts yet. Add your first one!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
  }
