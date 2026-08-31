import { Link, useParams } from "react-router-dom";
import { healthArticles } from "../../data/healthArticles";

function HealthArticleDetails() {
  const { id } = useParams();

  const article = healthArticles.find(
    (item) => item.id === Number(id)
  );

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">

          <h1 className="text-3xl font-bold text-gray-900">
            Article Not Found
          </h1>

          <p className="mt-3 text-gray-600">
            Sorry, we could not find the article you are
            looking for.
          </p>

          <Link
            to="/health-library/articles"
            className="mt-6 inline-block rounded-lg bg-pink-600 px-5 py-3 font-semibold text-white"
          >
            Back to Articles
          </Link>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">

        {/* Back */}
        <Link
          to="/health-library/articles"
          className="text-sm font-semibold text-pink-600 hover:text-pink-700"
        >
          ← Back to Articles
        </Link>

        {/* Article Header */}
        <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">

          {/* Category */}
          <span className="inline-block rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-600">
            {article.category}
          </span>

          {/* Title */}
          <h1 className="mt-5 text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
            {article.title}
          </h1>

          {/* Summary */}
          <p className="mt-4 text-lg leading-7 text-gray-600">
            {article.summary}
          </p>

          {/* Source Information */}
          <div className="mt-6 rounded-xl bg-gray-50 p-5">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Medical Source
            </p>

            <p className="mt-2 font-semibold text-gray-900">
              {article.source}
            </p>

            <p className="mt-1 text-sm text-gray-600">
              {article.author}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Published: {article.publishedDate}
            </p>

          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">

            <button
              type="button"
              className="rounded-lg border border-pink-600 px-5 py-3 font-semibold text-pink-600 transition hover:bg-pink-50"
            >
              ❤️ Save Article
            </button>

            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-pink-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-pink-700"
            >
              Read Original Source →
            </a>

          </div>

        </div>

        {/* Brief Article */}
        <article className="mt-6 rounded-2xl bg-white p-8 shadow-sm">

          <p className="text-sm font-semibold uppercase tracking-wide text-pink-600">
            Brief Information
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            About This Topic
          </h2>

          <p className="mt-4 leading-7 text-gray-600">
            {article.content}
          </p>

          {/* More Information */}
          <div className="mt-8 rounded-xl border border-pink-100 bg-pink-50 p-6">

            <h3 className="font-bold text-gray-900">
              Want to learn more?
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              This is a brief educational overview. For
              detailed information, visit the original
              medical source.
            </p>

            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block font-semibold text-pink-600 hover:text-pink-700"
            >
              View Original Medical Source →
            </a>

          </div>

          {/* Disclaimer */}
          <div className="mt-8 rounded-xl bg-gray-50 p-5">

            <h3 className="font-bold text-gray-900">
              Important
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              This information is provided for educational
              purposes only. It does not replace advice,
              diagnosis or treatment from a qualified
              healthcare professional.
            </p>

          </div>

        </article>

      </div>
    </div>
  );
}

export default HealthArticleDetails;