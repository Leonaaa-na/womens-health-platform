import { Link, useParams } from "react-router-dom";
import { healthArticles } from "../../data/healthArticles";

function HealthArticleDetails() {
  const { id } = useParams();

  const article = healthArticles.find(
    (item) => item.id === Number(id)
  );

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/health-library"
            className="text-sm font-semibold text-pink-600 hover:text-pink-700"
          >
            ← Back to Health Library
          </Link>

          <div className="mt-10 rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="text-5xl">📚</div>

            <h1 className="mt-4 text-2xl font-bold text-gray-900">
              Article Not Found
            </h1>

            <p className="mt-3 text-gray-600">
              We couldn't find the health article you're looking for.
            </p>

            <Link
              to="/health-library"
              className="mt-6 inline-block rounded-xl bg-pink-600 px-5 py-3 text-sm font-semibold text-white hover:bg-pink-700"
            >
              Back to Health Library
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        {/* Back */}
        <Link
          to="/health-library/articles?category="
          className="text-sm font-semibold text-pink-600 hover:text-pink-700"
        >
          ← Back to Health Articles
        </Link>

        {/* Article */}
        <article className="mt-8 rounded-2xl bg-white p-6 shadow-sm sm:p-10">
          {/* Category */}
          <span className="inline-block rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-600">
            {article.category}
          </span>

          {/* Title */}
          <h1 className="mt-5 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            {article.title}
          </h1>

          {/* Summary */}
          <p className="mt-5 text-lg leading-8 text-gray-600">
            {article.summary}
          </p>

          {/* Source Information */}
          <div className="mt-8 rounded-xl bg-gray-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Medical Source
            </p>

            <p className="mt-2 text-base font-bold text-gray-900">
              {article.source}
            </p>

            <p className="mt-1 text-sm text-gray-600">
              {article.author} · {article.publishedDate}
            </p>
          </div>

          {/* Content */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900">
              About This Topic
            </h2>

            <p className="mt-5 whitespace-pre-line text-base leading-8 text-gray-700">
              {article.content}
            </p>
          </div>

          {/* Source Link */}
          <div className="mt-10 border-t border-gray-100 pt-8">
            <h2 className="text-lg font-bold text-gray-900">
              Original Source
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Read the original information from the World Health
              Organization.
            </p>

            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block rounded-xl bg-pink-600 px-5 py-3 text-sm font-semibold text-white hover:bg-pink-700"
            >
              Visit {article.source} ↗️
            </a>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 rounded-xl border border-pink-100 bg-pink-50 p-5">
            <p className="text-sm leading-6 text-gray-600">
              HerBloom's Health Library is for educational
              information. It does not replace advice, diagnosis or
              treatment from a qualified healthcare professional.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}

export default HealthArticleDetails;