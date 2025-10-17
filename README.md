# AI Code Reviewer

AI Code Review Assistant — a focused tool and demo app that helps automate code reviews by analyzing structure, readability, and best practices using LLMs and a Supabase backend.


## Features

- Upload source files and receive a structured code review in Markdown
- Persistent review storage backed by Supabase (`public.code_reviews` table)
- Authenticated UI (Supabase Auth) with optional MFA support
- Simple API endpoints for submitting and fetching reviews (`/api/code-review`)
- Pluggable LLM provider (OpenAI, Google Gemini, or local Ollama) with prompt templates for consistent, actionable feedback
- Example dashboard at `/app/code-review` for uploading files and viewing reports

## Architecture overview

- Frontend: Next.js (App Router) + React + Tailwind CSS
- Backend: Next.js Route Handlers (Node runtime) + Supabase (Postgres + Auth + Storage)
- LLM: Multiple providers supported:
  - **OpenAI** (gpt-4o-mini, gpt-4o) — Fast & capable, ~$0.15 per 1M tokens, free tier has 3 RPM limit
  - **Google Gemini** (gemini-1.5-flash-latest, gemini-1.5-pro-latest, gemini-2.0-flash-exp, gemini-2.5-flash-latest) — Free tier: 1500 requests/day, no credit card required (uses native Google SDK)
  - **Local Ollama** (gemma3:4b, qwen3:4b, qwen3:8b, deepseek-rl:8b) — Unlimited offline usage, privacy-first, optimized for CPU

## Quick start — Local development

