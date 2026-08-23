# Mike's Auto Garage SEO Monorepo

A premium, production-ready affiliate website with programmatic SEO, AI-generated content, and lead generation.

## Features

- **Backend**: Node.js, Express, TypeScript, Prisma, MongoDB. Gemini 3-model failover with caching.
- **Frontend**: Next.js 14 App Router, Tailwind, Shadcn UI, NextAuth.
- **SEO**: Article/FAQ/Vehicle schemas, internal linking, programmatic pages, sitemap.
- **Monetization**: Affiliate link cloaking, click tracking, AdSense slots.
- **Admin Panel**: Dashboard, post editor (Tiptap), AI writer, keyword manager, lead export.

## Setup

1. Clone repo.
2. Set up backend: `cd backend && npm install && cp .env.example .env` (fill values).
3. Run `npx prisma db push` and `npm run prisma:seed`.
4. Start backend: `npm run dev`.
5. Set up frontend: `cd ../frontend && npm install && cp .env.example .env.local`.
6. Run frontend: `npm run dev`.
7. Access at `http://localhost:3000`.

## Environment Variables

See `.env.example` files in both directories.

## Deployment

See `deployment.md`.

## License

MIT
