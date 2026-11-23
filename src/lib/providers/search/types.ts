export interface SearchResultItem {
  title: string;
  url: string;
  snippet: string;
  publishedDate?: string;
  source?: string;
  score?: number;
}

export interface SearchQueryOptions {
  query: string;
  maxResults?: number;
  includeRawContent?: boolean;
}

export interface SearchProviderResponse {
  provider: string;
  query: string;
  results: SearchResultItem[];
  error?: string;
  isConfigured: boolean;
}

export interface ISearchProvider {
  name: string;
  isConfigured(): boolean;
  search(options: SearchQueryOptions): Promise<SearchProviderResponse>;
}
