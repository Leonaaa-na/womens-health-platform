import { Link, useSearchParams } from "react-router-dom";
import { healthArticles } from "../../data/healthArticles";

function HealthArticles() {
  const [searchParams] = useSearchParams();

  const categorySlug = searchParams.get("category");

  const articles = categorySlug
    ? healthArticles.filter(
        (article) => article.categorySlug === categorySlug
      )
    : healthArticles;

  const categoryName =
    articles.length > 0
      ? articles[0].category
      : categorySlug
        ? categorySlug
            .split("-")
            .map(
              (word) =>
                word.charAt(0).toUpperCase() + word.slice(1)
            )
            .join(" ")
        : "Health Articles";

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        {/* Back */}
        <Link
          to="/health-library/categories"
          className="text-sm font-semibold text-pink-600 hover:text-pink-700"
        >
          ← Back to Categories
        </Link>

        {/* Header */}
        <div className="mb-10 mt-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-pink-600">
            Health Library
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            {categoryName}
          </h1>

          <p className="mt-3 max-w-3xl text-gray-600">
            {categorySlug
              ? `Explore reliable information about ${categoryName}.`
              : "Explore brief health information from reliable medical sources."}
          </p>
        </div>

        {/* Articles */}
        {articles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {articles.map((article) => (
              <article
                key={article.id}
                className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {/* Category */}
                <span className="inline-block rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-600">
                  {article.category}
                </span>

                {/* Title */}
                <h2 className="mt-5 text-xl font-bold text-gray-900">
                  {article.title}
                </h2>

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
                    {article.source}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {article.author} · {article.publishedDate}
                  </p>
                </div>

                {/* Buttons */}
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to={`/health-library/article/${article.id}`}
                    className="rounded-lg bg-pink-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-pink-700"
                  >
                    Read Article
                  </Link>

                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-pink-600 px-4 py-2.5 text-center text-sm font-semibold text-pink-600 hover:bg-pink-50"
                  >
                    Source ↗️
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="text-5xl">📚</div>

            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              No Articles Found
            </h2>

            <p className="mx-auto mt-3 max-w-md text-gray-600">
              We don't have an article for this category yet.
            </p>

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