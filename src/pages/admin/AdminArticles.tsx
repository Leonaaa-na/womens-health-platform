import { useCallback, useEffect, useState } from "react";
import {
  getAdminArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  featureArticle,
  apiErrorMessage,
  type AdminArticle,
} from "../../api/weeklyTipApi";
import { getCategories, type LibraryCategory } from "../../api/libraryApi";

const EMPTY = { title: "", categoryId: "", summary: "", content: "", isPremium: false, sourceName: "", sourceUrl: "" };

function AdminArticles() {
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [categories, setCategories] = useState<LibraryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [featureAfterSave, setFeatureAfterSave] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [list, cats] = await Promise.all([getAdminArticles(), getCategories()]);
      setArticles(list);
      setCategories(cats);
    } catch (error) {
      setMessage(apiErrorMessage(error, "Could not load articles."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const set = (key: keyof typeof EMPTY, value: string | boolean) => setForm((prev) => ({ ...prev, [key]: value }));

  const publish = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.content.trim() || !form.categoryId) {
      setMessage("Title, category and body are all needed.");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      const created = await createArticle({
        title: form.title.trim(),
        categoryId: form.categoryId,
        summary: form.summary.trim(),
        content: form.content.trim(),
        isPremium: form.isPremium,
        sourceName: form.sourceName.trim() || undefined,
        sourceUrl: form.sourceUrl.trim() || undefined,
      });

      if (featureAfterSave && !form.isPremium) {
        const result = await featureArticle(created.id);
        setMessage(result.message);
      } else {
        setMessage("Article published 🌸");
      }

      setForm(EMPTY);
      setFeatureAfterSave(false);
      setShowForm(false);
      load();
    } catch (error) {
      setMessage(apiErrorMessage(error, "Could not publish that article."));
    } finally {
      setSaving(false);
    }
  };

  const makeWeeklyTip = async (article: AdminArticle) => {
    if (!window.confirm(`Make "${article.title}" this week's tip? Everyone who wants health tips gets a notification.`)) return;
    try {
      const result = await featureArticle(article.id);
      setMessage(result.message);
      load();
    } catch (error) {
      setMessage(apiErrorMessage(error, "Could not feature that article."));
    }
  };

  const togglePublished = async (article: AdminArticle) => {
    setArticles((prev) => prev.map((a) => (a.id === article.id ? { ...a, isPublished: !a.isPublished } : a)));
    try {
      await updateArticle(article.id, { isPublished: !article.isPublished });
    } catch (error) {
      setArticles((prev) => prev.map((a) => (a.id === article.id ? article : a)));
      setMessage(apiErrorMessage(error, "Could not update that article."));
    }
  };

  const remove = async (article: AdminArticle) => {
    if (!window.confirm(`Delete "${article.title}"? This can't be undone.`)) return;
    const previous = articles;
    setArticles((prev) => prev.filter((a) => a.id !== article.id));
    try {
      await deleteArticle(article.id);
    } catch (error) {
      setArticles(previous);
      setMessage(apiErrorMessage(error, "Could not delete that article."));
    }
  };

  const current = articles.find((a) => a.isWeeklyTip);
  const inputClass =
    "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100";

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">📰 Health Articles</h2>
          <p className="text-sm text-gray-500">Publish articles and choose the weekly health tip.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-xl bg-pink-600 px-5 py-3 text-sm font-semibold text-white hover:bg-pink-700"
        >
          {showForm ? "✕ Cancel" : "✍🏾 Write an article"}
        </button>
      </div>

      {message ? <div className="mb-5 rounded-xl bg-pink-50 p-4 text-sm font-medium text-pink-700">{message}</div> : null}

      {/* Current tip */}
      <div className="mb-6 rounded-2xl border border-purple-200 bg-purple-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">This week's health tip</p>
        {current ? (
          <>
            <p className="mt-2 text-lg font-bold text-gray-900">{current.title}</p>
            <p className="mt-1 text-xs text-gray-500">
              {current.category?.name} · featured{" "}
              {current.lastFeaturedAt ? new Date(current.lastFeaturedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "—"}
            </p>
          </>
        ) : (
          <p className="mt-2 text-sm text-gray-600">
            None yet. Pick one below, or leave it — the system features one automatically every Monday at 9am.
          </p>
        )}
      </div>

      {/* Write form */}
      {showForm ? (
        <form onSubmit={publish} className="mb-8 space-y-4 rounded-2xl border border-pink-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900">New article</h3>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Title</label>
            <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Understanding period pain" className={inputClass} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Category</label>
              <select value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)} className={inputClass}>
                <option value="">Choose a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Source <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <input type="text" value={form.sourceName} onChange={(e) => set("sourceName", e.target.value)} placeholder="e.g. World Health Organization" className={inputClass} />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Source link <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <input type="url" value={form.sourceUrl} onChange={(e) => set("sourceUrl", e.target.value)} placeholder="https://www.who.int/..." className={inputClass} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Summary</label>
            <textarea value={form.summary} onChange={(e) => set("summary", e.target.value)} rows={2} placeholder="One or two sentences shown on the card" className={`${inputClass} resize-none`} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Article</label>
            <textarea value={form.content} onChange={(e) => set("content", e.target.value)} rows={10} placeholder="Write the article here. Keep it educational — remind readers to see a professional for personal advice." className={`${inputClass} resize-none`} />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={form.isPremium} onChange={(e) => set("isPremium", e.target.checked)} className="h-4 w-4 accent-purple-600" />
            💎 Premium only
          </label>

          <label className={`flex items-center gap-2 text-sm ${form.isPremium ? "text-gray-400" : "text-gray-600"}`}>
            <input
              type="checkbox"
              checked={featureAfterSave && !form.isPremium}
              disabled={form.isPremium}
              onChange={(e) => setFeatureAfterSave(e.target.checked)}
              className="h-4 w-4 accent-pink-600"
            />
            🌸 Send as this week's health tip {form.isPremium ? "(not available for Premium articles)" : "— notifies everyone who wants tips"}
          </label>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-pink-600 px-6 py-3 text-sm font-semibold text-white hover:bg-pink-700 disabled:opacity-60"
          >
            {saving ? "Publishing..." : "Publish article"}
          </button>
        </form>
      ) : null}

      {/* Articles list */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
        </div>
      ) : articles.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <div className="text-4xl">📰</div>
          <p className="mt-3 text-gray-500">No articles yet. Write the first one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((a) => (
            <div key={a.id} className={`rounded-2xl bg-white p-5 shadow-sm ${a.isWeeklyTip ? "ring-2 ring-purple-300" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-gray-900">{a.title}</h3>
                    {a.isWeeklyTip ? (
                      <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-bold text-purple-700">🌸 This week's tip</span>
                    ) : null}
                    {a.isPremium ? (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">💎 Premium</span>
                    ) : null}
                    {!a.isPublished ? (
                      <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-700">Hidden</span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {a.category?.name || "No category"} · {a.views} views
                    {a.lastFeaturedAt ? ` · last featured ${new Date(a.lastFeaturedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}` : ""}
                  </p>
                  {a.summary ? <p className="mt-2 line-clamp-2 text-sm text-gray-600">{a.summary}</p> : null}
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  {!a.isWeeklyTip && a.isPublished && !a.isPremium ? (
                    <button
                      onClick={() => makeWeeklyTip(a)}
                      className="rounded-lg bg-purple-100 px-3 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-200"
                    >
                      Make weekly tip
                    </button>
                  ) : null}
                  <button
                    onClick={() => togglePublished(a)}
                    className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-200"
                  >
                    {a.isPublished ? "Hide" : "Publish"}
                  </button>
                  <button
                    onClick={() => remove(a)}
                    className="rounded-lg px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-600">
        💡 Every Monday at 9am the system features an article automatically, choosing one that hasn't been featured before.
        So the app always has something new, even in a week you don't publish.
      </div>
    </div>
  );
}

export default AdminArticles;