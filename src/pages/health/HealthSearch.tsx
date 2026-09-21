import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ArticleCard from "../../components/ArticleCard";
import { getArticles, apiErrorMessage, type LibraryArticle } from "../../api/libraryApi";

function HealthSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("q") || "";

  const [searchInput, setSearchInput] = useState(initialSearch);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [articles, setArticles] = useState<LibraryArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await getArticles(searchTerm.trim() ? { search: searchTerm.trim() } : {});
        setArticles(list.articles);
      } catch (err) {
        setError(apiErrorMessage(err, "Unable to load articles."));
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [searchTerm]);

  const handleSearch = () => {
    const search = searchInput.trim();
    setSearchTerm(search);
    setSearchParams(search ? { q: search } : {});
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <Link to="/health-library" className="text-sm font-semibold text-pink-600 transition hover:text-pink-700">
            ← Back to Health Library
          </Link>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-pink-600">Health Library</p>
          <h1 className="mt-2 text-4xl font-bold text-gray-900">Search Health Information</h1>
          <p className="mt-3 max-w-2xl text-gray-600">
            Search trusted health information by topic, category, article or medical source.
          </p>
        </div>

        {/* Search Box */}
        <div className="mb-10 rounded-2xl bg-white p-6 shadow-sm">
          <label htmlFor="health-search" className="mb-3 block text-sm font-semibold text-gray-700">
            What would you like to learn about?
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="health-search"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
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

        {error && <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>}

        {/* Results */}
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{searchTerm ? "Search Results" : "Health Articles"}</h2>
            {searchTerm && <p className="mt-1 text-sm text-gray-500">Results for "{searchTerm}"</p>}
          </div>
          <span className="text-sm text-gray-500">
            {articles.length} {articles.length === 1 ? "result" : "results"}
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
            <p className="mt-3 text-sm text-gray-500">Searching articles...</p>
          </div>
        ) : articles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="text-5xl">🔎</div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">No Results Found</h2>
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

        {/* Information Notice */}
        <div className="mt-10 rounded-2xl border border-pink-100 bg-pink-50 p-6">
          <h2 className="font-bold text-gray-900">About our articles</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            HerBloom's Health Library provides educational information connected to reliable,
            verifiable medical sources. Original authors and sources are identified where available.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HealthSearch;