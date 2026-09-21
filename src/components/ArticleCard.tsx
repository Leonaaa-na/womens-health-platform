import { Link } from "react-router-dom";
import { type LibraryArticle, sourceLabel, sourceByline } from "../api/libraryApi";

interface ArticleCardProps {
  article: LibraryArticle;
  onRemove?: () => void; // shown on the Saved page
}

// Opens the original source in a new tab
const openSource = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

function ArticleCard({ article, onRemove }: ArticleCardProps) {
  return (
    <article className="flex flex-col rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      {/* Category + type */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-600">
          {article.category?.icon ? `${article.category.icon} ` : ""}
          {article.category?.name || "Health"}
        </span>
        <span className="text-xs text-gray-400">
          {article.isPremium ? "💎 Premium" : article.type}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold text-gray-900">{article.title}</h2>

      {/* Summary */}
      <p className="mt-3 flex-1 text-sm leading-6 text-gray-600">{article.summary}</p>

      {/* Source */}
      <div className="mt-5 rounded-lg bg-gray-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Medical Source</p>
        <p className="mt-1 text-sm font-semibold text-gray-800">{sourceLabel(article)}</p>
        {sourceByline(article) ? (
          <p className="mt-1 text-xs text-gray-500">{sourceByline(article)}</p>
        ) : null}
      </div>

      {/* Actions */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Link
          to={`/health-library/article/${article.slug}`}
          className="flex-1 rounded-lg bg-pink-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-pink-700"
        >
          Read Article
        </Link>

        {article.sourceUrl ? (
          <button
            type="button"
            onClick={() => openSource(article.sourceUrl as string)}
            className="rounded-lg border border-pink-600 px-4 py-2.5 text-center text-sm font-semibold text-pink-600 hover:bg-pink-50"
          >
            Source
          </button>
        ) : null}

        {onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50"
          >
            Remove
          </button>
        ) : null}
      </div>
    </article>
  );
}

export default ArticleCard;