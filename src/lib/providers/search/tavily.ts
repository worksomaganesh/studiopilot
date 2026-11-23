import { ISearchProvider, SearchProviderResponse, SearchQueryOptions } from "./types";

export class TavilySearchProvider implements ISearchProvider {
  name = "tavily";

  isConfigured(): boolean {
    return Boolean(process.env.TAVILY_API_KEY && process.env.TAVILY_API_KEY.trim().length > 0);
  }

  async search(options: SearchQueryOptions): Promise<SearchProviderResponse> {
    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) {
      return {
        provider: this.name,
        query: options.query,
        results: [],
        isConfigured: false,
        error: "Tavily API key is not configured. Set TAVILY_API_KEY in .env.local to enable real web search.",
      };
    }

    try {
      const response = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: apiKey,
          query: options.query,
          max_results: options.maxResults || 5,
          search_depth: "advanced",
          include_raw_content: Boolean(options.includeRawContent),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          provider: this.name,
          query: options.query,
          results: [],
          isConfigured: true,
          error: `Tavily API returned HTTP ${response.status}: ${errorText}`,
        };
      }

      const data = await response.json();
      const results = (data.results || []).map((r: { title: string; url: string; content?: string; score?: number }) => ({
        title: r.title || "Untitled",
        url: r.url,
        snippet: r.content || "",
        score: r.score,
        source: new URL(r.url).hostname.replace("www.", ""),
      }));

      return {
        provider: this.name,
        query: options.query,
        results,
        isConfigured: true,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        provider: this.name,
        query: options.query,
        results: [],
        isConfigured: true,
        error: `Failed to connect to Tavily: ${msg}`,
      };
    }
  }
}
