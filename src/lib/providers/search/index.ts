import { ISearchProvider } from "./types";
import { TavilySearchProvider } from "./tavily";
import { SerperSearchProvider } from "./serper";
import { DuckDuckGoSearchProvider } from "./duckduckgo";

export * from "./types";

export function getSearchProvider(): ISearchProvider {
  const providerType = (process.env.SEARCH_PROVIDER || "duckduckgo").toLowerCase().trim();

  switch (providerType) {
    case "tavily":
      return new TavilySearchProvider();
    case "serper":
      return new SerperSearchProvider();
    case "duckduckgo":
    default:
      return new DuckDuckGoSearchProvider();
  }
}
