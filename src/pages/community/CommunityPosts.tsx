import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

interface CommunityPost {
  id: number;
  author: string;
  category: string;
  title: string;
  content: string;
  date: string;
  likes: number;
}

const initialPosts: CommunityPost[] = [
  {
    id: 1,
    author: "Ama",
    category: "Menstrual Health",
    title: "How do you manage period discomfort?",
    content:
      "I would love to hear what healthy habits help other women feel more comfortable during their period.",
    date: "Today",
    likes: 12,
  },
  {
    id: 2,
    author: "Esi",
    category: "Pregnancy",
    title: "What helped you prepare for pregnancy?",
    content:
      "I am interested in hearing about people's experiences with preparing for pregnancy and appointments.",
    date: "Yesterday",
    likes: 8,
  },
  {
    id: 3,
    author: "Nana",
    category: "Wellness",
    title: "How do you make time for self-care?",
    content:
      "School and work can get busy. What simple wellness habits have worked for you?",
    date: "2 days ago",
    likes: 15,
  },
];

const categories = [
  "All",
  "Menstrual Health",
  "Pregnancy",
  "Fertility",
  "Wellness",
  "Nutrition",
  "Mental Wellbeing",
  "General",
];

export default function CommunityPosts() {
  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    const savedPosts = localStorage.getItem("herbloomCommunityPosts");

    if (savedPosts) {
      return JSON.parse(savedPosts);
    }

    return initialPosts;
  });

  const [supportedPosts, setSupportedPosts] = useState<number[]>(() => {
    const savedSupports = localStorage.getItem(
      "herbloomSupportedPosts"
    );

    if (savedSupports) {
      return JSON.parse(savedSupports);
    }

    return [];
  });

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");

  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  const savePosts = (updatedPosts: CommunityPost[]) => {
    setPosts(updatedPosts);

    localStorage.setItem(
      "herbloomCommunityPosts",
      JSON.stringify(updatedPosts)
    );
  };

  const handleCreatePost = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      return;
    }

    const newPost: CommunityPost = {
      id: Date.now(),
      author: "You",
      category,
      title: title.trim(),
      content: content.trim(),
      date: "Just now",
      likes: 0,
    };

    savePosts([newPost, ...posts]);

    setTitle("");
    setContent("");
    setCategory("General");
    setShowForm(false);
  };

  const handleSupport = (postId: number) => {
    const hasSupported = supportedPosts.includes(postId);

    const updatedPosts = posts.map((post) => {
      if (post.id !== postId) {
        return post;
      }

      return {
        ...post,
        likes: hasSupported
          ? Math.max(0, post.likes - 1)
          : post.likes + 1,
      };
    });

    const updatedSupportedPosts = hasSupported
      ? supportedPosts.filter((id) => id !== postId)
      : [...supportedPosts, postId];

    savePosts(updatedPosts);

    setSupportedPosts(updatedSupportedPosts);

    localStorage.setItem(
      "herbloomSupportedPosts",
      JSON.stringify(updatedSupportedPosts)
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-2xl">
              📝
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Community Discussions
              </h1>

              <p className="text-sm text-gray-600">
                Share experiences, ask questions, and support one another.
              </p>
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

        {/* Create Post Form */}
        {showForm && (
          <div className="mb-8 rounded-2xl border border-pink-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              ✍🏾 Create a Community Post
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Share something you'd like to discuss with the community.
            </p>

            <form
              onSubmit={handleCreatePost}
              className="mt-5 space-y-4"
            >
              <div>
                <label
                  htmlFor="post-title"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Post title
                </label>

                <input
                  id="post-title"
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="What would you like to discuss?"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                />
              </div>

              <div>
                <label
                  htmlFor="post-category"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Category
                </label>

                <select
                  id="post-category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                >
                  {categories
                    .filter((item) => item !== "All")
                    .map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="post-content"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Your post
                </label>

                <textarea
                  id="post-content"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder="Write your question, experience, or thoughts..."
                  rows={5}
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                />
              </div>

              <button
                type="submit"
                className="rounded-xl bg-pink-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pink-700"
              >
                Publish Post
              </button>
            </form>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-bold text-gray-800">
            Browse by category
          </h2>

          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSelectedCategory(item)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  selectedCategory === item
                    ? "bg-pink-600 text-white"
                    : "bg-pink-50 text-pink-700 hover:bg-pink-100"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Posts */}
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Discussions
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {filteredPosts.length}{" "}
              {filteredPosts.length === 1 ? "post" : "posts"}
            </p>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="space-y-5">
              {filteredPosts.map((post) => {
                const isSupported = supportedPosts.includes(post.id);

                return (
                  <article
                    key={post.id}
                    className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                  >
                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 text-lg">
                        👤
                      </div>

                      <div>
                        <p className="font-semibold text-gray-900">
                          {post.author}
                        </p>

                        <p className="text-xs text-gray-500">
                          {post.date}
                        </p>
                      </div>

                      <span className="ml-auto rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                        {post.category}
                      </span>
                    </div>

                    {/* Post */}
                    <div className="mt-5">
                      <h3 className="text-lg font-bold text-gray-900">
                        {post.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        {post.content}
                      </p>
                    </div>

                    {/* Interactions */}
                    <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4">

                      <button
                        type="button"
                        onClick={() => handleSupport(post.id)}
                        className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                          isSupported
                            ? "bg-pink-600 text-white"
                            : "bg-pink-50 text-pink-700 hover:bg-pink-100"
                        }`}
                      >
                        {isSupported ? "❤️ Supported" : "🤍 Support"}
                      </button>

                      <span className="text-sm text-gray-500">
                        {post.likes}{" "}
                        {post.likes === 1 ? "person" : "people"} support this
                      </span>

                      <Link
                        to="/community/comments"
                        className="ml-auto rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                      >
                        💬 Comments
                      </Link>

                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <div className="text-5xl">📝</div>

              <h3 className="mt-4 text-xl font-bold text-gray-900">
                No discussions found
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Try another category or create the first post.
              </p>
            </div>
          )}
        </div>

        {/* Reminder */}
        <div className="mt-8 rounded-2xl border border-purple-200 bg-purple-50 p-5">
          <h3 className="font-bold text-gray-900">
            💜 Community reminder
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Support should be respectful and encouraging. Personal
            experiences are not a replacement for professional medical
            advice.
          </p>
        </div>

      </div>
    </div>
  );
}