import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories, type LibraryCategory } from "../../api/libraryApi";

function HealthCategories() {
  const [categories, setCategories] = useState<LibraryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setCategories(await getCategories());
      } catch {
        setError("Could not load categories.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10">
          <Link to="/health-library" className="text-sm font-semibold text-pink-600 hover:text-pink-700">
            ← Back to Health Library
          </Link>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-pink-600">Health Library</p>
          <h1 className="mt-2 text-4xl font-bold text-gray-900">Health Categories</h1>
          <p className="mt-3 max-w-3xl text-gray-600">
            Choose a health topic to explore reliable, easy-to-understand information.
          </p>
        </div>

        {error && <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>}

        {loading ? (
          <div className="py-16 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/health-library/articles?category=${encodeURIComponent(category.slug)}`}
                className="group rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-pink-50 text-3xl">
                  {category.icon || "📚"}
                </div>
                <h2 className="mt-5 text-lg font-bold text-gray-900 group-hover:text-pink-600">{category.name}</h2>
                <p className="mt-2 text-sm leading-6 text-gray-600">{category.description}</p>
                <p className="mt-4 text-xs font-semibold text-pink-600">
                  {category.articleCount} {category.articleCount === 1 ? "article" : "articles"}
                </p>
                <p className="mt-3 text-sm font-semibold text-gray-700">Explore →</p>
              </Link>
            ))}
          </div>
        )}

        {/* Important Topics */}
        <div className="mt-10 rounded-2xl border border-pink-100 bg-pink-50 p-6">
          <h2 className="text-xl font-bold text-gray-900">Special Focus Areas</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Pregnancy, mental wellbeing and postpartum care will receive additional attention with
            more detailed topics and carefully selected medical and personal experience sources.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HealthCategories;