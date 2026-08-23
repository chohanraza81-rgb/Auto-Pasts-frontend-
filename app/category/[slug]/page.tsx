import { getPosts } from '@/lib/api';
import Link from 'next/link';

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const posts = await getPosts({ category: params.slug, status: 'published' }).catch(() => []);
  const categoryName = params.slug.replace(/-/g, ' ');

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold capitalize">{categoryName}</h1>
      <p className="text-lg text-gray-600 mt-2">Articles about {categoryName} from a 20-year mechanic.</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {posts.map((post: any) => (
          <article key={post.slug} className="border rounded-lg overflow-hidden">
            <Link href={`/blog/${post.slug}`}>
              <div className="p-4">
                <h2 className="font-semibold text-lg">{post.title}</h2>
                <p className="text-sm text-gray-600">{post.excerpt}</p>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
