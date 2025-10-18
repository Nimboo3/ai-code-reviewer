# CodeReview.ai

An AI-powered code review platform that provides automated analysis of your code, identifying issues, suggesting improvements, and evaluating overall code quality using advanced language models.

## 🎥 Demo Video

Watch a full walkthrough of CodeReview.ai in action:


https://github.com/user-attachments/assets/e66963f2-3e19-4621-b3d9-e1254cf9eb3b




## Features

- Automated code review with structured feedback (issues, metrics, suggestions)
- Multiple AI provider support (Google Gemini, OpenAI GPT, Local Ollama for development)
- Two-tier pricing system (Free: 10 reviews/day, Premium: unlimited)
- Secure authentication with optional MFA
- Review history and analytics dashboard
- File size limits: 500KB (Free), 10MB (Premium)
- Persistent storage via Supabase

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase (PostgreSQL + Auth + Storage)
- **AI Models** (Production):
  - Google Gemini (gemini-1.5-flash, gemini-1.5-pro, gemini-2.0-flash, gemini-2.0-flash-thinking)
  - OpenAI GPT (gpt-4o-mini, gpt-4o)
- **AI Models** (Local Development Only):
  - Ollama (gemma3, qwen3, deepseek-rl, llama3.2)

## Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Supabase account
- AI provider API key (at least one required):
  - **Google Gemini API key** ([Get here](https://aistudio.google.com/apikey)) - **Recommended**: 1500 free requests/day
  - **OpenAI API key** ([Get here](https://platform.openai.com/api-keys)) - Paid usage
  - **Local Ollama** ([Install here](https://ollama.com/)) - For local development only (won't work in production)

> **Note**: Ollama models are only available when running locally (`npm run dev`). Production deployments (Vercel) only support cloud-hosted models (Gemini and OpenAI).

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Nimboo3/ai-code-reviewer.git
cd ai-code-reviewer/nextjs
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.local.template .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
PRIVATE_SUPABASE_SERVICE_KEY=your_supabase_service_key

# Choose one AI provider:
OPENAI_API_KEY=your_openai_key
# OR
GEMINI_API_KEY=your_gemini_key
# OR install Ollama for local models
```

4. **Apply database migrations**
```bash
npx supabase login
npx supabase link
npx supabase migrations up --linked
```

Alternatively, run SQL files from `supabase/migrations/` in your Supabase SQL editor.

5. **Start development server**
```bash
npm run dev
```

6. **Open the application**

Visit [http://localhost:3000](http://localhost:3000) and create an account to start reviewing code.

## Deployment

### Deploy to Vercel

1. Push your repository to GitHub
2. Create a new project in Vercel and import your repository
3. Add environment variables in Vercel project settings
4. Deploy

### Supabase Configuration

Update `supabase/config.toml` with your production URLs:
```toml
site_url = "https://your-domain.com"
additional_redirect_urls = ["https://your-domain.com/**"]
```

## API Endpoints

### POST `/api/code-review`
Submit code for review
- **Input**: FormData with `file` and optional `model`
- **Response**: Review result with markdown, model info, and database ID

### GET `/api/code-review/[id]`
Retrieve a specific code review
- **Response**: Stored review data

## Project Structure

```
nextjs/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── api/          # API routes
│   │   ├── app/          # Protected app pages
│   │   └── auth/         # Authentication pages
│   ├── components/       # React components
│   └── lib/              # Utilities and AI integrations
├── public/
│   └── terms/            # Legal documents
└── supabase/
    └── migrations/       # Database migrations
```

## Security Notes

- Never commit `.env.local` or expose API keys
- Keep `PRIVATE_SUPABASE_SERVICE_KEY` server-side only
- All API keys are validated on the server
- Rate limiting enforced for free tier users

## License

Licensed under the Apache License 2.0 - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Links

- **Repository**: [github.com/Nimboo3/ai-code-reviewer](https://github.com/Nimboo3/ai-code-reviewer)
- **Issues**: [github.com/Nimboo3/ai-code-reviewer/issues](https://github.com/Nimboo3/ai-code-reviewer/issues)
