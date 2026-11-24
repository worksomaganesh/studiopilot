# StudioPilot

> **Your Private Creative Command Centre.**

StudioPilot is a single-administrator, cloud-accessible content production workspace engineered for three independent media brands. It unifies the entire short-form content lifecycle—from deep research and viral pattern deconstruction to source-traceable scriptwriting and multi-format editing handoffs.

---

## 1. Supported Brands

StudioPilot provides distinct brand workspaces, each with dedicated visual languages, editorial missions, and content generation engines:

| Brand | Prefix | Editorial Mission | Signature Palette |
|---|---|---|---|
| **TECHENIGMASTUDIOS** | `TES` | Computer science, AI/ML architectures, and system engineering with mathematical and technical rigor. | Electric Yellow (`#FFD400`), Pure Deep Black (`#080808`) |
| **AI That Works** | `ATW` | Practical AI implementation, agentic automation, and reliable enterprise business workflows. | Execution Orange (`#FF5722`), Midnight Navy (`#111827`), Warm White (`#F5F3EE`) |
| **CONTXT AHEAD** | `CA` | Technology intelligence, semiconductor geopolitics, capital capex, and industrial strategic context. | Strategic Violet (`#7657FF`), Midnight (`#151426`), Icy Blue (`#8DDCFF`) |

---

## 2. System Architecture & The Four Studios

StudioPilot guides content production through a four-stage pipeline managed by a centralized Content Project layer:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      STUDIOPILOT WORKFLOW PIPELINE                          │
│                                                                             │
│   ┌─────────────────┐      ┌─────────────────────────┐                      │
│   │ 1. RESEARCH     │      │ 2. CREATIVE             │                      │
│   │    STUDIO       ├─────►│    INTELLIGENCE         ├─────┐                │
│   │ Multi-Provider  │      │ Viral Reference Library │     │                │
│   │ Claim-Evidence  │      │ 10 Core Hook Patterns   │     │                │
│   └─────────────────┘      └─────────────────────────┘     │                │
│                                                            ▼                │
│   ┌─────────────────┐      ┌─────────────────────────┐ ┌───────────────┐   │
│   │ EXPORT HANDOFFS │      │ 4. EDITING              │ │ 3. SCRIPT     │   │
│   │ DaVinci CMX3600 │◄─────┤    STUDIO               │◄┤    STUDIO     │   │
│   │ CSV Manifest    │      │ Visual Timeline Plans   │ │ Grounded Drafts│   │
│   │ Remotion Config │      │ Asset Sound Registers   │ │ Multi-Hooks   │   │
│   └─────────────────┘      └─────────────────────────┘ └───────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### System 1: Research Studio
- **Input**: Topic, subtopics, target audience level, platform, and target duration.
- **Brand-Specific Modes**:
  - `Technical Deep-Dive` (TES): Algorithms, mathematical formulation, step-by-step mechanisms, code examples, misconceptions, and visual diagrams.
  - `Applied Workflow` (ATW): Operational friction, ROI metrics, agent architectures, failure modes, and compliance considerations.
  - `Strategic Contextual` (CA): Chronological timelines, capital allocation, corporate incentives, antitrust implications, and future scenarios.
- **Verification Engine**: Built-in **Claim-Evidence Matrix** pairing every claim with a canonical source ID, source URL, verification status, and direct quotation.
- **Search Providers**: Pluggable abstraction supporting Tavily, Serper, and live DuckDuckGo web search.

### System 2: Creative Intelligence
- **Reference Library**: Multi-platform catalog (YouTube Shorts, Instagram Reels, TikTok) tracking views, likes, comments, and view-to-follower ratios.
- **Metric Provenance**: Explicit labels for data sources (`Official API`, `Publicly observed`, `Manually submitted`, `Estimated`).
- **Pattern Database**: 10 reusable short-form storytelling blueprints (e.g., `CP-001` Contrarian Opening, `CP-002` Curiosity Question, `CP-003` Problem-First Hook, `CP-010` Evidence-Led Payoff).

