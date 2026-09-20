import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../api/client";

interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: { name: string };
  author: { name: string };
  createdAt: string;
}

function HealthSaved() {
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSaved = async () => {
      try {
        const response = await apiClient.get<Article[]>(
          "/library/saved"
        );
        if (response.data.success) {
          setSavedArticles(response.data.data || []);
        }
      } catch {
        setSavedArticles([]);
      } finally {
        setLoading(false);
      }
    };

    loadSaved();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        {/* Back */}
        <Link
          to="/health-library"
          className="text-sm font-semibold text-pink-600 hover:text-pink-700"
        >
          ← Back to Health Library
        </Link>

        {/* Header */}
        <div className="mb-10 mt-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-pink-600">
            Health Library
          </p>
          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            Saved Articles
          </h1>
          <p className="mt-3 max-w-3xl text-gray-600">
            View the health articles you saved for later.
          </p>
        </div>

        {/* Saved Articles */}
        {loading ? (
          <div className="text-center py-12">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
            <p className="mt-3 text-sm text-gray-500">Loading saved articles...</p>
          </div>
        ) : savedArticles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {savedArticles.map((article) => (
              <article
                key={article.id}
                className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <span className="inline-block rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-600">
                  {article.category?.name || "Health"}
                </span>
                <h2 className="mt-5 text-xl font-bold text-gray-900">
                  {article.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {article.summary}
                </p>
                <div className="mt-5 rounded-lg bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Medical Source
                  </p>
                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {article.author?.name || "HerBloom Medical Team"}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Published: {new Date(article.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Link
                  to={`/health-library/articles/${article.slug}`}
                  className="mt-5 inline-block font-semibold text-pink-600 hover:text-pink-700"
                >
                  Read Article →
                </Link>
              </article>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="text-5xl">🤍</div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              No Saved Articles
            </h2>
            <p className="mx-auto mt-3 max-w-md text-gray-600">
              You haven't saved any health articles yet.
              When you find something useful, save it here
              so you can easily come back to it later.
            </p>
            <Link
              to="/health-library/articles"
              className="mt-6 inline-block rounded-lg bg-pink-600 px-5 py-3 font-semibold text-white hover:bg-pink-700"
            >
              Browse Articles
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default HealthSaved;
