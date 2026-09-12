import { Link } from "react-router-dom";
import { healthArticles } from "../../data/healthArticles";

function HealthSaved() {
  const savedIds: number[] = JSON.parse(
    localStorage.getItem("herbloomSavedArticles") || "[]"
  );

  const savedArticles = healthArticles.filter((article) =>
    savedIds.includes(article.id)
  );

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
        {savedArticles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">

            {savedArticles.map((article) => (
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
                    {article.author}
                  </p>
                </div>

                {/* Read */}
                <Link
                  to={`/health-library/articles/${article.id}`}
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

            <div className="text-5xl">
              🤍
            </div>

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

        {/* Information Notice */}
        <div className="mt-10 rounded-2xl border border-pink-100 bg-pink-50 p-6">

          <h2 className="font-bold text-gray-900">
            Your Saved Information
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Saved articles are currently stored on this
            device. You can open any saved article to view
            its brief information and original medical source.
          </p>

        </div>

      </div>
    </div>
  );
}

export default HealthSaved;