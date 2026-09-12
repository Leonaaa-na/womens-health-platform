import { useState } from "react";
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

interface CommunityComment {
  id: number;
  postId: number;
  author: string;
  content: string;
  date: string;
  replies: CommunityReply[];
}

interface CommunityReply {
  id: number;
  author: string;
  content: string;
  date: string;
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

export default function CommunityComments() {
  const [posts] = useState<CommunityPost[]>(() => {
    const savedPosts = localStorage.getItem("herbloomCommunityPosts");

    if (savedPosts) {
      return JSON.parse(savedPosts);
    }

    return initialPosts;
  });

  const [comments, setComments] = useState<CommunityComment[]>(() => {
    const savedComments = localStorage.getItem(
      "herbloomCommunityComments"
    );

    if (savedComments) {
      return JSON.parse(savedComments);
    }

    return [];
  });

  const [activePostId, setActivePostId] = useState<number | null>(
    posts.length > 0 ? posts[0].id : null
  );

  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const saveComments = (updatedComments: CommunityComment[]) => {
    setComments(updatedComments);

    localStorage.setItem(
      "herbloomCommunityComments",
      JSON.stringify(updatedComments)
    );
  };

  const handleAddComment = () => {
    if (!commentText.trim() || activePostId === null) {
      return;
    }

    const newComment: CommunityComment = {
      id: Date.now(),
      postId: activePostId,
      author: "You",
      content: commentText.trim(),
      date: "Just now",
      replies: [],
    };

    saveComments([...comments, newComment]);
    setCommentText("");
  };

  const handleAddReply = (commentId: number) => {
    if (!replyText.trim()) {
      return;
    }

    const newReply: CommunityReply = {
      id: Date.now(),
      author: "You",
      content: replyText.trim(),
      date: "Just now",
    };

    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...comment.replies, newReply],
        };
      }

      return comment;
    });

    saveComments(updatedComments);
    setReplyText("");
    setReplyingTo(null);
  };

  const activePost = posts.find((post) => post.id === activePostId);

  const activeComments = comments.filter(
    (comment) => comment.postId === activePostId
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-2xl">
              💬
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Comments & Replies
              </h1>

              <p className="text-sm text-gray-600">
                Join the conversation and support your community.
              </p>
            </div>
          </div>

          <Link
            to="/community/posts"
            className="inline-block rounded-xl border border-pink-200 bg-white px-5 py-3 text-sm font-semibold text-pink-700 transition hover:bg-pink-50"
          >
            ← Back to Discussions
          </Link>
        </div>

        {/* Main Layout */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Posts */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-gray-900">
                Discussions
              </h2>

              <div className="space-y-3">
                {posts.map((post) => (
                  <button
                    key={post.id}
                    type="button"
                    onClick={() => {
                      setActivePostId(post.id);
                      setReplyingTo(null);
                    }}
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      activePostId === post.id
                        ? "border-pink-400 bg-pink-50"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-700">
                        {post.category}
                      </span>

                      <span className="text-xs text-gray-400">
                        {post.date}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-900">
                      {post.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-500">
                      {post.content}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Selected Post + Comments */}
          <div className="lg:col-span-2">
            {activePost ? (
              <>
                {/* Selected Post */}
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                      👤
                    </div>

                    <div>
                      <p className="font-semibold text-gray-900">
                        {activePost.author}
                      </p>

                      <p className="text-xs text-gray-500">
                        {activePost.date}
                      </p>
                    </div>

                    <span className="ml-auto rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                      {activePost.category}
                    </span>
                  </div>

                  <h2 className="mt-5 text-xl font-bold text-gray-900">
                    {activePost.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {activePost.content}
                  </p>
                </div>

                {/* Add Comment */}
                <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900">
                    💬 Join the conversation
                  </h2>

                  <textarea
                    value={commentText}
                    onChange={(event) =>
                      setCommentText(event.target.value)
                    }
                    placeholder="Write a supportive comment..."
                    rows={4}
                    className="mt-4 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                  />

                  <button
                    type="button"
                    onClick={handleAddComment}
                    className="mt-3 rounded-xl bg-pink-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-700"
                  >
                    Post Comment
                  </button>
                </div>

                {/* Comments */}
                <div className="mt-6">
                  <h2 className="mb-4 text-lg font-bold text-gray-900">
                    💬 Comments ({activeComments.length})
                  </h2>

                  {activeComments.length > 0 ? (
                    <div className="space-y-4">
                      {activeComments.map((comment) => (
                        <div
                          key={comment.id}
                          className="rounded-2xl bg-white p-5 shadow-sm"
                        >
                          {/* Comment */}
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-100">
                              👤
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-gray-900">
                                  {comment.author}
                                </p>

                                <span className="text-xs text-gray-400">
                                  {comment.date}
                                </span>
                              </div>

                              <p className="mt-2 text-sm leading-6 text-gray-600">
                                {comment.content}
                              </p>

                              <button
                                type="button"
                                onClick={() =>
                                  setReplyingTo(
                                    replyingTo === comment.id
                                      ? null
                                      : comment.id
                                  )
                                }
                                className="mt-3 text-xs font-semibold text-pink-600 hover:text-pink-700"
                              >
                                ↩ Reply
                              </button>
                            </div>
                          </div>

                          {/* Reply Form */}
                          {replyingTo === comment.id && (
                            <div className="ml-12 mt-4">
                              <textarea
                                value={replyText}
                                onChange={(event) =>
                                  setReplyText(event.target.value)
                                }
                                placeholder="Write a reply..."
                                rows={3}
                                className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                              />

                              <div className="mt-2 flex gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleAddReply(comment.id)
                                  }
                                  className="rounded-lg bg-pink-600 px-4 py-2 text-xs font-semibold text-white hover:bg-pink-700"
                                >
                                  Reply
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setReplyingTo(null);
                                    setReplyText("");
                                  }}
                                  className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Replies */}
                          {comment.replies.length > 0 && (
                            <div className="ml-12 mt-4 space-y-3 border-l-2 border-pink-100 pl-4">
                              {comment.replies.map((reply) => (
                                <div key={reply.id}>
                                  <div className="flex items-start gap-2">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm">
                                      👤
                                    </div>

                                    <div>
                                      <div className="flex items-center gap-2">
                                        <p className="text-xs font-semibold text-gray-900">
                                          {reply.author}
                                        </p>

                                        <span className="text-xs text-gray-400">
                                          {reply.date}
                                        </span>
                                      </div>

                                      <p className="mt-1 text-sm leading-5 text-gray-600">
                                        {reply.content}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
                      <div className="text-4xl">💬</div>

                      <h3 className="mt-3 font-bold text-gray-900">
                        No comments yet
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Be the first person to join this conversation.
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                <div className="text-5xl">💬</div>

                <h2 className="mt-4 text-xl font-bold text-gray-900">
                  No discussions available
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Create a community post first.
                </p>

                <Link
                  to="/community/posts"
                  className="mt-5 inline-block rounded-xl bg-pink-600 px-5 py-3 text-sm font-semibold text-white"
                >
                  View Discussions
                </Link>
              </div>
            )}
          </div>

        </div>

        {/* Reminder */}
        <div className="mt-8 rounded-2xl border border-purple-200 bg-purple-50 p-5">
          <h3 className="font-bold text-gray-900">
            💜 Community reminder
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Keep conversations respectful and supportive. Personal
            experiences should not be treated as professional medical
            advice.
          </p>
        </div>

      </div>
    </div>
  );
}