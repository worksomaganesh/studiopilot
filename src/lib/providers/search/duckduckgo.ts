import { ISearchProvider, SearchProviderResponse, SearchQueryOptions } from "./types";

export class DuckDuckGoSearchProvider implements ISearchProvider {
  name = "duckduckgo";

  isConfigured(): boolean {
    return true; // DuckDuckGo operates without requiring a proprietary paid API key
  }

  async search(options: SearchQueryOptions): Promise<SearchProviderResponse> {
    try {
      // Use DuckDuckGo HTML search endpoint with sanitized query
      const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(options.query)}`;
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });

      if (!response.ok) {
        return {
          provider: this.name,
          query: options.query,
          results: [],
          isConfigured: true,
          error: `DuckDuckGo returned HTTP ${response.status}`,
        };
      }

      const html = await response.text();
      const results: { title: string; url: string; snippet: string; source: string }[] = [];
      const max = options.maxResults || 5;

      // Split HTML by result body containers
      const blocks = html.split(/class="[^"]*result__body[^"]*"/);

      for (let i = 1; i < blocks.length && results.length < max; i++) {
        const block = blocks[i];

        // Match result anchor and snippet
        const titleMatch = /<a[^>]*class="[^"]*result__a[^"]*"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i.exec(block);
        const snippetMatch = /<a[^>]*class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/i.exec(block);

        if (titleMatch) {
          const rawHref = titleMatch[1];
          let linkUrl = "";

          // Extract destination URL from DuckDuckGo redirect wrapper: uddg=URL
          const uddgMatch = /uddg=([^&]+)/.exec(rawHref);
          if (uddgMatch && uddgMatch[1]) {
            try {
              linkUrl = decodeURIComponent(uddgMatch[1]);
            } catch {
              linkUrl = uddgMatch[1];
            }
          } else if (rawHref.startsWith("http")) {
            linkUrl = rawHref;
          }

          const rawTitle = titleMatch[2].replace(/<[^>]+>/g, "").trim();
          const cleanTitle = rawTitle
            .replace(/&amp;/g, "&")
            .replace(/&#x27;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">");

          const rawSnippet = snippetMatch ? snippetMatch[1].replace(/<[^>]+>/g, "").trim() : "";
          const cleanSnippet = rawSnippet
            .replace(/&amp;/g, "&")
            .replace(/&#x27;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">");

          if (linkUrl && linkUrl.startsWith("http")) {
            try {
              const hostname = new URL(linkUrl).hostname.replace("www.", "");
              results.push({
                title: cleanTitle || "Source Document",
                url: linkUrl,
                snippet: cleanSnippet,
                source: hostname,
              });
            } catch {
              // Ignore invalid URLs
            }
          }
        }
      }

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
        error: `Search error: ${msg}`,
      };
    }
  }
}
