# Project Tracker

A modern web app for tracking progress in learning and applying new web technologies through side projects.

## Tech Stack
- Next.js 14 (App Router, TypeScript)
- Tailwind CSS
- shadcn/ui
- React Hook Form + Zod
- Zustand
- Recharts
- Prisma + SQLite

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up the database:
   ```bash
   npx prisma migrate dev --name init
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Structure
- `/app`: Next.js App Router pages
- `/components`: UI components
- `/hooks`: Custom React hooks
- `/lib`: Utilities, db, etc.
- `/store`: Zustand stores
- `/types`: TypeScript types

## Deployment
- Ready for Vercel
- See `.vercelignore`
