import apiClient from "./client";

export interface WeeklyTip {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  readTimeMinutes: number | null;
  lastFeaturedAt: string | null;
  category: { id: string; name: string; slug: string; icon: string | null } | null;
}

export interface AdminArticle {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  content?: string | null;
  categoryId: string | null;
  isPremium: boolean;
  isPublished: boolean;
  isWeeklyTip: boolean;
  lastFeaturedAt: string | null;
  views: number;
  sourceName: string | null;
  sourceUrl: string | null;
  createdAt: string;
  category: { id: string; name: string; icon: string | null } | null;
}

// Public — the dashboard banner
export const getWeeklyTip = async (): Promise<WeeklyTip | null> =>
  (await apiClient.get("/weekly-tip")).data.data;

// ---------- Admin article editor ----------

export const getAdminArticles = async (): Promise<AdminArticle[]> =>
  (await apiClient.get("/library/articles", { params: { limit: 100 } })).data.data.articles;

export const getArticleForEdit = async (slug: string) =>
  (await apiClient.get(`/library/articles/${slug}`)).data.data as AdminArticle;

export const createArticle = async (input: {
  title: string;
  categoryId: string;
  summary: string;
  content: string;
  isPremium: boolean;
  sourceName?: string;
  sourceUrl?: string;
}) => (await apiClient.post("/library/articles", input)).data.data as AdminArticle;

export const updateArticle = async (id: string, input: Partial<AdminArticle>) =>
  (await apiClient.put(`/library/articles/${id}`, input)).data.data as AdminArticle;

export const deleteArticle = async (id: string) => apiClient.delete(`/library/articles/${id}`);

// Make an article this week's tip and notify everyone who wants health tips
export const featureArticle = async (id: string) =>
  (await apiClient.put(`/admin/articles/${id}/feature`)).data as { message: string; data: { notified: number } };

export const apiErrorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } }).response?.data?.message || fallback;