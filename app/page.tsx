export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Link from 'next/link';
import { getServerPosts, getServerSettings } from '@/lib/api';
import AdSlot from '@/components/AdSlot';

export default async function HomePage() {
  // Direct server-side fetch for categories (no proxy needed)
  const categoriesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
    cache: 'no-store',
  }).catch(() => null);
  const categories = categoriesRes ? await categoriesRes.json() : [];

  const posts = await getServerPosts({ status: 'published' }).catch(() => []);
  const settings = await getServerSettings().catch(() => ({ siteName: "Mike's Auto Garage" }));

  const latest = posts.slice(0, 8);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section className="text-center py-12 bg-gray-50 rounded-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          {settings.siteName || "Mike's Auto Garage"}
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          Real answers from a 20-year Toronto mechanic. No corporate garbage. Eh.
        </p>
        <Link href="/get-leads" className="mt-8 inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90">
          Get 50 Local Leads →
        </Link>
      </section>

      <AdSlot position="header" />

      {categories.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Top Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat: any) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="p-4 bg-white border rounded-lg text-center hover:border-primary transition-colors capitalize"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Latest From the Garage</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {latest.map((post: any) => (
            <article key={post.slug} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <Link href={`/blog/${post.slug}`}>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{post.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">{post.excerpt}</p>
                </div>
              </Link>
            </article>
          ))}
          {latest.length === 0 && (
            <p className="text-gray-500">No published posts yet.</p>
          )}
        </div>
      </section>

      <section className="mt-12 bg-gray-100 p-8 rounded-xl">
        <h2 className="text-2xl font-bold">Trusted by Canadians Since 2003</h2>
        <p className="mt-2">10,000+ brake pads installed · 4.9 Google rating · ASE Certified</p>
      </section>
    </main>
  );
}
