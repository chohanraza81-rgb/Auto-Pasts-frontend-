'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts?status=all`)
      .then(res => res.json())
      .then(data => { setPosts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Posts</h1>
        <Link href="/admin/ai-writer" className="bg-primary text-white px-4 py-2 rounded">New Post</Link>
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
              <td className="p-2">
                <Link href={`/admin/posts/${post.id}`} className="text-primary">Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
