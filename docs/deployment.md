# StudioPilot Deployment Guide

## 1. Deploying to Vercel

StudioPilot is built with Next.js 15 and deploys to Vercel with zero extra configuration.

### Deployment Steps:
1. Push your repository to your private GitHub account.
2. In the Vercel Dashboard, click **Add New** -> **Project**.
3. Import the `studiopilot` repository.
4. Set the following environment variables in the Vercel Project Settings:
   - `NEXT_PUBLIC_APP_URL`: Your production domain (e.g. `https://studiopilot.vercel.app`)
   - `ADMIN_EMAIL`: Your single administrator email (e.g. `admin@studiopilot.io`)
   - `AUTH_SESSION_SECRET`: A secure 32+ character string
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `SEARCH_PROVIDER`: `tavily` or `duckduckgo`
5. Click **Deploy**.

---

## 2. Supabase Cloud Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor**.
3. Run `supabase/migrations/20261123_initial_schema.sql`.
4. Run `supabase/seed.sql` to populate default brands and creative patterns.
5. In **Authentication** -> **Users**, manually add your administrator account.
6. In **Authentication Settings**, disable public sign-ups.
