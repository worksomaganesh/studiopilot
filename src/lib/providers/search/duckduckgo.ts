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

      // Regex parser for DuckDuckGo HTML search result anchors and snippets
      const resultBlockRegex = /<div class="result__body">([\s\S]*?)<\/div>/g;
      let match;
      const max = options.maxResults || 5;

      while ((match = resultBlockRegex.exec(html)) !== null && results.length < max) {
        const block = match[1];

        // Extract URL and Title
        const linkMatch = /<a class="result__url" href="([^"]+)">/i.exec(block);
        const titleMatch = /<a class="result__snippet[^>]*>([\s\S]*?)<\/a>/i.exec(block) ||
                           /<a class="result__a[^>]*>([\s\S]*?)<\/a>/i.exec(block);
        const snippetMatch = /<a class="result__snippet[^>]*>([\s\S]*?)<\/a>/i.exec(block);

        let linkUrl = "";
        if (linkMatch && linkMatch[1]) {
          const rawHref = linkMatch[1];
          // Handle duckduckgo redirect wrapper: //duckduckgo.com/l/?uddg=URL
          const uddgMatch = /uddg=([^&]+)/.exec(rawHref);
          if (uddgMatch && uddgMatch[1]) {
            linkUrl = decodeURIComponent(uddgMatch[1]);
          } else if (rawHref.startsWith("http")) {
            linkUrl = rawHref;
          }
        }

        const cleanTitle = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, "").trim() : "Result";
        const cleanSnippet = snippetMatch ? snippetMatch[1].replace(/<[^>]+>/g, "").trim() : "";

        if (linkUrl && linkUrl.startsWith("http")) {
          try {
            const hostname = new URL(linkUrl).hostname.replace("www.", "");
            results.push({
              title: cleanTitle,
              url: linkUrl,
              snippet: cleanSnippet,
              source: hostname,
            });
          } catch {
            // Skip invalid URL
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
