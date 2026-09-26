import apiClient from "./client";

// Backend topic values ↔ the labels your pages show
export const TOPICS = [
  { value: "period", label: "Menstrual Health" },
  { value: "pregnancy", label: "Pregnancy" },
  { value: "fertility", label: "Fertility" },
  { value: "wellness", label: "Wellness" },
  { value: "nutrition", label: "Nutrition" },
  { value: "mental_health", label: "Mental Wellbeing" },
  { value: "postpartum", label: "Postpartum" },
  { value: "general", label: "General" },
];

export const topicLabel = (value: string) => TOPICS.find((t) => t.value === value)?.label || "General";

export interface Author {
  id: string | null;
  name: string;
  role?: string;
  profile: { username: string | null; avatarUrl: string | null } | null;
  professionalProfile: { id: string; specialty: string; verificationStatus: string } | null;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  title: string | null;
  content: string;
  topic: string;
  isAnonymous: boolean;
  isProfessionalContent: boolean;
  supportCount: number;
  commentCount: number;
  createdAt: string;
  author: Author;
  isMine: boolean;
  isSupported: boolean;
}

export interface CommunityComment {
  id: string;
  postId: string;
  authorId: string;
  parentId: string | null;
  content: string;
  createdAt: string;
  author: Author;
  replies?: CommunityComment[];
}

// ---------- API calls (return just `data`) ----------

export const getPosts = async (params: { topic?: string; professional?: string; mine?: string } = {}) =>
  (await apiClient.get("/community/posts", { params: { limit: 100, ...params } })).data.data as {
    posts: CommunityPost[];
    total: number;
  };

export const createPost = async (input: {
  title: string;
  content: string;
  topic: string;
  isAnonymous: boolean;
  asProfessional?: boolean;
}) => (await apiClient.post("/community/posts", input)).data.data as CommunityPost;

export const deletePost = async (id: string) => apiClient.delete(`/community/posts/${id}`);

export const toggleSupport = async (id: string) =>
  (await apiClient.post(`/community/posts/${id}/support`)).data.data as { supported: boolean; supportCount: number };

export const getComments = async (postId: string): Promise<CommunityComment[]> =>
  (await apiClient.get(`/community/posts/${postId}/comments`)).data.data;

export const addComment = async (postId: string, content: string, parentId?: string): Promise<CommunityComment> =>
  (await apiClient.post(`/community/posts/${postId}/comments`, { content, ...(parentId && { parentId }) })).data.data;

export const deleteComment = async (id: string) => apiClient.delete(`/community/comments/${id}`);

export const getMyStats = async () =>
  (await apiClient.get("/community/me/stats")).data.data as { posts: number; supported: number; comments: number };

// ---------- Display helpers ----------

export const authorName = (a: Author) => (a.profile?.username ? `@${a.profile.username}` : a.name);

export const isVerifiedAuthor = (a: Author) => a.professionalProfile?.verificationStatus === "verified";

export const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

export const apiErrorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } }).response?.data?.message || fallback;