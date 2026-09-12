import { useEffect, useState } from "react";
import type { FormEvent } from "react";

interface UserProfileData {
  name: string;
  username: string;
  bio: string;
  location: string;
}

interface CommunityPost {
  id: number;
  author: string;
  category: string;
  content: string;
  date: string;
  likes: number;
}

const defaultProfile: UserProfileData = {
  name: "HerBloom User",
  username: "herbloom_user",
  bio: "Sharing, learning and supporting others on their health journey. 🌸",
  location: "Ghana",
};

const defaultPosts: CommunityPost[] = [
  {
    id: 1,
    author: "Ama",
    category: "Menstrual Health",
    content: "How do you manage period discomfort?",
    date: "Today",
    likes: 12,
  },
  {
    id: 2,
    author: "Esi",
    category: "Pregnancy",
    content: "What helped you prepare for pregnancy?",
    date: "Yesterday",
    likes: 8,
  },
  {
    id: 3,
    author: "Nana",
    category: "Wellness",
    content: "How do you make time for self-care?",
    date: "2 days ago",
    likes: 15,
  },
];

function UserProfile() {
  const [profile, setProfile] =
    useState<UserProfileData>(defaultProfile);

  const [isEditing, setIsEditing] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const [posts, setPosts] = useState<CommunityPost[]>([]);

  useEffect(() => {
    const savedProfile = localStorage.getItem("herbloomUserProfile");

    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }

    const savedPosts = localStorage.getItem("herbloomCommunityPosts");

    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      setPosts(defaultPosts);
    }
  }, []);

  const handleChange = (
    field: keyof UserProfileData,
    value: string
  ) => {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    localStorage.setItem(
      "herbloomUserProfile",
      JSON.stringify(profile)
    );

    setIsEditing(false);
    setSavedMessage("Profile updated successfully! 🌸");

    setTimeout(() => {
      setSavedMessage("");
    }, 3000);
  };

  const userPosts = posts.filter(
    (post) =>
      post.author === "You" ||
      post.author === profile.name
  );

  const supportedPosts = JSON.parse(
    localStorage.getItem("herbloomSupportedPosts") || "[]"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-purple-500 text-5xl text-white shadow-lg">
            👤
          </div>

          <h1 className="text-3xl font-bold text-gray-800">
            {profile.name}
          </h1>

          <p className="mt-1 text-gray-500">
            @{profile.username}
          </p>

          <p className="mx-auto mt-3 max-w-xl text-gray-600">
            {profile.bio}
          </p>

          {profile.location && (
            <p className="mt-2 text-sm text-gray-500">
              📍 {profile.location}
            </p>
          )}
        </div>

        {/* SUCCESS MESSAGE */}
        {savedMessage && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-700">
            {savedMessage}
          </div>
        )}

        {/* PROFILE + STATS */}
        <div className="grid gap-6 md:grid-cols-3">

          {/* PROFILE CARD */}
          <div className="rounded-2xl bg-white p-6 shadow-md md:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                👤 Profile Information
              </h2>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="rounded-lg bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-600 transition hover:bg-pink-200"
              >
                {isEditing ? "Cancel" : "✏️ Edit Profile"}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4">

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Name
                  </label>

                  <input
                    type="text"
                    value={profile.name}
                    onChange={(event) =>
                      handleChange("name", event.target.value)
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-400"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Username
                  </label>

                  <input
                    type="text"
                    value={profile.username}
                    onChange={(event) =>
                      handleChange(
                        "username",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-400"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Bio
                  </label>

                  <textarea
                    value={profile.bio}
                    onChange={(event) =>
                      handleChange("bio", event.target.value)
                    }
                    rows={4}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Location
                  </label>

                  <input
                    type="text"
                    value={profile.location}
                    onChange={(event) =>
                      handleChange(
                        "location",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-pink-500 px-5 py-3 font-semibold text-white transition hover:bg-pink-600"
                >
                  💾 Save Profile
                </button>
              </form>
            ) : (
              <div className="space-y-4">

                <div className="rounded-xl bg-pink-50 p-4">
                  <p className="text-xs font-semibold uppercase text-pink-500">
                    Name
                  </p>
                  <p className="mt-1 font-medium text-gray-800">
                    {profile.name}
                  </p>
                </div>

                <div className="rounded-xl bg-purple-50 p-4">
                  <p className="text-xs font-semibold uppercase text-purple-500">
                    Username
                  </p>
                  <p className="mt-1 font-medium text-gray-800">
                    @{profile.username}
                  </p>
                </div>

                <div className="rounded-xl bg-fuchsia-50 p-4">
                  <p className="text-xs font-semibold uppercase text-fuchsia-500">
                    About
                  </p>
                  <p className="mt-1 text-gray-700">
                    {profile.bio}
                  </p>
                </div>

              </div>
            )}
          </div>

          {/* STATS */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-5 text-xl font-bold text-gray-800">
              📊 Community Activity
            </h2>

            <div className="space-y-4">

              <div className="rounded-xl bg-pink-50 p-4 text-center">
                <p className="text-3xl font-bold text-pink-500">
                  {userPosts.length}
                </p>
                <p className="text-sm text-gray-600">
                  Posts
                </p>
              </div>

              <div className="rounded-xl bg-purple-50 p-4 text-center">
                <p className="text-3xl font-bold text-purple-500">
                  {supportedPosts.length}
                </p>
                <p className="text-sm text-gray-600">
                  Supported
                </p>
              </div>

              <div className="rounded-xl bg-fuchsia-50 p-4 text-center">
                <p className="text-3xl font-bold text-fuchsia-500">
                  🌸
                </p>
                <p className="text-sm text-gray-600">
                  HerBloom Member
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* USER POSTS */}
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-md">
          <h2 className="mb-5 text-xl font-bold text-gray-800">
            📝 My Community Posts
          </h2>

          {userPosts.length === 0 ? (
            <div className="rounded-xl bg-gray-50 p-8 text-center">
              <p className="text-3xl">🌸</p>
              <p className="mt-2 font-medium text-gray-700">
                You haven't created any community posts yet.
              </p>

              <a
                href="/community/posts"
                className="mt-4 inline-block rounded-lg bg-pink-500 px-5 py-2 text-sm font-semibold text-white hover:bg-pink-600"
              >
                Create a Post
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {userPosts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-xl border border-gray-100 bg-gray-50 p-5"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-600">
                      {post.category}
                    </span>

                    <span className="text-xs text-gray-400">
                      {post.date}
                    </span>
                  </div>

                  <p className="text-gray-700">
                    {post.content}
                  </p>

                  <p className="mt-3 text-sm text-gray-500">
                    ❤️ {post.likes} support
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PRIVACY NOTICE */}
        <div className="mt-8 rounded-2xl border border-purple-100 bg-purple-50 p-6">
          <h2 className="font-bold text-purple-800">
            🔒 Your Privacy Matters
          </h2>

          <p className="mt-2 text-sm leading-6 text-purple-700">
            Your profile information is stored locally during this
            frontend stage of HerBloom. When the backend and
            authentication system are connected, profile information
            will be securely stored and managed through your account.
          </p>
        </div>

      </div>
    </div>
  );
}

export default UserProfile;