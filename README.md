# ProposalAI v2 — Premium Edition

AI-powered proposal generator for freelancers.
Paste a job post → Get a complete winning proposal package in ~15 seconds.

---

## SETUP IN 5 STEPS

### Step 1 — Install Node.js (skip if already installed)
Go to https://nodejs.org → click LTS → install it.

### Step 2 — Open this folder in VS Code
File → Open Folder → select this folder → open terminal with Ctrl+`

### Step 3 — Install dependencies
```
npm install
```

### Step 4 — Create your .env.local file
Copy `.env.example` → rename copy to `.env.local` → fill in your keys:

```
NEXT_PUBLIC_SUPABASE_URL=       ← from supabase.com → Settings → API
NEXT_PUBLIC_SUPABASE_ANON_KEY=  ← from supabase.com → Settings → API
GROQ_API_KEY=                   ← from console.groq.com (FREE)
```

### Step 5 — Run the database schema
- Go to supabase.com → your project → SQL Editor → New query
- Open schema.sql from this folder, copy everything, paste, click Run

### Step 6 — Launch
```
npm run dev
```
Open http://localhost:3000

---

## Getting Your Free Keys

### Supabase (database + auth) — Free
1. supabase.com → New Project
2. Settings (gear icon) → API
3. Copy "Project URL" and "anon public" key

### Groq API (AI generation) — Free, no card needed
1. console.groq.com → sign up
2. API Keys → Create API Key
3. Copy it

---

## Deploy to Vercel (free hosting)
1. Push to GitHub
2. vercel.com → Import project from GitHub
3. Add your 3 environment variables
4. Click Deploy → live in 2 minutes

---

## File Structure
```
proposalai/
├── app/
│   ├── page.tsx                       ← Landing page
│   ├── login/page.tsx                 ← Login
│   ├── signup/page.tsx                ← Signup
│   ├── dashboard/
│   │   ├── layout.tsx                 ← Sidebar navigation
│   │   ├── page.tsx                   ← Dashboard home
│   │   ├── proposals/
│   │   │   ├── page.tsx               ← Proposal history
│   │   │   └── new/page.tsx           ← MAIN FEATURE: generator
│   │   ├── analytics/page.tsx         ← Win rate analytics
│   │   └── settings/page.tsx          ← Your profile
│   └── api/
│       ├── proposals/
│       │   ├── route.ts               ← GET & PATCH proposals
│       │   └── generate/route.ts      ← POST: calls Groq AI
│       └── analytics/route.ts         ← GET stats
├── lib/
│   ├── claude.ts                      ← AI generation (uses Groq)
│   ├── supabase.ts                    ← Client-side DB
│   └── supabase-server.ts             ← Server-side DB
├── schema.sql                         ← Run this in Supabase
└── .env.example                       ← Copy to .env.local
```