### System 3: Script Studio
- **Factual Synthesis**: Generates full voiceover narration grounded directly in research claims.
- **Topic Isolation Engine**: Built-in domain classifier (`AI_AGENTS`, `FEATURE_ENGINEERING`, `NEURAL_ARCHITECTURES`, `SYSTEMS_AND_INFRASTRUCTURE`) preventing cross-topic template contamination.
- **Deliverables**: 3–5 hook alternatives with psychological rationale, scene-by-scene visual direction, on-screen text, audio timing, and 10-point editorial evaluation.
- **Version Control**: Multi-version drafting with immutable historical snapshots and approval gating.

### System 4: Editing Studio
- **Scene Planning**: Translates approved scripts into structured visual scenes, sound design layers, and motion graphics cues.
- **Brand Style Guides**: Custom typography hierarchy, color codes, and visual pacing rules per brand.
- **Multi-Format Exports**:
  - **DaVinci Resolve**: Industry-standard CMX 3600 `.EDL` timeline files.
  - **Spreadsheet Manifest**: Detailed `.CSV` production cue sheet.
  - **Remotion**: Programmatic `.JSON` composition configuration ready for React-based video rendering.

---

## 3. Implementation Status

To provide full transparency, StudioPilot distinguishes between features that are fully operational out-of-the-box, features requiring external API configuration, and planned future capabilities:

| Component / Subsystem | Status | Description |
|---|---|---|
| **Local Application Foundation & Dashboard** | ✅ Implemented | Complete responsive UI, brand selector, activity feed, and project list. |
| **Local File-Backed Database Fallback** | ✅ Implemented | Zero-config JSON storage engine (`data/storage.json`) with auto-seeding. |
| **Authentication & Middleware** | ✅ Implemented | Single-admin login, HMAC-SHA256 signed session cookies, sliding rate limiter. |
| **Public Registration Protection** | ✅ Implemented | Public sign-ups strictly disabled; single pre-provisioned administrator identity. |
| **Brand Configurations (TES, ATW, CA)** | ✅ Implemented | All three brands fully configured with colors, prefixes, and style guides. |
| **Content Project Management** | ✅ Implemented | Project creation, status transitions, activity logging, and filtering. |
| **DuckDuckGo Web Search Integration** | ✅ Implemented | Live HTML search scraper; requires zero external API keys. |
| **Deterministic Fallback Engines** | ✅ Implemented | Complete offline generation of research dossiers, scripts, and editing plans. |
| **Script Domain Classification & Isolation** | ✅ Implemented | Eliminates template cross-contamination with automated test coverage. |
| **Multi-Format Video Exports** | ✅ Implemented | DaVinci Resolve CMX 3600 EDL, CSV manifest, and Remotion JSON generators. |
| **Vitest Automated Test Suite** | ✅ Implemented | 26 unit and regression tests covering script engine, search, and core features. |
| **Google Gemini API Provider** | 🟡 Partially Implemented | Architecture ready (`@google/genai`); activates when `GEMINI_API_KEY` is provided. |
| **Tavily & Serper Search Providers** | 🟡 Partially Implemented | Providers implemented; activate when corresponding API keys are provided. |
| **Supabase PostgreSQL & RLS Migrations** | 🟡 Partially Implemented | Migration SQL & seed ready; activates when Supabase project keys are configured. |
| **Direct Cloud Publishing Webhooks** | ⚪ Planned | Direct push to YouTube/Instagram via official publishing APIs. |
| **Automated Remotion Headless Renderer** | ⚪ Planned | Headless cloud rendering of Remotion compositions directly to `.mp4`. |

---

## 4. Technology Stack

