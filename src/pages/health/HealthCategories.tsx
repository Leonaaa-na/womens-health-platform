import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient, { ApiErrorResponse } from "../../api/client";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: "fallback-1", name: "Menstrual Health", slug: "menstrual-health", description: "Learn about periods, menstrual health and cycle wellbeing.", icon: "🩸" },
  { id: "fallback-2", name: "Pregnancy", slug: "pregnancy", description: "Reliable information about pregnancy and maternal health.", icon: "🤰🏾" },
  { id: "fallback-3", name: "Fertility", slug: "fertility", description: "Explore fertility and reproductive health information.", icon: "🌱" },
  { id: "fallback-4", name: "Nutrition", slug: "nutrition", description: "Learn about healthy eating and nutritional wellbeing.", icon: "🥗" },
  { id: "fallback-5", name: "Mental Wellbeing", slug: "mental-wellbeing", description: "Explore mental and emotional wellbeing.", icon: "🧠" },
  { id: "fallback-6", name: "Sleep", slug: "sleep", description: "Learn about healthy sleep and rest.", icon: "🌙" },
  { id: "fallback-7", name: "Wellness & Exercise", slug: "wellness-exercise", description: "Explore physical activity and healthy lifestyle information.", icon: "🏃🏾‍♀️" },
  { id: "fallback-8", name: "Postpartum", slug: "postpartum", description: "Learn about recovery, care and wellbeing after childbirth.", icon: "👶🏾" },
];

function HealthCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [articleCounts, setArticleCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get<Category[]>("/library/categories");
        const fetched = response.data.success ? response.data.data || [] : [];
        setCategories(fetched.length ? fetched : DEFAULT_CATEGORIES);

        const counts: Record<string, number> = {};
        for (const cat of fetched.length ? fetched : DEFAULT_CATEGORIES) {
          try {
            const articlesResponse = await apiClient.get<{ total: number }>(
              "/library/articles",
              { params: { category: cat.slug, limit: 1 } }
            );
            if (articlesResponse.data.success) {
              counts[cat.slug] = articlesResponse.data.data?.total || 0;
            } else {
              counts[cat.slug] = 0;
            }
          } catch {
            counts[cat.slug] = 0;
          }
        }
        setArticleCounts(counts);
      } catch (err: unknown) {
        const apiError = err as { response?: { data?: ApiErrorResponse } };
        setError(apiError?.response?.data?.message || "Unable to load categories.");
        setCategories(DEFAULT_CATEGORIES);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <Link
            to="/health-library"
            className="text-sm font-semibold text-pink-600 hover:text-pink-700"
          >
            ← Back to Health Library
          </Link>

          <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-pink-600">
            Health Library
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            Health Categories
          </h1>

          <p className="mt-3 max-w-3xl text-gray-600">
            Choose a health topic to explore reliable,
            easy-to-understand information.
          </p>
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-600">{error}</p>
        )}

        {/* Categories */}
        {loading ? (
          <div className="text-center py-12">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
            <p className="mt-3 text-sm text-gray-500">Loading categories...</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => {
              const articleCount = articleCounts[category.slug] || 0;

              return (
                <Link
                  key={category.id}
                  to={`/health-library/articles?category=${encodeURIComponent(category.slug)}`}
                  className="group rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-pink-50 text-3xl">
                    {category.icon || "📚"}
                  </div>

                  <h2 className="mt-5 text-lg font-bold text-gray-900 group-hover:text-pink-600">
                    {category.name}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {category.description || "Reliable women's health information."}
                  </p>

                  <p className="mt-4 text-xs font-semibold text-pink-600">
                    {articleCount} {articleCount === 1 ? "article" : "articles"}
                  </p>

                  <p className="mt-3 text-sm font-semibold text-gray-700">
                    Explore →
                  </p>
                </Link>
              );
            })}
          </div>
        )}

        {/* Important Topics */}
        <div className="mt-10 rounded-2xl border border-pink-100 bg-pink-50 p-6">
          <h2 className="text-xl font-bold text-gray-900">
            Special Focus Areas
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Pregnancy, mental wellbeing and postpartum care
            will receive additional attention with more
            detailed topics and carefully selected medical
            and personal experience sources.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HealthCategories;
