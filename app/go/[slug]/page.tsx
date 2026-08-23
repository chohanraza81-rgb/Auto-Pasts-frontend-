'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GoPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  useEffect(() => {
    fetch(`/api/track?slug=${params.slug}`)
      .then(() => router.push(`/api/affiliates/go/${params.slug}`))
      .catch(() => router.push('/'));
  }, [params.slug, router]);
  return <div className="flex items-center justify-center min-h-screen">Redirecting...</div>;
}