- **Framework**: Next.js 15 (App Router, Server Components, Route Handlers)
- **Language**: TypeScript 5 (Strict Mode)
- **Styling**: Tailwind CSS & Lucide React
- **Local Persistence**: Resilient file-backed JSON store with schema validation
- **Cloud Database**: Supabase PostgreSQL with comprehensive Row Level Security (RLS)
- **AI Integration**: Provider abstraction supporting Google Gemini (`@google/genai`)
- **Search Engine**: Pluggable provider architecture (DuckDuckGo, Tavily, Serper)
- **Video Tools**: DaVinci Resolve EDL (CMX 3600), CSV manifests, Remotion JSON scaffolding
- **Testing**: Vitest 3

---

## 5. Project Directory Structure

```text
studiopilot/
├── docs/                                # Technical documentation & audit reports
│   ├── architecture.md                  # Comprehensive architectural blueprint
│   ├── authentication.md                # Single-admin auth & security model
│   ├── database.md                      # Supabase schema & local fallback reference
│   ├── deployment.md                    # Production hosting instructions
│   ├── provider-setup.md                # Gemini, Supabase, and Search setup guide
│   ├── research-audit-TES-2026-011.md   # Research quality audit report
│   ├── script-editorial-verification-TES-2026-011.md # Script V2/V3 audit
│   └── verification-report.md           # End-to-end technical verification report
├── src/
│   ├── app/                             # Next.js App Router (Pages & API routes)
│   │   ├── api/                         # Backend route handlers (Auth, Projects, Research, Scripts, Editing)
│   │   ├── assets/                      # Asset registry page
│   │   ├── brands/                      # Brand guidelines & visual identity
│   │   ├── creative-intelligence/       # Viral reference catalog & pattern database
│   │   ├── dashboard/                   # Main executive dashboard
│   │   ├── editing/                     # Editing Studio & timeline export views
│   │   ├── login/                       # Single-admin login interface
│   │   ├── projects/                    # Project list and detail views
│   │   ├── research/                    # Research Studio & dossier generator
│   │   ├── scripts/                     # Script Studio & version management
│   │   └── settings/                    # Provider configuration & system status
│   ├── brands/                          # Multi-brand definitions, colors, and React context
│   ├── components/                      # Shared UI components, shell, and modals
│   ├── features/                        # Core domain engines
│   │   ├── creative-intelligence/       # Pattern analysis engine
│   │   ├── editing/                     # EDL, CSV, and Remotion export engines
│   │   ├── research/                    # Research generator & Claim-Evidence matrix
│   │   └── scripts/                     # Script generation engine & domain detector
│   ├── lib/                             # Core library utilities
│   │   ├── auth/                        # HMAC session verification & rate limiting
│   │   ├── db/                          # Database abstraction (Supabase / Local JSON fallback)
│   │   ├── providers/                   # Extensible AI and Search provider interfaces
│   │   └── supabase/                    # Supabase server and client factories
│   ├── middleware.ts                    # Next.js route protection middleware
│   └── types/                           # TypeScript interfaces & domain models
├── supabase/                            # Supabase cloud database assets
│   ├── migrations/                      # PostgreSQL DDL migrations with RLS policies
│   └── seed.sql                         # Seed data for brands, patterns, and sample projects
├── data/                                # Local storage directory (ignored by Git)
│   └── storage.example.json             # Sanitized starter storage template
├── tests/                               # Vitest automated test suite
│   ├── script-engine.test.ts            # Domain classification & template isolation tests
│   ├── search.test.ts                   # Search provider abstraction & live DuckDuckGo tests
│   └── studiopilot.test.ts              # Core project and brand integration tests
├── .env.example                         # Environment variable template with placeholders
├── .gitignore                           # Git ignore rules protecting local data and secrets
├── package.json                         # Project dependencies and npm scripts
├── tsconfig.json                        # TypeScript strict compiler configuration
└── vitest.config.ts                     # Vitest configuration
```

---

## 6. Local Installation & Quick Start

