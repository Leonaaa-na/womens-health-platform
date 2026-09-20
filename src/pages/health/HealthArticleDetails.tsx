import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import apiClient from "../../api/client";

interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string | null;
  isPremium: boolean;
  locked: boolean;
  views: number;
  isSaved: boolean;
  category: { name: string };
  author: { name: string };
  createdAt: string;
}

function HealthArticleDetails() {
  const { id: slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchArticle = async () => {
      try {
        const response = await apiClient.get<Article>(
          `/library/articles/${slug}`
        );
        if (response.data.success) {
          const data = response.data.data;
          setArticle(data);
          setIsSaved(data.isSaved || false);
        }
      } catch {
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  const handleSaveArticle = async () => {
    if (!article) return;
    try {
      await apiClient.post(`/library/articles/${article.id}/save`);
      setIsSaved(!isSaved);
    } catch {
      // Premium gate or error — ignore for now
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
          <p className="mt-4 text-sm font-medium text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Article Not Found
          </h1>
          <p className="mt-3 text-gray-600">
            Sorry, we could not find the article you are looking for.
          </p>
          <Link
            to="/health-library/articles"
            className="mt-6 inline-block rounded-lg bg-pink-600 px-5 py-3 font-semibold text-white transition hover:bg-pink-700"
          >
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  const displayContent = article.locked ? article.summary : article.content;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        {/* Back */}
        <Link
          to="/health-library/articles"
          className="text-sm font-semibold text-pink-600 hover:text-pink-700"
        >
          ← Back to Articles
        </Link>

        {/* Article Header */}
        <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
          {/* Category */}
          <span className="inline-block rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-600">
            {article.category?.name || "Health"}
          </span>

          {/* Title */}
          <h1 className="mt-5 text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
            {article.title}
          </h1>

          {/* Premium lock */}
          {article.locked && (
            <div className="mt-4 rounded-xl bg-gradient-to-r from-pink-100 to-purple-100 p-4 text-center">
              <span className="text-sm font-semibold text-pink-700">
                👑 Premium Article — upgrade to read the full content
              </span>
            </div>
          )}

          {/* Summary */}
          <p className="mt-4 text-lg leading-7 text-gray-600">
            {article.summary}
          </p>

          {/* Source Information */}
          <div className="mt-6 rounded-xl bg-gray-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Medical Source
            </p>
            <p className="mt-2 font-semibold text-gray-900">
              {article.author?.name || "HerBloom Medical Team"}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Published: {new Date(article.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleSaveArticle}
              className={`rounded-lg border px-5 py-3 font-semibold transition ${
                isSaved
                  ? "border-pink-600 bg-pink-50 text-pink-600"
                  : "border-pink-600 text-pink-600 hover:bg-pink-50"
              }`}
            >
              {isSaved ? "❤️ Saved Article" : "♡ Save Article"}
            </button>
          </div>
        </div>

        {/* Article Content */}
        <article className="mt-6 rounded-2xl bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-pink-600">
            {article.locked ? "Brief Information" : "Article Content"}
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {article.locked ? "About This Topic" : "Read On"}
          </h2>

          <p className="mt-4 leading-7 text-gray-600">
            {displayContent || "No content available."}
          </p>

          {/* Disclaimer */}
          <div className="mt-8 rounded-xl bg-gray-50 p-5">
            <h3 className="font-bold text-gray-900">Important</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              This information is provided for educational
              purposes only. It does not replace advice,
              diagnosis or treatment from a qualified
              healthcare professional.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}

export default HealthArticleDetails;
