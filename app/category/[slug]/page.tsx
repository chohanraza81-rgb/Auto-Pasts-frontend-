export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getServerPosts } from '@/lib/api';
import Link from 'next/link';

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const categorySlug = params.slug;
  // Fetch posts with this category (published only)
  const posts = await getServerPosts({ category: categorySlug, status: 'published' }).catch(() => []);

  // Convert slug to readable name (e.g., "online-shopping" -> "Online Shopping")
  const categoryName = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold capitalize">{categoryName}</h1>
      <p className="text-lg text-gray-600 mt-2">
        Articles about {categoryName} from a 20-year mechanic.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {posts.map((post: any) => (
          <article key={post.slug} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <Link href={`/blog/${post.slug}`}>
              <div className="p-4">
                <h2 className="font-semibold text-lg">{post.title}</h2>
                <p className="text-sm text-gray-600 line-clamp-3">{post.excerpt}</p>
              </div>
            </Link>
          </article>
        ))}
        {posts.length === 0 && (
          <p className="text-gray-500">No posts found in this category yet.</p>
        )}
      </div>
    </main>
  );
}