### Prerequisites
- **Node.js**: v18.0.0 or higher (developed and tested on Node.js v26)
- **Package Manager**: npm (v9+), pnpm, or yarn
- **Git**

### Step 1: Clone the Repository
```bash
git clone https://github.com/worksomaganesh/studiopilot.git
cd studiopilot
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a local configuration file from the template:
```bash
cp .env.example .env.local
```

Edit `.env.local` to configure local administrator credentials:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 1. Single Administrator Credentials
ADMIN_EMAIL=admin@studiopilot.io
ADMIN_PASSWORD=your_secure_password_here
AUTH_SESSION_SECRET=a_random_32_character_string_for_signing_cookies

# 2. Local Fallback Persistence (Enabled by default)
ENABLE_LOCAL_STORAGE_FALLBACK=true

# 3. Web Search Provider (DuckDuckGo requires no API keys)
SEARCH_PROVIDER=duckduckgo

# 4. Optional External Providers (Leave blank for offline mode)
GEMINI_API_KEY=
TAVILY_API_KEY=
SERPER_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### Step 4: Run the Automated Test Suite
Verify that all unit and integration tests pass:
```bash
npm test
```

### Step 5: Start the Development Server
```bash
npm run dev
```

Navigate to `http://localhost:3000` in your web browser. You will be redirected to the secure login page. Log in with the credentials defined in `.env.local`.

---

## 7. Environment Variables Reference

All environment variables use strict placeholder values in `.env.example`. Secrets must only be stored in `.env.local` (which is excluded by `.gitignore`):

| Variable | Required | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Yes | `http://localhost:3000` | Base URL of the application. |
| `ADMIN_EMAIL` | Yes | `admin@studiopilot.io` | Single pre-provisioned administrator email. |
| `ADMIN_PASSWORD` | Yes | *None* | Plaintext administrator password for local auth. |
| `AUTH_SESSION_SECRET` | Yes | *None* | 32+ character HMAC secret for signed session tokens. |
| `ENABLE_LOCAL_STORAGE_FALLBACK` | No | `true` | When true, uses `data/storage.json` if Supabase is unconfigured. |
| `SEARCH_PROVIDER` | No | `duckduckgo` | Active search provider (`duckduckgo`, `tavily`, `serper`). |
| `GEMINI_API_KEY` | Optional | *None* | Google AI Studio API key for Gemini models. |
| `GEMINI_MODEL` | Optional | `gemini-2.5-flash` | Gemini model variant to invoke. |
| `TAVILY_API_KEY` | Optional | *None* | Tavily AI Search API key. |
| `SERPER_API_KEY` | Optional | *None* | Serper Google Search API key. |
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | *None* | Supabase cloud project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | *None* | Supabase public anonymous API key. |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | *None* | Supabase privileged service role API key. |

---

## 8. Testing & Production Build

### Running Tests
StudioPilot uses Vitest for fast, isolated test execution:
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Building for Production
To compile and optimize the application for production:
```bash
# Typecheck
npx tsc --noEmit

# Production build
npm run build

# Start production server
npm run start
```

---

## 9. Security & Access Control Model

StudioPilot is engineered as a private enterprise workspace:
1. **Single-Admin Enforcement**: No public sign-up or registration endpoints exist. The application admits exactly one administrator identity.
2. **HMAC-SHA256 Session Signing**: Session tokens stored in `studiopilot_session` cookies are cryptographically signed to prevent tampering.
3. **Brute-Force Rate Limiting**: An in-memory sliding-window limiter throttles failed login attempts per IP address.
4. **Row Level Security (RLS)**: If deployed against Supabase, all 19 database tables have RLS enabled, restricting access exclusively to the authenticated admin.
5. **No Secret Tracking**: `.gitignore` strictly excludes `.env*` files, local `data/storage.json`, build artifacts, and private keys.

---

## 10. License

Private & Proprietary. All rights reserved.
