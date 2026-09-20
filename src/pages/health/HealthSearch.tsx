import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiClient } from "../../api/client";

interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  author: {
    id: string;
    name: string;
  };
  createdAt: string;
}

interface ArticlesResponse {
  articles: Article[];
  total: number;
  page: number;
  pages: number;
}

interface ApiError {
  message?: string;
}

function HealthSearch() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get("q") || "";

  const [searchInput, setSearchInput] =
    useState(initialSearch);

  const [searchTerm, setSearchTerm] =
    useState(initialSearch);

  const [articles, setArticles] =
    useState<Article[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      setError(null);

      try {
        const params: Record<string, string> = {};

        if (searchTerm.trim()) {
          params.search = searchTerm.trim();
        }

        const response =
          await apiClient.get<ArticlesResponse>(
            "/library/articles",
            { params }
          );

        setArticles(
          Array.isArray(response.data.articles)
            ? response.data.articles
            : []
        );
      } catch (err: unknown) {
        const apiError = err as {
          response?: {
            data?: ApiError;
          };
          message?: string;
        };

        setError(
          apiError.response?.data?.message ||
            apiError.message ||
            "Unable to load articles."
        );

        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, [searchTerm]);

  const handleSearch = () => {
    const search = searchInput.trim();

    setSearchTerm(search);

    if (search) {
      setSearchParams({ q: search });
    } else {
      setSearchParams({});
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    setSearchParams({});
    setArticles([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">

          <Link
            to="/health-library"
            className="text-sm font-semibold text-pink-600 transition hover:text-pink-700"
          >
            ← Back to Health Library
          </Link>

          <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-pink-600">
            Health Library
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            Search Health Information
          </h1>

          <p className="mt-3 max-w-2xl text-gray-600">
            Search trusted health information by topic,
            category, article or medical source.
          </p>

        </div>

        {/* Search Box */}
        <div className="mb-10 rounded-2xl bg-white p-6 shadow-sm">

          <label
            htmlFor="health-search"
            className="mb-3 block text-sm font-semibold text-gray-700"
          >
            What would you like to learn about?
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">

            <input
              id="health-search"
              type="text"
              value={searchInput}
              onChange={(event) =>
                setSearchInput(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="Search pregnancy, fertility, nutrition..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
            />

            <button
              type="button"
              onClick={handleSearch}
              className="rounded-lg bg-pink-600 px-7 py-3 font-semibold text-white transition hover:bg-pink-700"
            >
              🔎 Search
            </button>

          </div>

          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="mt-3 text-sm font-semibold text-gray-500 transition hover:text-pink-600"
            >
              Clear Search
            </button>
          )}

        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Results */}
        <div>

          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="text-2xl font-bold text-gray-900">
                {searchTerm
                  ? "Search Results"
                  : "Health Articles"}
              </h2>

              {searchTerm && (
                <p className="mt-1 text-sm text-gray-500">
                  Results for "{searchTerm}"
                </p>
              )}

            </div>

            <span className="text-sm text-gray-500">
              {articles.length}{" "}
              {articles.length === 1
                ? "result"
                : "results"}
            </span>

          </div>

          {/* Loading */}
          {loading ? (
            <div className="py-12 text-center">

              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>

              <p className="mt-3 text-sm text-gray-500">
                Searching articles...
              </p>

            </div>

          ) : articles.length > 0 ? (

            /* Articles */
            <div className="grid gap-6 md:grid-cols-2">

              {articles.map((article) => (

                <article
                  key={article.id}
                  className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >

                  {/* Category */}
                  <span className="inline-block rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-600">
                    {article.category?.name || "Health"}
                  </span>

                  {/* Title */}
                  <h3 className="mt-4 text-xl font-bold text-gray-900">
                    {article.title}
                  </h3>

                  {/* Summary */}
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    {article.summary}
                  </p>

                  {/* Source */}
                  <div className="mt-5 rounded-lg bg-gray-50 p-4">

                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Medical Source
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {article.author?.name ||
                        "HerBloom Medical Team"}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {article.createdAt
                        ? new Date(
                            article.createdAt
                          ).toLocaleDateString()
                        : ""}
                    </p>

                  </div>

                  {/* Read Article */}
                  <Link
                    to={`/health-library/articles/${article.slug}`}
                    className="mt-5 inline-block font-semibold text-pink-600 transition hover:text-pink-700"
                  >
                    Read Article →
                  </Link>

                </article>

              ))}

            </div>

          ) : (

            /* No Results */
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">

              <div className="text-5xl">🔎</div>

              <h2 className="mt-4 text-2xl font-bold text-gray-900">
                No Results Found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-gray-600">
                {searchTerm
                  ? `We couldn't find any health information matching "${searchTerm}".`
                  : "No health articles are available right now."}
              </p>

              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="mt-6 rounded-lg bg-pink-600 px-5 py-3 font-semibold text-white transition hover:bg-pink-700"
                >
                  Clear Search
                </button>
              )}

            </div>

          )}

        </div>

        {/* Information Notice */}
        <div className="mt-10 rounded-2xl border border-pink-100 bg-pink-50 p-6">

          <h2 className="font-bold text-gray-900">
            About our articles
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            HerBloom's Health Library provides educational
            information connected to reliable, verifiable
            medical sources. Original authors and sources
            are identified where available.
          </p>

        </div>

      </div>
    </div>
  );
}

export default HealthSearch;