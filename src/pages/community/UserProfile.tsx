import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../api/client";
import {
  getPosts,
  getMyStats,
  topicLabel,
  timeAgo,
  apiErrorMessage,
  type CommunityPost,
} from "../../api/communityApi";

interface ProfileForm {
  name: string;
  username: string;
  bio: string;
  location: string;
}

const EMPTY: ProfileForm = { name: "", username: "", bio: "", location: "" };

function UserProfile() {
  const [profile, setProfile] = useState<ProfileForm>(EMPTY);
  const [draft, setDraft] = useState<ProfileForm>(EMPTY);
  const [stats, setStats] = useState({ posts: 0, supported: 0, comments: 0 });
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [meRes, myStats, myPosts] = await Promise.all([
          apiClient.get("/users/me"),
          getMyStats(),
          getPosts({ mine: "true" }),
        ]);
        const me = meRes.data.data;
        const loaded: ProfileForm = {
          name: me.name || "",
          username: me.profile?.username || "",
          bio: me.profile?.bio || "",
          location: me.profile?.city || "",
        };
        setProfile(loaded);
        setDraft(loaded);
        setStats(myStats);
        setPosts(myPosts.posts);
      } catch {
        // leave defaults
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (field: keyof ProfileForm, value: string) => setDraft((prev) => ({ ...prev, [field]: value }));

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setSavedMessage("");
    try {
      // Name lives on the account; username, bio and location on the profile
      await apiClient.put("/users/me", { name: draft.name.trim() });
      await apiClient.put("/users/profile", {
        username: draft.username.trim().replace(/^@/, "") || null,
        bio: draft.bio.trim() || null,
        city: draft.location.trim() || null,
      });
      setProfile(draft);
      setIsEditing(false);
      setSavedMessage("Profile updated successfully! 🌸");
    } catch (error) {
      const msg = apiErrorMessage(error, "Could not save your profile.");
      setSavedMessage(msg === "Already exists" ? "That username is taken — try another." : msg);
    } finally {
      setSaving(false);
      setTimeout(() => setSavedMessage(""), 4000);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pink-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">

        <Link to="/community" className="text-sm font-semibold text-pink-600 hover:text-pink-700">
          ← Back to Community
        </Link>

        {/* HEADER */}
        <div className="mb-8 mt-6 text-center">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-purple-500 text-5xl text-white shadow-lg">
            👤
          </div>
          <h1 className="text-3xl font-bold text-gray-800">{profile.name || "HerBloom Member"}</h1>
          {profile.username ? <p className="mt-1 text-gray-500">@{profile.username}</p> : null}
          {profile.bio ? <p className="mx-auto mt-3 max-w-xl text-gray-600">{profile.bio}</p> : null}
          {profile.location ? <p className="mt-2 text-sm text-gray-500">📍 {profile.location}</p> : null}
        </div>

        {savedMessage ? (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-700">
            {savedMessage}
          </div>
        ) : null}

        {/* PROFILE + STATS */}
        <div className="grid gap-6 md:grid-cols-3">

          {/* PROFILE CARD */}
          <div className="rounded-2xl bg-white p-6 shadow-md md:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">👤 Profile Information</h2>
              <button
                onClick={() => {
                  setDraft(profile);
                  setIsEditing(!isEditing);
                }}
                className="rounded-lg bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-600 transition hover:bg-pink-200"
              >
                {isEditing ? "Cancel" : "✏️ Edit Profile"}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={draft.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-400"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    value={draft.username}
                    onChange={(e) => handleChange("username", e.target.value)}
                    placeholder="e.g. zelda_blooms"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-400"
                  />
                  <p className="mt-1 text-xs text-gray-400">Shown on your community posts instead of your name.</p>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Bio</label>
                  <textarea
                    value={draft.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-400"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    value={draft.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-xl bg-pink-500 px-5 py-3 font-semibold text-white transition hover:bg-pink-600 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "💾 Save Profile"}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl bg-pink-50 p-4">
                  <p className="text-xs font-semibold uppercase text-pink-500">Name</p>
                  <p className="mt-1 font-medium text-gray-800">{profile.name || "—"}</p>
                </div>
                <div className="rounded-xl bg-purple-50 p-4">
                  <p className="text-xs font-semibold uppercase text-purple-500">Username</p>
                  <p className="mt-1 font-medium text-gray-800">{profile.username ? `@${profile.username}` : "Not set"}</p>
                </div>
                <div className="rounded-xl bg-fuchsia-50 p-4">
                  <p className="text-xs font-semibold uppercase text-fuchsia-500">About</p>
                  <p className="mt-1 text-gray-700">{profile.bio || "Nothing here yet."}</p>
                </div>
              </div>
            )}
          </div>

          {/* STATS */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-5 text-xl font-bold text-gray-800">📊 Community Activity</h2>
            <div className="space-y-4">
              <div className="rounded-xl bg-pink-50 p-4 text-center">
                <p className="text-3xl font-bold text-pink-500">{stats.posts}</p>
                <p className="text-sm text-gray-600">Posts</p>
              </div>
              <div className="rounded-xl bg-purple-50 p-4 text-center">
                <p className="text-3xl font-bold text-purple-500">{stats.supported}</p>
                <p className="text-sm text-gray-600">Supported</p>
              </div>
              <div className="rounded-xl bg-fuchsia-50 p-4 text-center">
                <p className="text-3xl font-bold text-fuchsia-500">{stats.comments}</p>
                <p className="text-sm text-gray-600">Comments</p>
              </div>
            </div>
          </div>
        </div>

        {/* USER POSTS */}
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-md">
          <h2 className="mb-5 text-xl font-bold text-gray-800">📝 My Community Posts</h2>

          {posts.length === 0 ? (
            <div className="rounded-xl bg-gray-50 p-8 text-center">
              <p className="text-3xl">🌸</p>
              <p className="mt-2 font-medium text-gray-700">You haven't created any community posts yet.</p>
              <Link
                to="/community/posts"
                className="mt-4 inline-block rounded-lg bg-pink-500 px-5 py-2 text-sm font-semibold text-white hover:bg-pink-600"
              >
                Create a Post
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/community/comments?post=${post.id}`}
                  className="block rounded-xl border border-gray-100 bg-gray-50 p-5 transition hover:bg-pink-50"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-600">
                      {topicLabel(post.topic)}
                      {post.isAnonymous ? " · Anonymous" : ""}
                    </span>
                    <span className="text-xs text-gray-400">{timeAgo(post.createdAt)}</span>
                  </div>
                  {post.title ? <p className="font-semibold text-gray-800">{post.title}</p> : null}
                  <p className="mt-1 text-gray-700">{post.content}</p>
                  <p className="mt-3 text-sm text-gray-500">
                    ❤️ {post.supportCount} support · 💬 {post.commentCount} comments
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* PRIVACY NOTICE */}
        <div className="mt-8 rounded-2xl border border-purple-100 bg-purple-50 p-6">
          <h2 className="font-bold text-purple-800">🔒 Your Privacy Matters</h2>
          <p className="mt-2 text-sm leading-6 text-purple-700">
            Your profile is stored securely with your HerBloom account. Posts you make anonymously never show your name
            or username to other members.
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;