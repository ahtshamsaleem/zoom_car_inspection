# Zoom Car Inspection

Professional car inspection management SaaS built with Next.js, Supabase, and modern React tooling.

## Stack

- **Next.js 16** (App Router + Route Handlers)
- **Supabase** (Authentication + PostgreSQL)
- **Zustand** (Inspection workflow state)
- **React Hook Form + Zod** (Form validation)
- **shadcn/ui + Tailwind CSS** (UI)
- **Framer Motion** (Animations)
- **Recharts** (Analytics)
- **jsPDF** (PDF export)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Copy `.env.local.example` to `.env.local` and fill in your keys
3. Run `supabase/schema.sql` in the Supabase SQL Editor

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Image Upload

The `/api/upload` route uses a dummy API that returns placeholder image URLs. Replace the logic in `src/app/api/upload/route.ts` with your real upload service.
