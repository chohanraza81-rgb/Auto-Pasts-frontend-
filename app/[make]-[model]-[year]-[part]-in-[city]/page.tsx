import { getPosts } from '@/lib/api';
import Schema from '@/components/Schema';
import AdSlot from '@/components/AdSlot';
import Link from 'next/link';
import { generateVehicleSchema } from '@/lib/seo';

export default async function VehiclePartPage({ params }: { params: { make: string; model: string; year: string; part: string; city: string } }) {
  const { make, model, year, part, city } = params;
  const posts = await getPosts({ category: part }).catch(() => []);
  const title = `${year} ${make} ${model} ${part.replace(/-/g, ' ')} in ${city.replace(/-/g, ' ')}`;

  const vehicleSchema = generateVehicleSchema(make, model, year, part);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold">{title}</h1>
      <p className="text-lg text-gray-600 mt-2">
        Need a {part.replace(/-/g, ' ')} for your {year} {make} {model} in {city}? Here's what a 20-year Toronto mechanic recommends.
      </p>
      <AdSlot position="header" />
      <Schema data={vehicleSchema} />
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        {posts.map((p: any) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="border p-4 rounded-lg hover:shadow-md">
            <h2 className="font-semibold">{p.title}</h2>
            <p className="text-sm text-gray-600">{p.excerpt}</p>
          </Link>
        ))}
        {posts.length === 0 && <p>No articles yet, but we're working on it. Check back soon!</p>}
      </div>
      <AdSlot position="footer" />
    </main>
  );
}
