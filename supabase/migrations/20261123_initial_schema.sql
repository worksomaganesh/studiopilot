-- ====================================================================
-- StudioPilot Database Schema Migration: 20261123_initial_schema.sql
-- Description: Complete relational schema for StudioPilot content production
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Admin Profiles Table (Single Admin Identity)
CREATE TABLE IF NOT EXISTS admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL DEFAULT 'Administrator',
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role = 'admin'),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Brands Table (TECHENIGMASTUDIOS, AI That Works, CONTXT AHEAD)
CREATE TABLE IF NOT EXISTS brands (
    id TEXT PRIMARY KEY, -- 'TECHENIGMASTUDIOS', 'AI_THAT_WORKS', 'CONTXT_AHEAD'
    name TEXT NOT NULL,
    tagline TEXT NOT NULL,
    editorial_purpose TEXT NOT NULL,
    prefix TEXT NOT NULL UNIQUE,
    primary_color TEXT NOT NULL,
    secondary_color TEXT,
    background_color TEXT NOT NULL,
    accent_color TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Content Projects Table (Shared Project Management Backbone)
CREATE TABLE IF NOT EXISTS content_projects (
    id TEXT PRIMARY KEY, -- e.g. 'TES-2026-001'
    brand_id TEXT NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    concept_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'INBOX' CHECK (
        status IN (
            'INBOX', 'RESEARCHING', 'RESEARCH_COMPLETE', 'SCRIPT_DRAFT',
            'SCRIPT_REVIEW', 'SCRIPT_APPROVED', 'PRODUCTION_PLANNING',
            'EDITING', 'REVIEW', 'READY_TO_PUBLISH', 'PUBLISHED', 'ANALYSED'
        )
    ),
    target_platform TEXT NOT NULL DEFAULT 'YouTube Shorts',
    target_duration_seconds INTEGER NOT NULL DEFAULT 60,
    target_audience_level TEXT NOT NULL DEFAULT 'Intermediate',
    approved_script_id UUID,
    active_research_run_id UUID,
    active_editing_plan_id UUID,
    tags TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_projects_brand ON content_projects(brand_id);
CREATE INDEX IF NOT EXISTS idx_content_projects_status ON content_projects(status);
CREATE INDEX IF NOT EXISTS idx_content_projects_created ON content_projects(created_at DESC);

-- 5. Project Activity Log (Audit Trail)
CREATE TABLE IF NOT EXISTS project_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id TEXT NOT NULL REFERENCES content_projects(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    description TEXT NOT NULL,
    previous_status TEXT,
    new_status TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_activity_project ON project_activity(project_id, created_at DESC);

-- 6. Research Runs (Research Studio Dossiers)
CREATE TABLE IF NOT EXISTS research_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id TEXT REFERENCES content_projects(id) ON DELETE SET NULL,
    brand_id TEXT NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
    version INTEGER NOT NULL DEFAULT 1,
    concept_name TEXT NOT NULL,
    exact_topic TEXT NOT NULL,
    target_audience TEXT,
    knowledge_level TEXT,
    target_platform TEXT,
    desired_duration TEXT,
    additional_instructions TEXT,
    executive_overview TEXT NOT NULL,
    concept_definition TEXT NOT NULL,
    background_and_fundamentals TEXT NOT NULL,
    step_by_step_mechanisms TEXT[] NOT NULL DEFAULT '{}',
    examples_and_use_cases TEXT[] NOT NULL DEFAULT '{}',
    important_technical_details TEXT[] NOT NULL DEFAULT '{}',
    comparisons JSONB DEFAULT '[]'::jsonb,
    visualisation_opportunities TEXT[] NOT NULL DEFAULT '{}',
    misconceptions TEXT[] NOT NULL DEFAULT '{}',
    limitations TEXT[] NOT NULL DEFAULT '{}',
    research_gaps_and_uncertainty TEXT[] NOT NULL DEFAULT '{}',
    suggested_follow_up_questions TEXT[] NOT NULL DEFAULT '{}',
    raw_markdown TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_research_runs_project ON research_runs(project_id);
CREATE INDEX IF NOT EXISTS idx_research_runs_brand ON research_runs(brand_id);

-- 7. Research Sources (Verified Citation Register)
CREATE TABLE IF NOT EXISTS research_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_id UUID NOT NULL REFERENCES research_runs(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    publisher TEXT,
    published_date TEXT,
    snippet TEXT,
    credibility_score INTEGER CHECK (credibility_score BETWEEN 1 AND 10),
    is_primary_source BOOLEAN NOT NULL DEFAULT FALSE,
    retrieved_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_research_sources_run ON research_sources(run_id);

-- 8. Research Claims (Claim-Evidence Matrix)
CREATE TABLE IF NOT EXISTS research_claims (
    id TEXT NOT NULL, -- e.g. 'CLM-001'
    run_id UUID NOT NULL REFERENCES research_runs(id) ON DELETE CASCADE,
    claim TEXT NOT NULL,
    subtopic_index INTEGER NOT NULL DEFAULT 0,
    subtopic_title TEXT NOT NULL,
    supporting_source_id UUID REFERENCES research_sources(id) ON DELETE SET NULL,
    supporting_source_url TEXT NOT NULL,
    supporting_source_title TEXT NOT NULL,
    verification_status TEXT NOT NULL DEFAULT 'VERIFIED' CHECK (
        verification_status IN ('VERIFIED', 'CORROBORATED', 'UNCONFIRMED', 'DISPUTED')
    ),
    quote_or_evidence TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (run_id, id)
);

CREATE INDEX IF NOT EXISTS idx_research_claims_run ON research_claims(run_id);

-- 9. Creator Profiles (Creative Intelligence)
CREATE TABLE IF NOT EXISTS creator_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform TEXT NOT NULL,
    handle TEXT NOT NULL UNIQUE,
    name TEXT,
    profile_url TEXT,
    follower_count INTEGER,
    bio TEXT,
    last_observed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Creative Reels (Reel and Short Reference Database)
CREATE TABLE IF NOT EXISTS creative_reels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform TEXT NOT NULL CHECK (platform IN ('YouTube Shorts', 'Instagram Reels', 'TikTok')),
    public_url TEXT NOT NULL UNIQUE,
    creator_handle TEXT NOT NULL,
    creator_name TEXT,
    creator_follower_count INTEGER,
    title_or_caption TEXT NOT NULL,
    video_duration_seconds INTEGER NOT NULL DEFAULT 60,
    published_date DATE,
    niche TEXT NOT NULL,
    transcript_text TEXT,
    transcript_language TEXT DEFAULT 'en',
    notes TEXT,
    tags TEXT[] NOT NULL DEFAULT '{}',
    linked_pattern_ids TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_creative_reels_platform ON creative_reels(platform);
CREATE INDEX IF NOT EXISTS idx_creative_reels_niche ON creative_reels(niche);

-- 11. Reel Metric Snapshots (Metric Snapshots with Time Stamps & Provenance)
CREATE TABLE IF NOT EXISTS reel_metric_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reel_id UUID NOT NULL REFERENCES creative_reels(id) ON DELETE CASCADE,
    observed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    view_count BIGINT NOT NULL DEFAULT 0,
    like_count BIGINT NOT NULL DEFAULT 0,
    comment_count BIGINT NOT NULL DEFAULT 0,
    share_count BIGINT,
    creator_followers_at_observation INTEGER,
    view_to_follower_ratio NUMERIC(10, 2),
    data_source TEXT NOT NULL CHECK (
        data_source IN (
            'Official API data',
            'Publicly observed data',
            'Manually submitted data',
            'Estimated or unavailable data'
        )
    )
);

CREATE INDEX IF NOT EXISTS idx_reel_metric_snapshots_reel ON reel_metric_snapshots(reel_id, observed_at DESC);

-- 12. Reel Analyses (Deep Hook, Structure, Retention & Editing Analysis)
CREATE TABLE IF NOT EXISTS reel_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reel_id UUID NOT NULL UNIQUE REFERENCES creative_reels(id) ON DELETE CASCADE,
    analyzed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    hook_analysis JSONB NOT NULL DEFAULT '{}'::jsonb,
    script_structure JSONB NOT NULL DEFAULT '{}'::jsonb,
    retention_patterns JSONB NOT NULL DEFAULT '{}'::jsonb,
    editing_characteristics JSONB NOT NULL DEFAULT '{}'::jsonb,
    performance_context JSONB NOT NULL DEFAULT '{}'::jsonb,
    extracted_pattern_suggestions TEXT[] NOT NULL DEFAULT '{}'
);

-- 13. Creative Pattern Knowledge Base (Creative Patterns)
CREATE TABLE IF NOT EXISTS creative_patterns (
    id TEXT PRIMARY KEY, -- e.g. 'CP-001'
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (
        category IN ('HOOK', 'STORY_STRUCTURE', 'RETENTION_LOOP', 'PAYOFF', 'PACING')
    ),
    description TEXT NOT NULL,
    why_it_works TEXT NOT NULL,
    best_use_cases TEXT[] NOT NULL DEFAULT '{}',
    suitable_formats TEXT[] NOT NULL DEFAULT '{}',
    potential_limitations TEXT[] NOT NULL DEFAULT '{}',
    brand_suitability TEXT[] NOT NULL DEFAULT '{}',
    example_hook_or_snippet TEXT NOT NULL,
    source_reference_ids TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. Script Documents (Script Studio Master Documents)
CREATE TABLE IF NOT EXISTS script_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id TEXT REFERENCES content_projects(id) ON DELETE SET NULL,
    brand_id TEXT NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
    research_dossier_id UUID REFERENCES research_runs(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    approved_at TIMESTAMPTZ,
    target_platform TEXT NOT NULL DEFAULT 'YouTube Shorts',
    target_duration_seconds INTEGER NOT NULL DEFAULT 60,
    selected_pattern_ids TEXT[] NOT NULL DEFAULT '{}',
    hook_alternatives JSONB NOT NULL DEFAULT '[]'::jsonb,
    selected_hook_id TEXT NOT NULL,
    full_narration TEXT NOT NULL,
    scenes JSONB NOT NULL DEFAULT '[]'::jsonb,
    evaluation JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_script_documents_project ON script_documents(project_id);
CREATE INDEX IF NOT EXISTS idx_script_documents_brand ON script_documents(brand_id);

-- 15. Script Versions (Script Version History & Comparison)
CREATE TABLE IF NOT EXISTS script_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    script_document_id UUID NOT NULL REFERENCES script_documents(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    summary_of_changes TEXT NOT NULL,
    snapshot JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_script_versions_document ON script_versions(script_document_id, version_number DESC);

-- 16. Editing Profiles Table (Brand Guidelines & Visual Identities)
CREATE TABLE IF NOT EXISTS editing_profiles (
    id TEXT PRIMARY KEY REFERENCES brands(id) ON DELETE CASCADE,
    visual_character TEXT[] NOT NULL,
    editing_philosophy TEXT NOT NULL,
    editing_style TEXT[] NOT NULL,
    motion_principles TEXT[] NOT NULL,
    transitions TEXT[] NOT NULL,
    caption_style JSONB NOT NULL,
    sound_design TEXT NOT NULL,
    scene_archetypes TEXT[] NOT NULL,
    lower_thirds_style TEXT NOT NULL,
    thumbnail_rules TEXT[] NOT NULL,
    davinci_template_reference TEXT NOT NULL,
    remotion_component_reference TEXT NOT NULL,
    export_specs JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. Editing Plans Table (Production Plans & Scene manifests)
CREATE TABLE IF NOT EXISTS editing_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id TEXT NOT NULL REFERENCES content_projects(id) ON DELETE CASCADE,
    brand_id TEXT NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
    script_document_id UUID NOT NULL REFERENCES script_documents(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    scenes JSONB NOT NULL DEFAULT '[]'::jsonb,
    aspect_ratio TEXT NOT NULL DEFAULT '9:16',
    resolution TEXT NOT NULL DEFAULT '1080x1920',
    frame_rate INTEGER NOT NULL DEFAULT 60,
    davinci_resolve_export JSONB NOT NULL DEFAULT '{}'::jsonb,
    remotion_scaffold JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_editing_plans_project ON editing_plans(project_id);

-- 18. Asset Records Table (Media, B-Roll, Voiceover, Music)
CREATE TABLE IF NOT EXISTS asset_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id TEXT NOT NULL REFERENCES content_projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (
        type IN ('B_ROLL', 'VOICEOVER', 'MUSIC', 'SFX', 'GRAPHIC', 'SCREEN_RECORDING', 'CODE_SNIPPET')
    ),
    file_url TEXT,
    storage_path TEXT,
    license TEXT NOT NULL DEFAULT 'Standard Royalty-Free',
    source_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_asset_records_project ON asset_records(project_id);

-- 19. Publishing Records Table
CREATE TABLE IF NOT EXISTS publishing_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id TEXT NOT NULL REFERENCES content_projects(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    published_url TEXT,
    scheduled_time TIMESTAMPTZ,
    published_time TIMESTAMPTZ,
    caption_text TEXT NOT NULL,
    hashtags TEXT[] NOT NULL DEFAULT '{}',
    thumbnail_url TEXT,
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SCHEDULED', 'PUBLISHED', 'FAILED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_publishing_records_project ON publishing_records(project_id);

-- 20. Performance Snapshots Table (Analytics & Historical Evaluation)
CREATE TABLE IF NOT EXISTS performance_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id TEXT NOT NULL REFERENCES content_projects(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    observed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    view_count BIGINT NOT NULL DEFAULT 0,
    like_count BIGINT NOT NULL DEFAULT 0,
    comment_count BIGINT NOT NULL DEFAULT 0,
    share_count BIGINT NOT NULL DEFAULT 0,
    retention_at_3s_percent NUMERIC(5, 2),
    average_watch_percent NUMERIC(5, 2),
    data_source TEXT NOT NULL DEFAULT 'Publicly observed',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_performance_snapshots_project ON performance_snapshots(project_id, observed_at DESC);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- StudioPilot is a single-administrator workspace.
-- All tables have RLS enabled and restrict read/write access to the authenticated admin.
-- ====================================================================

ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE creative_reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE reel_metric_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE reel_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE creative_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE script_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE script_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE editing_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE editing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE publishing_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_snapshots ENABLE ROW LEVEL SECURITY;

-- Helper policy definition for authenticated administrator
CREATE POLICY admin_profiles_admin_all ON admin_profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY brands_admin_all ON brands FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY content_projects_admin_all ON content_projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY project_activity_admin_all ON project_activity FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY research_runs_admin_all ON research_runs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY research_sources_admin_all ON research_sources FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY research_claims_admin_all ON research_claims FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY creator_profiles_admin_all ON creator_profiles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY creative_reels_admin_all ON creative_reels FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY reel_metric_snapshots_admin_all ON reel_metric_snapshots FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY reel_analyses_admin_all ON reel_analyses FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY creative_patterns_admin_all ON creative_patterns FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY script_documents_admin_all ON script_documents FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY script_versions_admin_all ON script_versions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY editing_profiles_admin_all ON editing_profiles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY editing_plans_admin_all ON editing_plans FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY asset_records_admin_all ON asset_records FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY publishing_records_admin_all ON publishing_records FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY performance_snapshots_admin_all ON performance_snapshots FOR ALL USING (auth.role() = 'authenticated');