Prerequisites:
- Node.js 18+
- pnpm / npm / yarn
- Supabase CLI (optional for local DB/migrations)
- API key for one of:
  - **OpenAI** (get from https://platform.openai.com/api-keys) — requires $5+ prepaid for 500 RPM, free tier is 3 RPM
  - **Google Gemini** (get from https://aistudio.google.com/apikey) — 1500 free requests/day, no credit card
  - **Local Ollama** (install from https://ollama.com/) — unlimited offline usage, no API key needed

1. Clone the repository

```bash
git clone https://github.com/Nimboo3/ai-code-reviewer.git
cd ai-code-reviewer/nextjs
```

2. Install dependencies

```bash
npm install
```

3. Prepare environment

Copy the template and fill in your values:

```bash
cp .env.local.template .env.local
# Edit .env.local and add your API keys
```

Required environment variables (in `nextjs/.env.local`):

- NEXT_PUBLIC_SUPABASE_URL — your Supabase project URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY — Supabase anon/public key
- PRIVATE_SUPABASE_SERVICE_KEY — Supabase service_role key (server-only)
- **Choose one AI provider:**
  - OPENAI_API_KEY — for OpenAI models (gpt-4o-mini, gpt-4o)
  - GEMINI_API_KEY — for Google Gemini models (gemini-1.5-flash, gemini-1.5-pro, gemini-2.0-flash-exp)
  - *(or install Ollama for local models — no API key needed)*
- NEXT_PUBLIC_PRODUCTNAME — optional product name shown in UI (default: "AI Code Reviewer")

**Recommended for getting started:** Use GEMINI_API_KEY to get 1500 free requests/day with no credit card required.

4. Apply Supabase migrations

If you use the Supabase CLI and have your project linked, run:

```bash
npx supabase login
npx supabase link
npx supabase migrations up --linked
```

Alternatively, apply migrations in your Supabase project via the SQL editor using files in the `supabase/migrations` folder.

5. Start the app

```bash
npm run dev --workspace=nextjs
# or if the project root script is set up
cd nextjs
npm run dev
```

6. Visit the app

Open http://localhost:3000 and log in or register. The code review UI is at `/app/code-review` when running locally.

## Running the AI review flow (overview)

- Upload a source file through the `/app/code-review` UI or POST to `/api/code-review` with a file payload.
- The server stores the file, calls the LLM with a structured prompt, and writes the Markdown review to `public.code_reviews`.
- Use the API to fetch and display reviews.

## Environment and security notes

- Never commit `.env.local` or secrets. `.gitignore` excludes `.env.local` and `.next` by default.
- Keep your `PRIVATE_SUPABASE_SERVICE_KEY` server-only; never expose it to the browser.
- For production, set environment variables in your hosting platform (Vercel, Render, etc.) and ensure the site URL is added to your Supabase project's allowed redirect URLs.

## Deployment

1. Push your repo to GitHub (if not already).
2. Create a new project in Vercel or your chosen host, link the GitHub repository.
3. Add the environment variables in the deployment platform.
4. Run migrations in your Supabase project (either from the CLI or via the SQL editor).

## Mobile app (optional)

This repository includes an Expo-based mobile example under `supabase-expo-template/`. It shares the same Supabase backend. If you plan to use the mobile app, update `supabase-expo-template/app.json` (bundle id/package id) and the deep-link `scheme` before publishing.

## API contract (short)

- POST /api/code-review
    - Input: file upload + optional metadata (language, filename)
    - Output: code review job id or immediate review object
- GET /api/code-review/:id
    - Returns: stored review (Markdown + metadata)

Refer to the `src/app/api/code-review` handlers for exact payloads.

## Tests

Add any unit or integration tests you want in the `nextjs` workspace. You can run configured tests with your package manager.

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork and create a branch
2. Implement changes and add tests
3. Open a PR describing the change

If you want to contribute design updates (UI), please keep changes isolated and avoid altering core auth or Supabase logic unless agreed on.

## License

This project is licensed under the Apache License (see `LICENSE` in the repository).

## Contact

Repository: https://github.com/Nimboo3/ai-code-reviewer

---

If you'd like, I can now commit these README edits and delete the removed README files in a single git commit. Want me to create the commit and push to the `main` branch (I can add the `origin` remote if you want)?
    - Storage Buckets

- **Authentication**
    - Supabase Auth
    - MFA support
    - OAuth providers

## 📦 Getting Started - local dev

1. Fork or clone repository
2. Prepare Supabase Project URL (Project URL from `Project Settings` -> `API` -> `Project URL`)
3. Prepare Supabase Anon and Service Key (`Anon Key`, `Service Key` from `Project Settings` -> `API` -> `anon public` and `service_role`)
4. Prepare Supabase Database Password  (You can reset it inside `Project Settings` -> `Database` -> `Database Password`)
5. If you already know your app url -> adjust supabase/config.toml `site_url` and `additional_redirect_urls`, you can do it later
6. Run following commands (inside root of forked / downloaded repository):

```bash
# Login to supabase
npx supabase login
# Link project to supabase (require database password) - you will get selector prompt
npx supabase link

# Send config to the server - may require confirmation (y)
npx supabase config push

# Up migrations
npx supabase migrations up --linked

```

7. Go to next/js folder and run `yarn`
8. Copy .env.template to .env.local
9. Adjust .env.local
```
NEXT_PUBLIC_SUPABASE_URL=https://APIURL
NEXT_PUBLIC_SUPABASE_ANON_KEY=ANONKEY
PRIVATE_SUPABASE_SERVICE_KEY=SERVICEROLEKEY

```
10. Run yarn dev
11. Go to http://localhost:3000 🎉

## 🚀 Getting Started - deploy to vercel

1. Fork or clone repository
2. Create project in Vercel - choose your repo
3. Paste content of .env.local into environment variables
4. Click deploy
5. Adjust in supabase/config.toml site_url and additional_redirect_urls (important in additional_redirect_urls is to have https://YOURURL/** - these 2 **)
6. Done!

## 📄 Legal Documents

The template includes customizable legal documents - these are in markdown, so you can adjust them as you see fit:

- Privacy Policy (`/public/terms/privacy-notice.md`)
- Terms of Service (`/public/terms/terms-of-service.md`)
- Refund Policy (`/public/terms/refund-policy.md`)

If you find this project helpful, please consider giving it a star on GitHub:
- [GitHub](https://github.com/Nimboo3/ai-code-reviewer)


## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
