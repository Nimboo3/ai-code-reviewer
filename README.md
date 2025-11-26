# CodeReview.ai

An AI-powered code review platform that provides instant, automated analysis of your code—identifying bugs, security vulnerabilities, and suggesting improvements using advanced language models.

## ✨ Features

### Core Features
- **AI-Powered Code Review** - Instant analysis with structured feedback (issues, metrics, suggestions)
- **Multiple AI Models** - Google Gemini (free tier), OpenAI GPT, and local Ollama support
- **PR Review Dashboard** - Track pull requests, architecture health, and tech debt
- **GitHub Integration** - Connect repos and get automated PR reviews
- **Notifications System** - Real-time alerts for reviews and activity
- **Dark Mode UI** - Modern, clean interface with lighter dark theme

### Security & Auth
- Secure authentication with Supabase Auth
- Optional MFA (Two-Factor Authentication)
- SSO support (Google, GitHub)
- Row Level Security (RLS) on all data

### Pricing Tiers
- **Free Tier**: 10 reviews/day, 500KB file limit
- **Premium**: Unlimited reviews, 10MB file limit, priority support

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Supabase (PostgreSQL + Auth + Storage)
- **AI Models**:
  - Google Gemini (gemini-2.0-flash, gemini-2.0-flash-lite, gemini-2.5-flash, gemini-2.5-pro)
  - OpenAI GPT (gpt-4o-mini, gpt-4o)
  - Local: Ollama (qwen2.5-coder, gemma3, llama3.2)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Supabase account
- AI provider API key (at least one):
  - **Google Gemini** ([Get free key](https://aistudio.google.com/apikey)) - **Recommended**: 1500 free requests/day
  - **OpenAI** ([Get key](https://platform.openai.com/api-keys)) - Pay-as-you-go
  - **Ollama** ([Install](https://ollama.com/)) - Free, local only

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

# AI Provider (choose one or more)
GEMINI_API_KEY=your_gemini_key      # Recommended - FREE tier
OPENAI_API_KEY=your_openai_key      # Optional - paid

# OAuth (optional)
NEXT_PUBLIC_SSO_PROVIDERS=google,github
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

4. **Apply database migrations**
```bash
npx supabase login
npx supabase link --project-ref your-project-ref
npx supabase db push
```

5. **Start development server**
```bash
npm run dev
```

6. **Open the application**

Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
nextjs/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API routes
│   │   │   ├── code-review/    # Code review endpoints
│   │   │   ├── notifications/  # Notifications API
│   │   │   └── github/         # GitHub integration
│   │   ├── app/                # Protected app pages
│   │   │   ├── dashboard/      # PR review dashboard
│   │   │   ├── code-review/    # Code review interface
│   │   │   ├── projects/       # GitHub projects
│   │   │   └── agents/         # AI agents
│   │   └── auth/               # Authentication pages
│   ├── components/             # React components
│   │   ├── ui/                 # UI primitives
│   │   └── code-review/        # Review-specific components
│   └── lib/                    # Utilities
│       ├── ai/                 # AI integrations
│       ├── supabase/           # Database client
│       └── context/            # React context
├── public/
│   └── terms/                  # Legal documents
└── supabase/
    └── migrations/             # Database migrations
```

##  API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/code-review` | POST | Submit code for AI review |
| `/api/code-review/[id]` | GET | Get a specific review |
| `/api/notifications` | GET | Fetch user notifications |
| `/api/notifications` | PATCH | Mark notification read/dismissed |
| `/api/github/repos` | GET | List connected GitHub repos |
| `/api/github/review` | POST | Review a GitHub PR |

##  Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
PRIVATE_SUPABASE_SERVICE_KEY=xxx
GEMINI_API_KEY=xxx
```

##  Security

- All API keys validated server-side only
- Row Level Security (RLS) on all tables
- Rate limiting for free tier users
- Never commit `.env.local`

##  License

Licensed under Apache License 2.0 - see [LICENSE](LICENSE) file.

##  Contributing

Contributions welcome! Please submit a Pull Request.

##  Links

- **Live Demo**: [codereview.ai](https://ai-code-reviewer-vert.vercel.app/)
- **Repository**: [github.com/Nimboo3/ai-code-reviewer](https://github.com/Nimboo3/ai-code-reviewer)
- **Issues**: [Report a bug](https://github.com/Nimboo3/ai-code-reviewer/issues)
