import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ArticleCard from "../../components/ArticleCard";
import {
  getArticles,
  getCategories,
  type LibraryArticle,
  type LibraryCategory,
} from "../../api/libraryApi";

function HealthLibrary() {
  const navigate = useNavigate();

  const [articles, setArticles] = useState<LibraryArticle[]>([]);
  const [categories, setCategories] = useState<LibraryCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all"); // category slug
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [list, cats] = await Promise.all([getArticles(), getCategories()]);
        setArticles(list.articles);
        setCategories(cats);
      } catch {
        setError("Could not load the Health Library. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Filter on the page so typing feels instant
  const filteredArticles = useMemo(() => {
    const value = search.trim().toLowerCase();
    return articles.filter((a) => {
      const matchesCategory = selectedCategory === "all" || a.category?.slug === selectedCategory;
      const matchesSearch =
        !value ||
        a.title.toLowerCase().includes(value) ||
        (a.summary || "").toLowerCase().includes(value) ||
        (a.category?.name || "").toLowerCase().includes(value) ||
        (a.sourceName || "").toLowerCase().includes(value);
      return matchesCategory && matchesSearch;
    });
  }, [articles, selectedCategory, search]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate("/period-tracker")}
            className="mb-5 text-sm font-medium text-pink-600 hover:text-pink-700"
          >
            ← Back to Dashboard
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Health Library</h1>
              <p className="mt-2 max-w-3xl text-gray-600">
                Reliable health information to help you learn, understand your body and prepare for
                conversations with healthcare professionals.
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                to="/health-library/categories"
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                📂 Categories
              </Link>
              <Link
                to="/health-library/saved"
                className="rounded-xl border border-pink-200 bg-white px-4 py-2 text-sm font-semibold text-pink-600 hover:bg-pink-50"
              >
                🤍 Saved
              </Link>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search health articles..."
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pl-11 text-sm outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔎</span>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex min-w-max gap-2">
            {[{ slug: "all", name: "All" }, ...categories].map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => setSelectedCategory(c.slug)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedCategory === c.slug
                    ? "bg-pink-600 text-white"
                    : "bg-white text-gray-600 shadow-sm hover:bg-pink-50 hover:text-pink-600"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>}

        {loading ? (
          <div className="py-16 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
            <p className="mt-3 text-sm text-gray-500">Loading articles...</p>
          </div>
        ) : (
          <>
            <p className="mb-5 text-sm text-gray-500">
              {filteredArticles.length} {filteredArticles.length === 1 ? "article" : "articles"} found
            </p>

            {filteredArticles.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
                <div className="text-4xl">📚</div>
                <h2 className="mt-4 text-xl font-bold text-gray-900">No articles found</h2>
                <p className="mt-2 text-sm text-gray-500">Try another search term or choose a different category.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("all");
                  }}
                  className="mt-5 rounded-xl bg-pink-600 px-5 py-3 text-sm font-semibold text-white hover:bg-pink-700"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}

        {/* Information Notice */}
        <div className="mt-10 rounded-2xl border border-pink-100 bg-pink-50 p-6">
          <h2 className="text-lg font-bold text-gray-900">About HerBloom's Health Library</h2>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            HerBloom's Health Library is designed to help you learn and prepare for conversations
            with healthcare professionals. Medical articles identify their original sources, and
            personal experiences are clearly labelled as personal stories rather than medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HealthLibrary;