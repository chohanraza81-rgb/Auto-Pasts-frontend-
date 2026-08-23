export interface Post {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  metaTitle: string;
  metaDesc: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  author: string;
  publishedAt?: string;
  viewCount: number;
  schemaJson?: string;
  createdAt: string;
}

export interface Affiliate {
  id: string;
  name: string;
  url: string;
  cloakSlug: string;
  network: string;
  clicks: number;
  revenue: number;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  source: string;
  createdAt: string;
}
