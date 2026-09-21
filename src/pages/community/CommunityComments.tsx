import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  getPosts,
  getComments,
  addComment,
  deleteComment,
  topicLabel,
  authorName,
  isVerifiedAuthor,
  timeAgo,
  apiErrorMessage,
  type CommunityPost,
  type CommunityComment,
} from "../../api/communityApi";
import { useAuth } from "../../context/AuthContext";

export default function CommunityComments() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [activePostId, setActivePostId] = useState<string | null>(searchParams.get("post"));
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [loading, setLoading] = useState(true);

  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // Discussion list on the left
  useEffect(() => {
    const load = async () => {
      try {
        const list = await getPosts();
        setPosts(list.posts);
        setActivePostId((current) => current || list.posts[0]?.id || null);
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const loadComments = useCallback(async (postId: string) => {
    try {
      setComments(await getComments(postId));
    } catch {
      setComments([]);
    }
  }, []);

  useEffect(() => {
    if (activePostId) loadComments(activePostId);
  }, [activePostId, loadComments]);

  const selectPost = (id: string) => {
    setActivePostId(id);
    setReplyingTo(null);
    setMessage("");
    setSearchParams({ post: id });
  };

  const bumpCommentCount = (by: number) =>
    setPosts((prev) => prev.map((p) => (p.id === activePostId ? { ...p, commentCount: Math.max(0, p.commentCount + by) } : p)));

  const handleAddComment = async () => {
    if (!commentText.trim() || !activePostId) return;
    try {
      await addComment(activePostId, commentText.trim());
      setCommentText("");
      bumpCommentCount(1);
      await loadComments(activePostId);
    } catch (error) {
      setMessage(apiErrorMessage(error, "Could not post comment."));
    }
  };

  const handleAddReply = async (commentId: string) => {
    if (!replyText.trim() || !activePostId) return;
    try {
      await addComment(activePostId, replyText.trim(), commentId);
      setReplyText("");
      setReplyingTo(null);
      bumpCommentCount(1);
      await loadComments(activePostId);
    } catch (error) {
      setMessage(apiErrorMessage(error, "Could not post reply."));
    }
  };

  const handleDelete = async (comment: CommunityComment) => {
    if (!activePostId || !window.confirm("Delete this comment?")) return;
    try {
      await deleteComment(comment.id);
      bumpCommentCount(-(1 + (comment.replies?.length || 0)));
      await loadComments(activePostId);
    } catch (error) {
      setMessage(apiErrorMessage(error, "Could not delete comment."));
    }
  };

  const activePost = posts.find((p) => p.id === activePostId);
  const nameOf = (c: CommunityComment) => (c.authorId === user?.id ? "You" : authorName(c.author));

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-2xl">💬</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Comments & Replies</h1>
              <p className="text-sm text-gray-600">Join the conversation and support your community.</p>
            </div>
          </div>
          <Link
            to="/community/posts"
            className="inline-block rounded-xl border border-pink-200 bg-white px-5 py-3 text-sm font-semibold text-pink-700 transition hover:bg-pink-50"
          >
            ← Back to Discussions
          </Link>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">

            {/* Posts */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-gray-900">Discussions</h2>
                <div className="max-h-[70vh] space-y-3 overflow-y-auto">
                  {posts.map((post) => (
                    <button
                      key={post.id}
                      type="button"
                      onClick={() => selectPost(post.id)}
                      className={`w-full rounded-xl border p-4 text-left transition ${
                        activePostId === post.id ? "border-pink-400 bg-pink-50" : "border-gray-200 bg-white hover:bg-gray-50"
                      }`}
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-700">
                          {post.isProfessionalContent ? "🩺 " : ""}
                          {topicLabel(post.topic)}
                        </span>
                        <span className="text-xs text-gray-400">{timeAgo(post.createdAt)}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900">{post.title || post.content.slice(0, 60)}</h3>
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-500">{post.content}</p>
                      <p className="mt-2 text-xs text-gray-400">💬 {post.commentCount}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Post + Comments */}
            <div className="lg:col-span-2">
              {activePost ? (
                <>
                  <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                        {activePost.isAnonymous ? "🕶️" : "👤"}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-gray-900">
                            {activePost.isMine ? "You" : authorName(activePost.author)}
                          </p>
                          {isVerifiedAuthor(activePost.author) ? (
                            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">✓ Verified</span>
                          ) : null}
                        </div>
                        <p className="text-xs text-gray-500">{timeAgo(activePost.createdAt)}</p>
                      </div>
                      <span className="ml-auto rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                        {topicLabel(activePost.topic)}
                      </span>
                    </div>
                    {activePost.title ? <h2 className="mt-5 text-xl font-bold text-gray-900">{activePost.title}</h2> : null}
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">{activePost.content}</p>
                  </div>

                  {/* Add Comment */}
                  <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900">💬 Join the conversation</h2>
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a supportive comment..."
                      rows={4}
                      className="mt-4 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                    />
                    {message ? <p className="mt-2 text-sm font-medium text-red-600">{message}</p> : null}
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
                    <h2 className="mb-4 text-lg font-bold text-gray-900">💬 Comments ({activePost.commentCount})</h2>

                    {comments.length > 0 ? (
                      <div className="space-y-4">
                        {comments.map((comment) => (
                          <div key={comment.id} className="rounded-2xl bg-white p-5 shadow-sm">
                            <div className="flex items-start gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-100">👤</div>
                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="text-sm font-semibold text-gray-900">{nameOf(comment)}</p>
                                  {isVerifiedAuthor(comment.author) ? (
                                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">✓</span>
                                  ) : null}
                                  <span className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</span>
                                </div>
                                <p className="mt-2 text-sm leading-6 text-gray-600">{comment.content}</p>
                                <div className="mt-3 flex gap-4">
                                  <button
                                    type="button"
                                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                    className="text-xs font-semibold text-pink-600 hover:text-pink-700"
                                  >
                                    ↩ Reply
                                  </button>
                                  {comment.authorId === user?.id ? (
                                    <button
                                      type="button"
                                      onClick={() => handleDelete(comment)}
                                      className="text-xs font-semibold text-red-500"
                                    >
                                      Delete
                                    </button>
                                  ) : null}
                                </div>
                              </div>
                            </div>

                            {/* Reply Form */}
                            {replyingTo === comment.id ? (
                              <div className="ml-12 mt-4">
                                <textarea
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  placeholder="Write a reply..."
                                  rows={3}
                                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                                />
                                <div className="mt-2 flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleAddReply(comment.id)}
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
                            ) : null}

                            {/* Replies */}
                            {comment.replies && comment.replies.length > 0 ? (
                              <div className="ml-12 mt-4 space-y-3 border-l-2 border-pink-100 pl-4">
                                {comment.replies.map((reply) => (
                                  <div key={reply.id} className="flex items-start gap-2">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm">👤</div>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <p className="text-xs font-semibold text-gray-900">{nameOf(reply)}</p>
                                        <span className="text-xs text-gray-400">{timeAgo(reply.createdAt)}</span>
                                      </div>
                                      <p className="mt-1 text-sm leading-5 text-gray-600">{reply.content}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
                        <div className="text-4xl">💬</div>
                        <h3 className="mt-3 font-bold text-gray-900">No comments yet</h3>
                        <p className="mt-1 text-sm text-gray-500">Be the first person to join this conversation.</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                  <div className="text-5xl">💬</div>
                  <h2 className="mt-4 text-xl font-bold text-gray-900">No discussions available</h2>
                  <p className="mt-2 text-sm text-gray-500">Create a community post first.</p>
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
        )}

        {/* Reminder */}
        <div className="mt-8 rounded-2xl border border-purple-200 bg-purple-50 p-5">
          <h3 className="font-bold text-gray-900">💜 Community reminder</h3>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Keep conversations respectful and supportive. Personal experiences should not be treated as professional
            medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}