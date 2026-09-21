import apiClient from "./client";

export interface LibraryCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  articleCount: number;
}

export interface LibraryArticle {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  content?: string | null; // not included in list views
  type: "Medical Article" | "Personal Experience";
  sourceName: string | null;
  sourceAuthor: string | null;
  sourceUrl: string | null;
  publishedYear: string | null;
  isPremium: boolean;
  readTimeMinutes: number | null;
  category: { id: string; name: string; slug: string; icon: string | null } | null;
  author: { id: string; name: string } | null;
  createdAt: string;
  isSaved?: boolean; // detail view only
  locked?: boolean; // premium article, free user
}

export interface ArticleList {
  articles: LibraryArticle[];
  total: number;
  page: number;
  pages: number;
}

// Backend wraps everything in { success, message, data } — these return just `data`

export const getCategories = async (): Promise<LibraryCategory[]> =>
  (await apiClient.get("/library/categories")).data.data;

export const getArticles = async (params: {
  category?: string;
  search?: string;
  limit?: number;
} = {}): Promise<ArticleList> =>
  (await apiClient.get("/library/articles", { params: { limit: 100, ...params } })).data.data;

export const getArticle = async (slug: string): Promise<LibraryArticle> =>
  (await apiClient.get(`/library/articles/${slug}`)).data.data;

export const toggleSaveArticle = async (id: string): Promise<{ saved: boolean }> =>
  (await apiClient.post(`/library/articles/${id}/save`)).data.data;

export const getSavedArticles = async (): Promise<LibraryArticle[]> =>
  (await apiClient.get("/library/saved")).data.data;

// Helpers

export const sourceLabel = (a: LibraryArticle) =>
  a.sourceName || a.author?.name || "HerBloom Medical Team";

export const sourceByline = (a: LibraryArticle) =>
  [a.sourceAuthor, a.publishedYear].filter(Boolean).join(" · ");

export const apiErrorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } }).response?.data?.message || fallback;

export const isUpgradeError = (error: unknown) =>
  !!(error as { response?: { data?: { upgradeRequired?: boolean } } }).response?.data?.upgradeRequired;