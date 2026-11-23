import { ISearchProvider, SearchProviderResponse, SearchQueryOptions } from "./types";

export class SerperSearchProvider implements ISearchProvider {
  name = "serper";

  isConfigured(): boolean {
    return Boolean(process.env.SERPER_API_KEY && process.env.SERPER_API_KEY.trim().length > 0);
  }

  async search(options: SearchQueryOptions): Promise<SearchProviderResponse> {
    const apiKey = process.env.SERPER_API_KEY;
    if (!apiKey) {
      return {
        provider: this.name,
        query: options.query,
        results: [],
        isConfigured: false,
        error: "Serper API key is not configured. Set SERPER_API_KEY in .env.local to enable Google web search.",
      };
    }

    try {
      const response = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: options.query,
          num: options.maxResults || 5,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          provider: this.name,
          query: options.query,
          results: [],
          isConfigured: true,
          error: `Serper API returned HTTP ${response.status}: ${errorText}`,
        };
      }

      const data = await response.json();
      const organic = data.organic || [];
      const results = organic.map((r: { title: string; link: string; snippet?: string; date?: string }) => ({
        title: r.title || "Untitled",
        url: r.link,
        snippet: r.snippet || "",
        publishedDate: r.date,
        source: new URL(r.link).hostname.replace("www.", ""),
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
        error: `Failed to connect to Serper: ${msg}`,
      };
    }
  }
}
