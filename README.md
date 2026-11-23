# StudioPilot

> **Your Private Creative Command Centre.**

StudioPilot is a single-administrator, cloud-accessible content production workspace engineered for three independent media brands:

| Brand | Editorial Purpose | Prefix | Signature Aesthetic |
|---|---|---|---|
| **TECHENIGMASTUDIOS** | Technology, AI and ML education with mathematical and architectural rigour | `TES` | Electric Yellow (`#FFD400`), Pure Deep Black (`#080808`) |
| **AI That Works** | Practical AI implementations, agentic systems, and enterprise business workflows | `ATW` | Execution Orange (`#FF5722`), Midnight Navy (`#111827`), Warm White (`#F5F3EE`) |
| **CONTXT AHEAD** | Technology intelligence, industry context, semiconductor geopolitics, and market shifts | `CA` | Deep Strategic Violet (`#7657FF`), Midnight (`#151426`), Icy Blue (`#8DDCFF`) |

---

## 1. The Four Interconnected Systems

StudioPilot guides content through a unified production pipeline:

```text
Research Studio ──► Creative Intelligence ──► Script Studio ──► Editing Studio ──► DaVinci / Remotion
```

### System 1: Research Studio
- **Input**: Concept name, exact research topic, deep-dive subtopics, audience level, target platform, and duration.
- **Brand Modes**:
  - `Technical Deep-Dive` (TES): Algorithms, internal mechanisms, mathematical fundamentals, code examples, misconceptions, and visualization opportunities.
  - `Applied Workflow` (ATW): Manual friction, agent architectures, failure modes, security/compliance, and verified ROI case studies.
  - `Strategic Contextual` (CA): Chronological timelines, corporate incentives, antitrust filings, capital capex, and future scenario modeling.
- **Verification**: Built-in **Claim-Evidence Matrix** (`| Claim ID | Claim | Supporting Source | Verification Status | Evidence / Quote |`) and a verifiable Source Citation Register.
- **Providers**: Pluggable search abstraction supporting Tavily, Serper, and DuckDuckGo.

### System 2: Creative Intelligence
- **Discovery**: YouTube Shorts, Instagram Reels, and TikTok reference library with metric snapshots (`view-to-follower ratio`, `views`, `likes`, `comments`, timestamps) and provenance labels (`Official API`, `Publicly observed`, `Manually submitted`, `Estimated`).
- **Deconstruction**: Hook analysis (first 3s), curiosity gaps, open loops, pattern interrupts, and cut frequency.
- **Pattern Database**: Reusable viral storytelling blueprints (`CP-001` Contrarian Opening, `CP-002` Curiosity-Driven Question, `CP-003` Problem-First Hook, `CP-010` Evidence-Led Payoff).

### System 3: Script Studio
- **Generation**: Fuses verified research dossiers with selected creative patterns.
- **Brand Systems**: Educational Script System (TES), Practical Demonstration Script System (ATW), and Contextual Editorial Script System (CA).
- **Deliverables**: 3-5 hook alternatives with reasoning, continuous voiceover narration, scene-by-scene breakdown table, and 10-point editorial evaluation with explicit disclaimer.

### System 4: Editing Studio
- **Brand Identity**: Visual language guides, philosophy, signature color palettes, typography hierarchy, motion design principles, and caption styling.
- **Scene Planning**: Translates approved scripts into production scene manifests with required assets and sound cues.
- **Exports**:
  - DaVinci Resolve CMX 3600 `.EDL` timeline.
  - Production timeline `.CSV` manifest.
  - Remotion composition JSON configuration.

---

## 2. Security & Single-Admin Architecture

- **Single-Admin Enforcement**: Exactly one pre-provisioned administrator account (`ADMIN_EMAIL`).
- **Zero Public Registration**: No sign-up page, public account creation, or guest access exists.
- **Protected Routes**: Next.js Middleware (`src/middleware.ts`) protects all application pages and data APIs.
- **Rate Limiting**: Sliding-window rate limiter prevents brute-force login attempts.
- **Signed Sessions**: HMAC-SHA256 signed session cookies (`studiopilot_session`).

---

## 3. Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS & Lucide Icons
- **Database**: Supabase PostgreSQL (with Row Level Security) + Resilient Local Persistence Fallback
- **AI Integration**: Google Gemini API via Provider Abstraction (`@google/genai`)
- **Search Integration**: Pluggable search abstraction (Tavily, Serper, DuckDuckGo)
- **Video Handoff**: DaVinci Resolve (EDL/CSV manifests) & Remotion component scaffolding
- **Testing**: Vitest unit & integration test suite

---

## 4. Local Installation & Setup

### Prerequisites
- Node.js (v18.0.0 or higher; developed on v26.13.0)
- npm or pnpm

### Step 1: Clone and Install
```bash
git clone <your-repo-url> studiopilot
cd studiopilot
npm install
```

### Step 2: Configure Environment
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_EMAIL=admin@studiopilot.io
AUTH_SESSION_SECRET=your_super_secret_key_min_32_characters

# External Providers (Optional for local test runs; DuckDuckGo search and local persistence operate out-of-the-box)
GEMINI_API_KEY=your_gemini_api_key
SEARCH_PROVIDER=duckduckgo
```

### Step 3: Run Database Migrations (Supabase)
If using Supabase:
1. Run `supabase/migrations/20261123_initial_schema.sql` in the Supabase SQL Editor.
2. Run `supabase/seed.sql` to populate default brands and creative patterns.

### Step 4: Run Tests
```bash
npm test
```

### Step 5: Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Deployment

StudioPilot deploys to **Vercel** with zero extra configuration. Refer to [docs/deployment.md](docs/deployment.md) for step-by-step cloud deployment instructions.
