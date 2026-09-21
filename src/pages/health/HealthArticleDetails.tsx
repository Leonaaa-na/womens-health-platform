import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getArticle,
  toggleSaveArticle,
  apiErrorMessage,
  isUpgradeError,
  sourceLabel,
  sourceByline,
  type LibraryArticle,
} from "../../api/libraryApi";

// Opens the original source in a new tab
const openSource = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

function HealthArticleDetails() {
  // The route is /health-library/article/:id — the value is the article's slug
  const { id: slug } = useParams();

  const [article, setArticle] = useState<LibraryArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      try {
        setArticle(await getArticle(slug));
      } catch {
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  const handleSave = async () => {
    if (!article) return;
    setSaving(true);
    setMessage("");
    setShowUpgrade(false);
    try {
      const { saved } = await toggleSaveArticle(article.id);
      setArticle({ ...article, isSaved: saved });
      setMessage(saved ? "Saved to your library 🤍" : "Removed from saved");
    } catch (error) {
      setMessage(apiErrorMessage(error, "Could not save this article."));
      setShowUpgrade(isUpgradeError(error)); // hit the 5-article free limit
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-3xl">
          <Link to="/health-library" className="text-sm font-semibold text-pink-600 hover:text-pink-700">
            ← Back to Health Library
          </Link>
          <div className="mt-10 rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="text-5xl">📚</div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Article Not Found</h1>
            <p className="mt-3 text-gray-600">We couldn't find the health article you're looking for.</p>
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

  const backLink = article.category
    ? `/health-library/articles?category=${article.category.slug}`
    : "/health-library/articles";

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">

        <Link to={backLink} className="text-sm font-semibold text-pink-600 hover:text-pink-700">
          ← Back to {article.category?.name || "Health Articles"}
        </Link>

        <article className="mt-8 rounded-2xl bg-white p-6 shadow-sm sm:p-10">

          {/* Category + save */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-block rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-600">
              {article.category?.icon ? `${article.category.icon} ` : ""}
              {article.category?.name || "Health"}
            </span>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition disabled:opacity-60 ${
                article.isSaved ? "bg-pink-600 text-white" : "border border-pink-200 bg-white text-pink-600 hover:bg-pink-50"
              }`}
            >
              {article.isSaved ? "🤍 Saved" : "♡ Save"}
            </button>
          </div>

          {message ? (
            <div className="mt-4 rounded-xl bg-pink-50 p-3 text-sm font-medium text-pink-700">
              {message}
              {showUpgrade ? (
                <Link to="/premium/plans" className="ml-2 font-bold underline">
                  View Premium
                </Link>
              ) : null}
            </div>
          ) : null}

          <h1 className="mt-5 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">{article.title}</h1>

          <p className="mt-5 text-lg leading-8 text-gray-600">{article.summary}</p>

          {/* Source Information */}
          <div className="mt-8 rounded-xl bg-gray-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {article.type === "Personal Experience" ? "Personal Experience" : "Medical Source"}
            </p>
            <p className="mt-2 text-base font-bold text-gray-900">{sourceLabel(article)}</p>
            {sourceByline(article) ? (
              <p className="mt-1 text-sm text-gray-600">{sourceByline(article)}</p>
            ) : null}
            {article.readTimeMinutes ? (
              <p className="mt-1 text-xs text-gray-400">{article.readTimeMinutes} min read</p>
            ) : null}
          </div>

          {/* Content, or a lock card for premium articles */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900">About This Topic</h2>

            {article.locked ? (
              <div className="mt-5 rounded-2xl border border-purple-200 bg-purple-50 p-6 text-center">
                <p className="text-3xl">💎</p>
                <h3 className="mt-2 font-bold text-gray-900">This is Premium educational content</h3>
                <p className="mt-2 text-sm text-gray-600">Upgrade to HerBloom Premium to read the full article.</p>
                <Link
                  to="/premium/plans"
                  className="mt-4 inline-block rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white"
                >
                  View Premium Plans
                </Link>
              </div>
            ) : (
              <p className="mt-5 whitespace-pre-line text-base leading-8 text-gray-700">{article.content}</p>
            )}
          </div>

          {/* Source Link */}
          {article.sourceUrl ? (
            <div className="mt-10 border-t border-gray-100 pt-8">
              <h2 className="text-lg font-bold text-gray-900">Original Source</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Read the original information from {sourceLabel(article)}.
              </p>
              <button
                type="button"
                onClick={() => openSource(article.sourceUrl as string)}
                className="mt-5 inline-block rounded-xl bg-pink-600 px-5 py-3 text-sm font-semibold text-white hover:bg-pink-700"
              >
                Visit source
              </button>
            </div>
          ) : null}

          {/* Disclaimer */}
          <div className="mt-8 rounded-xl border border-pink-100 bg-pink-50 p-5">
            <p className="text-sm leading-6 text-gray-600">
              HerBloom's Health Library is for educational information. It does not replace advice,
              diagnosis or treatment from a qualified healthcare professional.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}

export default HealthArticleDetails;