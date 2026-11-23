-- ====================================================================
-- StudioPilot Seed Data: supabase/seed.sql
-- ====================================================================

-- 1. Insert Brands
INSERT INTO brands (id, name, tagline, editorial_purpose, prefix, primary_color, secondary_color, background_color, accent_color)
VALUES
('TECHENIGMASTUDIOS', 'TECHENIGMASTUDIOS', 'High-Calibre Technical & Machine Learning Education', 'Technology, AI and ML education with mathematical and architectural rigour.', 'TES', '#FFD400', '#FFE14D', '#080808', '#FFD400'),
('AI_THAT_WORKS', 'AI That Works', 'Practical AI Implementations & Enterprise Workflows', 'Transforming abstract AI capabilities into deployed, profitable, and reliable business workflows.', 'ATW', '#FF5722', '#FFB088', '#111827', '#FF5722'),
('CONTXT_AHEAD', 'CONTXT AHEAD', 'Technology Intelligence, Industry Context & Strategic Implications', 'Deep geopolitical, macroeconomic, and industrial analysis of technological shifts.', 'CA', '#7657FF', '#8DDCFF', '#151426', '#7657FF')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Core Creative Patterns (Knowledge Base)
INSERT INTO creative_patterns (id, name, category, description, why_it_works, best_use_cases, suitable_formats, potential_limitations, brand_suitability, example_hook_or_snippet, source_reference_ids)
VALUES
(
  'CP-001',
  'Contrarian Opening',
  'HOOK',
  'Directly confronts and dismantles a widely accepted belief within the first 3 seconds.',
  'Triggers an immediate cognitive dissonance and pattern interrupt in the viewer feed, forcing them to pause to resolve the contradiction.',
  ARRAY['Debunking popular AI buzzwords', 'Challenging bloated cloud architecture', 'Re-evaluating legacy software practices'],
  ARRAY['Shorts', 'Reels', 'TikTok'],
  ARRAY['Requires immediate irrefutable proof; without evidence it appears as cheap rage-bait.'],
  ARRAY['TECHENIGMASTUDIOS', 'CONTXT_AHEAD'],
  'Everything you were taught about gradient descent is wrong when training at scale.',
  ARRAY['REF-001']
),
(
  'CP-002',
  'Curiosity-Driven Question',
  'HOOK',
  'Poses an intriguing, high-stakes question whose answer has immediate practical or strategic value.',
  'Creates an instant open cognitive loop in the viewers working memory that demands closure.',
  ARRAY['Technical deep-dives', 'Market analysis', 'Architectural comparisons'],
  ARRAY['Shorts', 'Reels', 'TikTok'],
  ARRAY['The payoff at the end must completely answer the question or viewer retention on future videos drops.'],
  ARRAY['TECHENIGMASTUDIOS', 'AI_THAT_WORKS', 'CONTXT_AHEAD'],
  'Why did NVIDIA spend $500M buying this obscure optical interconnect startup?',
  ARRAY['REF-002']
),
(
  'CP-003',
  'Problem-First Hook',
  'HOOK',
  'Simulates or highlights an acute, visceral operational pain point in the first 2 seconds.',
  'Viewers experiencing this exact friction identify immediately with the narrator and stay for the solution.',
  ARRAY['Enterprise workflow automation', 'Debugging nightmare sessions', 'Cost reduction tutorials'],
  ARRAY['Shorts', 'Reels'],
  ARRAY['Must resonate with the exact target demographic or general audiences will swipe past.'],
  ARRAY['AI_THAT_WORKS'],
  'Stop manually copying Stripe invoices into QuickBooks. Your operations team is burning 14 hours a week.',
  ARRAY['REF-003']
),
(
  'CP-004',
  'Unexpected Statistic',
  'HOOK',
  'Leads with a staggering, verified metric that shatters baseline expectations.',
  'Numbers ground abstract concepts in tangible reality and trigger urgency.',
  ARRAY['AI economics', 'Datacenter power consumption', 'Model latency benchmarks'],
  ARRAY['Shorts', 'Reels', 'TikTok'],
  ARRAY['Must be backed by credible source citation; fabricated statistics ruin brand credibility permanently.'],
  ARRAY['TECHENIGMASTUDIOS', 'CONTXT_AHEAD'],
  '73% of enterprise generative AI pilots never make it to production. Here is the single architectural flaw why.',
  ARRAY['REF-004']
),
(
  'CP-005',
  'Before-and-After Narrative',
  'STORY_STRUCTURE',
  'Juxtaposes the painful baseline reality with the streamlined, automated future state.',
  'Clear contrast creates emotional relief and gives tangible proof of transformation.',
  ARRAY['Software implementation', 'Agentic automation', 'Code refactoring'],
  ARRAY['Shorts', 'Reels'],
  ARRAY['Must show real UI screencasts, not generic illustrative stock footage.'],
  ARRAY['AI_THAT_WORKS'],
  'Before: 4 developers spending 6 hours triaging bug logs. After: 1 agent pipeline fixing PRs in 90 seconds.',
  ARRAY['REF-005']
),
(
  'CP-006',
  'Step-by-Step Reveal',
  'STORY_STRUCTURE',
  'Numbered linear progression (Step 1, Step 2, Step 3) with increasing information density.',
  'Predictable structure lowers cognitive barrier to entry and increases completion rate.',
  ARRAY['Technical tutorials', 'Model quantization walkthroughs', 'Workflow setup guides'],
  ARRAY['Shorts', 'Reels', 'TikTok'],
  ARRAY['Pacing must remain brisk; lingering on Step 1 causes mid-video drop-off.'],
  ARRAY['TECHENIGMASTUDIOS', 'AI_THAT_WORKS'],
  'Step 1: Quantize the weights to 4-bit. Step 2: Offload KV cache. Step 3: Run locally on 8GB VRAM.',
  ARRAY['REF-006']
),
(
  'CP-007',
  'Myth versus Reality',
  'STORY_STRUCTURE',
  'Explicit split screen: Top/Left shows the pervasive industry myth, Bottom/Right shows actual production engineering reality.',
  'Visual dual-framing provides clarity and authority.',
  ARRAY['Deep learning theory vs production', 'Cloud pricing myths', 'Agent reliability'],
  ARRAY['Shorts', 'Reels'],
  ARRAY['Both sides must be clearly labeled with high-contrast text overlays.'],
  ARRAY['TECHENIGMASTUDIOS', 'AI_THAT_WORKS'],
  'The Myth: Vector search solves all hallucinations. The Reality: Without hybrid reranking, recall falls to 34%.',
  ARRAY['REF-007']
),
(
  'CP-008',
  'Demonstration-Led Opening',
  'HOOK',
  'Shows the finished, working output performing in the first 1.5 seconds before explaining how it was built.',
  'Immediate proof of value captures skeptical technical viewers immediately.',
  ARRAY['Live software demos', 'Autonomous agents in action', 'Real-time computer vision'],
  ARRAY['Shorts', 'Reels', 'TikTok'],
  ARRAY['The screen recording must be high-resolution and clearly zoomed into the action.'],
  ARRAY['AI_THAT_WORKS', 'TECHENIGMASTUDIOS'],
  'Look at this screen: This AI agent just negotiated a SaaS vendor renewal and saved $18,400.',
  ARRAY['REF-008']
),
(
  'CP-009',
  'Open-Loop Storytelling',
  'RETENTION_LOOP',
  'Introduces a secondary suspense element early on that will only be revealed during the final conclusion.',
  'Sustains retention through the middle technical exposition.',
  ARRAY['Contextual narratives', 'Behind-the-scenes corporate battles', 'Complex algorithm teardowns'],
  ARRAY['Shorts', 'Reels'],
  ARRAY['Loop cannot be forgotten or viewer feels cheated.'],
  ARRAY['CONTXT_AHEAD', 'TECHENIGMASTUDIOS'],
  'Pay close attention to what happened in Taiwan on October 14th, because that changes the entire story.',
  ARRAY['REF-009']
),
(
  'CP-010',
  'Evidence-Led Payoff',
  'PAYOFF',
  'Concludes not with generic advice, but with a specific research citation, formula, or downloadable blueprint.',
  'Positions the creator as an elite primary source and drives bookmarks/shares.',
  ARRAY['Technical education conclusion', 'Enterprise blueprints', 'Policy forecasts'],
  ARRAY['Shorts', 'Reels', 'TikTok'],
  ARRAY['Citation must be verified and readable on mobile screens.'],
  ARRAY['TECHENIGMASTUDIOS', 'AI_THAT_WORKS', 'CONTXT_AHEAD'],
  'Here is the exact paper from Stanford that proves this. Bookmark this for your next architectural review.',
  ARRAY['REF-010']
)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Initial Sample Projects
INSERT INTO content_projects (id, brand_id, title, concept_name, status, target_platform, target_duration_seconds, target_audience_level, tags)
VALUES
(
  'TES-2026-001',
  'TECHENIGMASTUDIOS',
  'What is Feature Engineering and Why Does It Make or Break Machine Learning?',
  'Feature Engineering',
  'RESEARCH_COMPLETE',
  'YouTube Shorts',
  60,
  'Intermediate',
  ARRAY['Machine Learning', 'Data Science', 'Feature Engineering', 'Model Optimization']
),
(
  'ATW-2026-001',
  'AI_THAT_WORKS',
  'Automating Customer Support Triage with Local Multi-Agent LLMs',
  'Customer Support Agent Workflow',
  'INBOX',
  'Instagram Reels',
  60,
  'Intermediate',
  ARRAY['Customer Support', 'Agents', 'Enterprise AI', 'Automation']
),
(
  'CA-2026-001',
  'CONTXT_AHEAD',
  'The High-NA EUV Foundry War: ASML, TSMC, and the $400M Scanner',
  'High-NA EUV Lithography',
  'SCRIPT_DRAFT',
  'YouTube Shorts',
  60,
  'Executive / General',
  ARRAY['Semiconductors', 'ASML', 'TSMC', 'Geopolitics', 'Foundries']
)
ON CONFLICT (id) DO NOTHING;
