# StudioPilot Provider Setup & Integration Guide

## 1. AI Model Provider (Google Gemini API)

StudioPilot uses Google Gemini via an extensible abstraction (`src/lib/providers/ai/`).

### Configuration Steps:
1. Obtain an API key from [Google AI Studio](https://aistudio.google.com).
2. Add the key to `.env.local`:
   ```bash
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   ```
3. When the key is configured, Research Studio performs multi-source synthesis, and Script Studio generates dynamic hook variations and scene breakdowns.
4. When unconfigured, the application runs using deterministic brand adapter engines and presents clear status indicators without failing.

---

## 2. Web Search Provider (Research Studio)

StudioPilot uses a pluggable search engine abstraction (`src/lib/providers/search/`).

### Provider Options:
1. **DuckDuckGo Search (Default / Free)**:
   - Configured by default (`SEARCH_PROVIDER=duckduckgo`).
   - Requires zero API keys; allows immediate live web searches out of the box.
2. **Tavily Search**:
   - Best for research depth and structured web crawling.
   - Set in `.env.local`:
     ```bash
     SEARCH_PROVIDER=tavily
     TAVILY_API_KEY=tvly-your_key_here
     ```
3. **Google Serper**:
   - Google Search API wrapper.
   - Set in `.env.local`:
     ```bash
     SEARCH_PROVIDER=serper
     SERPER_API_KEY=your_serper_key_here
     ```

---

## 3. DaVinci Resolve & Remotion

- **DaVinci Resolve**: Export `.EDL` (Edit Decision List) and `.CSV` timeline manifests directly from Editing Studio. Import them into DaVinci Resolve Studio to conform tracks automatically.
- **Remotion**: Scaffolding JSON configurations and React component references are generated alongside the editing plan.
