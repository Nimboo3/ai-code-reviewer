# AI Code Review Assistant (MVP)

Objective: Automate code reviews by analyzing structure, readability, and best practices.

What’s shipped in this repo:
- Input: Upload source code file (single-file MVP)
- Output: Markdown review report with prioritized suggestions
- Optional dashboard: `/app/code-review` to upload & view reports

Technical bits:
- Backend API: Next.js Route Handlers under `/api/code-review` (Node runtime)
- LLM: OpenAI Chat Completions with focused prompts for readability/modularity/bugs
- Database: Supabase table `public.code_reviews` with RLS policies

Setup steps (Windows cmd):
1) Set env vars in `nextjs/.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=...your supabase url...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...your anon key...
OPENAI_API_KEY=...your key...
OPENAI_MODEL=gpt-4o-mini
```
2) Apply Supabase migrations from `supabase/` so `code_reviews` table exists (via CLI or Studio)
3) Install and run Next.js:
```
cd /d c:\Users\Tanmay\Desktop\supabase-nextjs-template-main\nextjs
npm install
npm run dev
```
4) Login → go to `http://localhost:3000/app/code-review` → upload a file → open the report

Deliverables for the hiring assignment:
- This GitHub repo + README additions (you’re here)
- Record a short demo video showing upload → list → view report

Evaluation focus covered:
- LLM insight quality: structured prompt + Markdown sections
- Code handling: accepts file upload, language inferred by extension, preview stored
- API design: simple POST/GET endpoints, auth-guarded via Supabase session
- Completeness: DB schema, API, UI, README with setup and demo guidance
