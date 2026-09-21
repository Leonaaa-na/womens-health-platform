import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  getPosts,
  createPost,
  deletePost,
  toggleSupport,
  topicLabel,
  authorName,
  isVerifiedAuthor,
  timeAgo,
  apiErrorMessage,
  TOPICS,
  type CommunityPost,
} from "../../api/communityApi";

export default function CommunityPosts() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState("general");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Reload whenever the topic filter changes
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const list = await getPosts(selectedTopic === "all" ? {} : { topic: selectedTopic });
        // Professional articles live on their own page
        setPosts(list.posts.filter((p) => !p.isProfessionalContent));
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedTopic]);

  const handleCreatePost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) {
      setMessage("Please add a title and your post.");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      const created = await createPost({ title: title.trim(), content: content.trim(), topic, isAnonymous });
      // Show it straight away (the create response has no author details yet)
      const refreshed = await getPosts(selectedTopic === "all" ? {} : { topic: selectedTopic });
      setPosts(refreshed.posts.filter((p) => !p.isProfessionalContent));

      setTitle("");
      setContent("");
      setTopic("general");
      setIsAnonymous(false);
      setShowForm(false);
      setMessage(created.isProfessionalContent ? "Published to Professional Health Content 🩺" : "Your post is live 🌸");
    } catch (error) {
      setMessage(apiErrorMessage(error, "Could not publish your post."));
    } finally {
      setSaving(false);
    }
  };

  const handleSupport = async (post: CommunityPost) => {
    // Update on screen first, undo if the server says no
    const optimistic = { isSupported: !post.isSupported, supportCount: post.supportCount + (post.isSupported ? -1 : 1) };
    setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, ...optimistic } : p)));

    try {
      const result = await toggleSupport(post.id);
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, isSupported: result.supported, supportCount: result.supportCount } : p))
      );
    } catch (error) {
      setPosts((prev) => prev.map((p) => (p.id === post.id ? post : p)));
      setMessage(apiErrorMessage(error, "Could not update support."));
    }
  };

  const handleDelete = async (post: CommunityPost) => {
    if (!window.confirm("Delete this post? This can't be undone.")) return;
    const previous = posts;
    setPosts((prev) => prev.filter((p) => p.id !== post.id));
    try {
      await deletePost(post.id);
    } catch (error) {
      setPosts(previous);
      setMessage(apiErrorMessage(error, "Could not delete post."));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-2xl">📝</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Community Discussions</h1>
              <p className="text-sm text-gray-600">Share experiences, ask questions, and support one another.</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setShowForm(!showForm)}
              className="rounded-xl bg-pink-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-700"
            >
              {showForm ? "✕ Cancel" : "✍🏾 Create a Post"}
            </button>
            <Link
              to="/community"
              className="rounded-xl border border-pink-200 bg-white px-5 py-3 text-center text-sm font-semibold text-pink-700 transition hover:bg-pink-50"
            >
              ← Back to Community
            </Link>
          </div>
        </div>

        {message ? (
          <div className="mb-6 rounded-xl bg-pink-50 p-3 text-center text-sm font-medium text-pink-700">{message}</div>
        ) : null}

        {/* Create Post Form */}
        {showForm ? (
          <div className="mb-8 rounded-2xl border border-pink-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">✍🏾 Create a Community Post</h2>
            <p className="mt-1 text-sm text-gray-500">Share something you'd like to discuss with the community.</p>

            <form onSubmit={handleCreatePost} className="mt-5 space-y-4">
              <div>
                <label htmlFor="post-title" className="mb-2 block text-sm font-semibold text-gray-700">Post title</label>
                <input
                  id="post-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What would you like to discuss?"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                />
              </div>

              <div>
                <label htmlFor="post-category" className="mb-2 block text-sm font-semibold text-gray-700">Category</label>
                <select
                  id="post-category"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                >
                  {TOPICS.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="post-content" className="mb-2 block text-sm font-semibold text-gray-700">Your post</label>
                <textarea
                  id="post-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your question, experience, or thoughts..."
                  rows={5}
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="h-4 w-4 accent-pink-600"
                />
                Post anonymously (your name won't be shown)
              </label>

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-pink-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pink-700 disabled:opacity-60"
              >
                {saving ? "Publishing..." : "Publish Post"}
              </button>
            </form>
          </div>
        ) : null}

        {/* Category Filter */}
        <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-bold text-gray-800">Browse by category</h2>
          <div className="flex flex-wrap gap-2">
            {[{ value: "all", label: "All" }, ...TOPICS].map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setSelectedTopic(t.value)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  selectedTopic === t.value ? "bg-pink-600 text-white" : "bg-pink-50 text-pink-700 hover:bg-pink-100"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Posts */}
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Discussions</h2>
            {!loading ? (
              <p className="mt-1 text-sm text-gray-500">
                {posts.length} {posts.length === 1 ? "post" : "posts"}
              </p>
            ) : null}
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-5">
              {posts.map((post) => (
                <article key={post.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 text-lg">
                      {post.isAnonymous ? "🕶️" : "👤"}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-gray-900">
                          {post.isMine && post.isAnonymous ? "You (anonymous)" : post.isMine ? "You" : authorName(post.author)}
                        </p>
                        {isVerifiedAuthor(post.author) ? (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">✓ Verified</span>
                        ) : null}
                      </div>
                      <p className="text-xs text-gray-500">{timeAgo(post.createdAt)}</p>
                    </div>
                    <span className="ml-auto rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                      {topicLabel(post.topic)}
                    </span>
                  </div>

                  {/* Post */}
                  <div className="mt-5">
                    {post.title ? <h3 className="text-lg font-bold text-gray-900">{post.title}</h3> : null}
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">{post.content}</p>
                  </div>

                  {/* Interactions */}
                  <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4">
                    <button
                      type="button"
                      onClick={() => handleSupport(post)}
                      className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                        post.isSupported ? "bg-pink-600 text-white" : "bg-pink-50 text-pink-700 hover:bg-pink-100"
                      }`}
                    >
                      {post.isSupported ? "❤️ Supported" : "🤍 Support"}
                    </button>

                    <span className="text-sm text-gray-500">
                      {post.supportCount} {post.supportCount === 1 ? "person" : "people"} support this
                    </span>

                    <div className="ml-auto flex gap-2">
                      {post.isMine ? (
                        <button
                          type="button"
                          onClick={() => handleDelete(post)}
                          className="rounded-xl border border-red-100 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                        >
                          Delete
                        </button>
                      ) : null}
                      <Link
                        to={`/community/comments?post=${post.id}`}
                        className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                      >
                        💬 {post.commentCount} Comments
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <div className="text-5xl">📝</div>
              <h3 className="mt-4 text-xl font-bold text-gray-900">No discussions found</h3>
              <p className="mt-2 text-sm text-gray-500">Try another category or create the first post.</p>
            </div>
          )}
        </div>

        {/* Reminder */}
        <div className="mt-8 rounded-2xl border border-purple-200 bg-purple-50 p-5">
          <h3 className="font-bold text-gray-900">💜 Community reminder</h3>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Support should be respectful and encouraging. Personal experiences are not a replacement for professional
            medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}