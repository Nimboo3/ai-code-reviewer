# Vercel Deployment Guide

## Quick Deploy via CLI

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Navigate to your Next.js folder
cd nextjs

# 3. Deploy
vercel

# 4. For production
vercel --prod
```

When prompted:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No (first time) or Yes (if exists)
- **Project name?** → ai-code-reviewer
- **Directory?** → ./ (since you're already in nextjs/)
- **Override settings?** → No

## Add Environment Variables

After deployment, add these in Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://zyywojowbfieflfhvunv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
GEMINI_API_KEY=AIzaSyB35Q9ptQAXQD7A5rbyeCLeQt3PjFcE9f0
OPENAI_API_KEY=sk-proj-cI_HtcAViPox_cyL...
NEXT_PUBLIC_PRODUCTNAME=AI Code Reviewer
NEXT_PUBLIC_THEME=theme-purple
```

Do NOT add:
- OPENAI_LOCAL_BASE_URL
- OPENAI_LOCAL_API_KEY

Then redeploy for env vars to take effect.
