import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ArticleCard from "../../components/ArticleCard";
import { getArticles, getCategories, type LibraryArticle } from "../../api/libraryApi";

function HealthArticles() {
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get("category") || "";

  const [articles, setArticles] = useState<LibraryArticle[]>([]);
  const [categoryName, setCategoryName] = useState("Health Articles");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [list, cats] = await Promise.all([
          getArticles(categorySlug ? { category: categorySlug } : {}),
          getCategories(),
        ]);
        setArticles(list.articles);
        setCategoryName(
          categorySlug ? cats.find((c) => c.slug === categorySlug)?.name || "Health Articles" : "Health Articles"
        );
      } catch {
        setError("Could not load articles.");
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [categorySlug]);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">

        <Link to="/health-library/categories" className="text-sm font-semibold text-pink-600 hover:text-pink-700">
          ← Back to Categories
        </Link>

        {/* Header */}
        <div className="mb-10 mt-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-pink-600">Health Library</p>
          <h1 className="mt-2 text-4xl font-bold text-gray-900">{categoryName}</h1>
          <p className="mt-3 max-w-3xl text-gray-600">
            {categorySlug
              ? `Explore reliable information about ${categoryName}.`
              : "Explore brief health information from reliable medical sources."}
          </p>
        </div>

        {error && <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>}

        {loading ? (
          <div className="py-16 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
          </div>
        ) : articles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="text-5xl">📚</div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">No Articles Found</h2>
            <p className="mx-auto mt-3 max-w-md text-gray-600">We don't have an article for this category yet.</p>
            <Link
              to="/health-library/categories"
              className="mt-6 inline-block rounded-lg bg-pink-600 px-5 py-3 font-semibold text-white hover:bg-pink-700"
            >
              Browse Categories
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default HealthArticles;