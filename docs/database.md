# StudioPilot Database Architecture

## 1. Relational Model Overview

StudioPilot uses a normalized relational PostgreSQL schema (implemented for Supabase and backed by a local JSON persistence layer for seamless offline testing).

Location of SQL Migration:
`supabase/migrations/20261123_initial_schema.sql`

Location of Seed Script:
`supabase/seed.sql`

---

## 2. Table Catalog

| Table | Purpose |
|---|---|
| `admin_profiles` | Pre-provisioned administrator profile linked to `auth.users` |
| `brands` | Configuration for TECHENIGMASTUDIOS, AI That Works, and CONTXT AHEAD |
| `content_projects` | Central content project records (`TES-YYYY-NNN`, `ATW-YYYY-NNN`, `CA-YYYY-NNN`) |
| `project_activity` | Immutable audit trail of project status transitions and actions |
| `research_runs` | Research Studio dossiers, executive overviews, and subtopic investigations |
| `research_sources` | Verified primary and secondary web citations with URLs and publication dates |
| `research_claims` | Claim-Evidence Matrix mapping claims to sources and verification statuses |
| `creator_profiles` | Creators observed across YouTube Shorts, Instagram Reels, and TikTok |
| `creative_reels` | Video references with duration, transcripts, and metadata |
| `reel_metric_snapshots` | Time-stamped view, like, comment, follower, and view-to-follower ratio snapshots |
| `reel_analyses` | Deconstructed hooks, script structures, retention loops, and editing specs |
| `creative_patterns` | Reusable storytelling blueprints (`CP-001` through `CP-010`) |
| `script_documents` | Screenplays, scene breakdown tables, and 10-point editorial evaluations |
| `script_versions` | Version history snapshots for diff comparisons |
| `editing_profiles` | Brand-specific visual language guidelines, typography, and motion rules |
| `editing_plans` | Scene-by-scene production plans, DaVinci track allocation, and EDL data |
| `asset_records` | Media assets, B-roll registers, and licensing manifests |
| `publishing_records` | Distribution schedules, platform captions, and hashtags |
| `performance_snapshots` | Post-publication retention and engagement tracking |

---

## 3. Row Level Security (RLS)

All tables have RLS enabled:
```sql
ALTER TABLE content_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY content_projects_admin_all
ON content_projects
FOR ALL
USING (auth.role() = 'authenticated');
```
Only the authenticated administrator can select, insert, update, or delete records.
