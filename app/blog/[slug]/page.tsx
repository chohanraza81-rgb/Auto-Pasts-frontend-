import { getPost, getPosts } from '@/lib/api';
import AuthorBox from '@/components/AuthorBox';
import TOC from '@/components/TOC';
import AdSlot from '@/components/AdSlot';
import Schema from '@/components/Schema';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { generateArticleSchema, generateFAQSchema } from '@/lib/seo';

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug).catch(() => null);
  if (!post) notFound();

  const related = await getPosts({ category: post.category }).catch(() => []);
  const relatedPosts = related.filter((p: any) => p.slug !== post.slug).slice(0, 8);

  const articleSchema = generateArticleSchema(post);
  // Basic FAQ extraction from post content (in production you'd parse headings)
  const faqSchema = generateFAQSchema([
    { question: 'How often should I replace brake pads?', answer: 'Every 40,000-60,000 km depending on driving.' }
  ]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-[1fr_320px] gap-8">
      <article>
        <h1 className="text-4xl font-bold">{post.title}</h1>
        <AuthorBox />
        <AdSlot position="header" />
        <TOC content={post.content} />
        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
        <AdSlot position="in-article" />
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Where I Buy Parts</h2>
          <p>Check out my trusted suppliers:</p>
          {/* Affiliate links go here */}
        </div>
        <Schema data={articleSchema} />
        <Schema data={faqSchema} />
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
        </div>
        <AdSlot position="sidebar" />
      </aside>
    </main>
  );
}
