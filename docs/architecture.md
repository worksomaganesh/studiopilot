# StudioPilot Architecture

## 1. Overview & Vision

**StudioPilot** is a private, single-admin creative command centre engineered for three independent media brands:

| Brand | Editorial Purpose | Prefix | Accent Palette |
|---|---|---|---|
| **TECHENIGMASTUDIOS** | Technical, AI and ML education with mathematical and architectural rigour | `TES` | Electric Yellow (`#FFD400`), Pure Black (`#080808`) |
| **AI That Works** | Practical AI implementations, agentic systems, and enterprise business workflows | `ATW` | Execution Orange (`#FF5722`), Midnight Navy (`#111827`), Warm White (`#F5F3EE`), Peach (`#FFB088`) |
| **CONTXT AHEAD** | Technology intelligence, geopolitical implications, and strategic market shifts | `CA` | Deep Violet (`#7657FF`), Midnight (`#151426`), Icy Blue (`#8DDCFF`), Pale Lavender (`#EDE9FF`) |

The application is structured as a **modular monolith** running Next.js App Router, TypeScript (strict mode), and Tailwind CSS.

---

## 2. Four Interconnected Systems & Pipeline

```text
[Research Studio] ─────────► [Creative Intelligence]
       │                                │
       ▼                                ▼
[Script Studio] ────────────────────────┘
       │
       ▼
[Editing Studio] ──────────► [DaVinci Resolve / Remotion Handoff]
```

### 1. Research Studio (System 1)
- **Role**: Deep topic and conceptual investigation grounded in primary sources.
- **Provider Abstraction**: Pluggable search engine (`src/lib/providers/search/`) supporting Tavily, Google Serper, and open web search.
- **Claim-Evidence Matrix**: Generates persistent dossiers mapping claims to source URLs, verification status, and cited quotes.
- **Brand Modes**:
  - `Technical Deep-Dive` (TECHENIGMASTUDIOS)
  - `Applied Workflow` (AI That Works)
  - `Strategic Contextual` (CONTXT AHEAD)

### 2. Creative Intelligence (System 2)
- **Role**: Deconstructs viral short-form references (YouTube Shorts, Instagram Reels, TikTok).
- **Metric Snapshots**: Time-stamped view, like, comment, follower, and view-to-follower ratios with data provenance labels (`Official API`, `Publicly observed`, `Manually submitted`, `Estimated`).
- **Psychological & Cinematic Deconstruction**: Hook analysis (first 3s), curiosity gaps, open loops, pattern interrupts, and cut frequency.
- **Pattern Knowledge Base**: Reusable storytelling and retention patterns (`CP-001` to `CP-010`).

### 3. Script Studio (System 3)
- **Role**: Fuses verified research dossiers and creative patterns into original scripts.
- **Brand Adapters**:
  - `Educational Script System` (TES): Explains complex technical terms, mechanisms, and mental models.
  - `Practical Demonstration Script System` (ATW): Pain point -> automated workflow -> live UI demo -> ROI.
  - `Contextual Editorial Script System` (CA): High-stakes questions, geopolitical timeline, capital incentives, competing views.
- **Deliverables**: 3-5 hook alternatives, continuous narration, scene-by-scene breakdown table, and 10-point editorial evaluation.

### 4. Editing Studio (System 4)
- **Role**: Production planning and timeline manifest generation.
- **Brand Visual Identities**: Enforces color palettes, kinetic monospace vs modern sans vs editorial serif typography, and sound design principles.
- **Exports**:
  - DaVinci Resolve CMX 3600 standard `.EDL` timeline.
  - Detailed scene CSV manifest.
  - Remotion composition JSON configuration.

---

## 3. Security Architecture

1. **Strict Single-Admin Access**: Exactly one administrator account (`ADMIN_EMAIL`).
2. **Zero Public Signup**: No registration forms, sign-up endpoints, or guest access.
3. **Session Verification**: Signed session tokens with HMAC-SHA256 and secure HTTP-only cookies (`studiopilot_session`).
4. **Middleware Protection**: All application routes and `/api/*` endpoints require authentication. Unauthenticated requests are rejected or redirected to `/login`.
5. **Rate Limiting**: In-memory rate limiting blocks brute-force attempts on `/api/auth/login`.
