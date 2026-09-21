import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getPosts,
  topicLabel,
  isVerifiedAuthor,
  timeAgo,
  TOPICS,
  type CommunityPost,
} from "../../api/communityApi";

export default function ProfessionalHealthContent() {
  const [articles, setArticles] = useState<CommunityPost[]>([]);
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState<CommunityPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // Posts written by verified professionals
        const list = await getPosts({ professional: "true" });
        setArticles(list.posts);
      } catch {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Only show filter chips for topics that actually have articles
  const usedTopics = TOPICS.filter((t) => articles.some((a) => a.topic === t.value));
  const filteredArticles = selectedTopic === "all" ? articles : articles.filter((a) => a.topic === selectedTopic);

  const summaryOf = (a: CommunityPost) => (a.content.length > 160 ? `${a.content.slice(0, 160)}…` : a.content);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-2xl">🩺</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Professional Health Content</h1>
              <p className="text-sm text-gray-600">Learn from health content created by healthcare professionals.</p>
            </div>
          </div>
          <Link
            to="/community"
            className="inline-block rounded-xl border border-pink-200 bg-white px-5 py-3 text-sm font-semibold text-pink-700 transition hover:bg-pink-50"
          >
            ← Back to Community
          </Link>
        </div>

        {/* Verified Notice */}
        <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-5">
          <div className="flex gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <h2 className="font-bold text-gray-900">Verified healthcare professionals</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Only professionals verified by HerBloom can publish here. When a verified professional posts in the
                community, it appears on this page automatically.
              </p>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-bold text-gray-800">Browse by category</h2>
          <div className="flex flex-wrap gap-2">
            {[{ value: "all", label: "All" }, ...usedTopics].map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setSelectedTopic(t.value)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  selectedTopic === t.value ? "bg-purple-600 text-white" : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Articles */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">Health Articles</h2>
          {!loading ? (
            <p className="mt-1 text-sm text-gray-500">
              {filteredArticles.length} {filteredArticles.length === 1 ? "article" : "articles"}
            </p>
          ) : null}
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-100 text-xl">👩🏾‍⚕️</div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-gray-900">{article.author.name}</p>
                      {isVerifiedAuthor(article.author) ? (
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700">✓ Verified</span>
                      ) : null}
                    </div>
                    <p className="text-xs text-gray-500">{article.author.professionalProfile?.specialty || "Healthcare professional"}</p>
                  </div>
                </div>

                <div className="mt-5">
                  <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-700">
                    {topicLabel(article.topic)}
                  </span>
                  <h3 className="mt-4 text-xl font-bold text-gray-900">{article.title || "Health update"}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{summaryOf(article)}</p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-xs text-gray-400">{timeAgo(article.createdAt)}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedArticle(article)}
                    className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
                  >
                    Read Article
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="text-5xl">🩺</div>
            <h3 className="mt-4 text-xl font-bold text-gray-900">No articles found</h3>
            <p className="mt-2 text-sm text-gray-500">Try selecting another category.</p>
          </div>
        )}

        {/* Medical Notice */}
        <div className="mt-8 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
          <h3 className="font-bold text-gray-900">⚠️ Important</h3>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Professional health content is for general education and does not replace an individual medical assessment
            or professional healthcare advice.
          </p>
        </div>
      </div>

      {/* Article Modal */}
      {selectedArticle ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-700">
                    {topicLabel(selectedArticle.topic)}
                  </span>
                  {isVerifiedAuthor(selectedArticle.author) ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">✓ Verified Professional</span>
                  ) : null}
                </div>
                <h2 className="mt-4 text-2xl font-bold text-gray-900">{selectedArticle.title || "Health update"}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="rounded-full bg-gray-100 px-3 py-2 text-gray-600 transition hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 rounded-2xl bg-purple-50 p-4">
              <p className="font-bold text-gray-900">{selectedArticle.author.name}</p>
              <p className="text-sm text-gray-600">{selectedArticle.author.professionalProfile?.specialty || "Healthcare professional"}</p>
            </div>

            <div className="mt-6">
              <p className="whitespace-pre-wrap text-base leading-8 text-gray-700">{selectedArticle.content}</p>
            </div>

            <p className="mt-6 text-xs text-gray-400">
              Published {new Date(selectedArticle.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to={`/community/comments?post=${selectedArticle.id}`}
                className="flex-1 rounded-xl border border-purple-600 px-5 py-3 text-center text-sm font-semibold text-purple-700 hover:bg-purple-50"
              >
                💬 Discuss ({selectedArticle.commentCount})
              </Link>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="flex-1 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}