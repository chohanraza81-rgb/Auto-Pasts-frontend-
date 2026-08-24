export const dynamic = 'force-dynamic';
export const revalidate = 3600;

import { getServerPost, getServerPosts } from '@/lib/api';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AuthorBox from '@/components/AuthorBox';
import AdSlot from '@/components/AdSlot';
import Schema from '@/components/Schema';

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getServerPost(params.slug).catch(() => null);
  if (!post) notFound();

  const related = await getServerPosts({ category: post.category, status: 'published' }).catch(() => []);
  const relatedPosts = related.filter((p: any) => p.slug !== post.slug).slice(0, 8);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDesc,
    author: { '@type': 'Person', name: post.author || 'Mike Johnson' },
    datePublished: post.publishedAt,
    image: post.featuredImage || undefined,
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-[1fr_320px] gap-8">
      <article>
        <h1 className="text-4xl font-bold">{post.title}</h1>
        <AuthorBox />

        {post.featuredImage && (
          <div className="mt-6 mb-6">
            <img
              src={post.featuredImage}
              alt={post.featuredImageAlt || post.title}
              className="w-full h-auto rounded-lg shadow-md"
              loading="lazy"
            />
          </div>
        )}

        <AdSlot position="header" />
        <div
          className="prose prose-lg max-w-none mt-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <AdSlot position="in-article" />
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Where I Buy Parts</h2>
          <p>Check out my trusted suppliers:</p>
          {/* Affiliate links go here */}
        </div>
        <Schema data={articleSchema} />
      </article>

      <aside>
        <AdSlot position="sidebar" />
        <h3 className="font-semibold mt-6">Related Posts</h3>
        <div className="space-y-4 mt-4">
          {relatedPosts.map((p: any) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="block hover:underline">
              {p.title}
            </Link>
          ))}
          {relatedPosts.length === 0 && <p className="text-gray-500">No related posts.</p>}
        </div>
        <AdSlot position="sidebar" />
      </aside>
    </main>
  );
}
