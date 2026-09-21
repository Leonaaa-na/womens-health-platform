import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArticleCard from "../../components/ArticleCard";
import {
  getSavedArticles,
  toggleSaveArticle,
  apiErrorMessage,
  type LibraryArticle,
} from "../../api/libraryApi";

function HealthSaved() {
  const [savedArticles, setSavedArticles] = useState<LibraryArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setSavedArticles(await getSavedArticles());
      } catch {
        setSavedArticles([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Saving is a toggle, so calling it on a saved article removes it
  const removeSaved = async (article: LibraryArticle) => {
    const previous = savedArticles;
    setSavedArticles((prev) => prev.filter((a) => a.id !== article.id));
    try {
      await toggleSaveArticle(article.id);
    } catch (error) {
      setSavedArticles(previous);
      setMessage(apiErrorMessage(error, "Could not remove article."));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">

        <Link to="/health-library" className="text-sm font-semibold text-pink-600 hover:text-pink-700">
          ← Back to Health Library
        </Link>

        <div className="mb-10 mt-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-pink-600">Health Library</p>
          <h1 className="mt-2 text-4xl font-bold text-gray-900">Saved Articles</h1>
          <p className="mt-3 max-w-3xl text-gray-600">View the health articles you saved for later.</p>
        </div>

        {message && <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">{message}</div>}

        {loading ? (
          <div className="py-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
            <p className="mt-3 text-sm text-gray-500">Loading saved articles...</p>
          </div>
        ) : savedArticles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {savedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} onRemove={() => removeSaved(article)} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="text-5xl">🤍</div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">No Saved Articles</h2>
            <p className="mx-auto mt-3 max-w-md text-gray-600">
              You haven't saved any health articles yet. When you find something useful, tap Save on
              the article so you can easily come back to it later.
            </p>
            <Link
              to="/health-library"
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