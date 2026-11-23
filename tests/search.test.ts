import { describe, it, expect } from "vitest";
import { TavilySearchProvider } from "../src/lib/providers/search/tavily";
import { SerperSearchProvider } from "../src/lib/providers/search/serper";
import { DuckDuckGoSearchProvider } from "../src/lib/providers/search/duckduckgo";
import { getSearchProvider } from "../src/lib/providers/search";

describe("Search Provider Abstraction & Providers", () => {
  it("should return Tavily provider when configured", () => {
    const orig = process.env.SEARCH_PROVIDER;
    process.env.SEARCH_PROVIDER = "tavily";
    const provider = getSearchProvider();
    expect(provider.name).toBe("tavily");
    process.env.SEARCH_PROVIDER = orig;
  });

  it("should return Serper provider when configured", () => {
    const orig = process.env.SEARCH_PROVIDER;
    process.env.SEARCH_PROVIDER = "serper";
    const provider = getSearchProvider();
    expect(provider.name).toBe("serper");
    process.env.SEARCH_PROVIDER = orig;
  });

  it("should return DuckDuckGo provider by default", () => {
    const orig = process.env.SEARCH_PROVIDER;
    delete process.env.SEARCH_PROVIDER;
    const provider = getSearchProvider();
    expect(provider.name).toBe("duckduckgo");
    expect(provider.isConfigured()).toBe(true);
    process.env.SEARCH_PROVIDER = orig;
  });

  it("should return a clean configuration error when Tavily is invoked without an API key", async () => {
    const origKey = process.env.TAVILY_API_KEY;
    delete process.env.TAVILY_API_KEY;
    const tavily = new TavilySearchProvider();
    expect(tavily.isConfigured()).toBe(false);

    const res = await tavily.search({ query: "Quantum Computing" });
    expect(res.isConfigured).toBe(false);
    expect(res.results.length).toBe(0);
    expect(res.error).toContain("Tavily API key is not configured");
    process.env.TAVILY_API_KEY = origKey;
  });

  it("should return a clean configuration error when Serper is invoked without an API key", async () => {
    const origKey = process.env.SERPER_API_KEY;
    delete process.env.SERPER_API_KEY;
    const serper = new SerperSearchProvider();
    expect(serper.isConfigured()).toBe(false);

    const res = await serper.search({ query: "Deep Learning" });
    expect(res.isConfigured).toBe(false);
    expect(res.results.length).toBe(0);
    expect(res.error).toContain("Serper API key is not configured");
    process.env.SERPER_API_KEY = origKey;
  });

  it("should handle DuckDuckGo provider execution gracefully", async () => {
    const ddg = new DuckDuckGoSearchProvider();
    expect(ddg.name).toBe("duckduckgo");
    expect(ddg.isConfigured()).toBe(true);

    const res = await ddg.search({ query: "Transformers architecture in deep learning", maxResults: 3 });
    expect(res.provider).toBe("duckduckgo");
    expect(res.query).toBe("Transformers architecture in deep learning");
    expect(Array.isArray(res.results)).toBe(true);
  });
});
