import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/client";

interface MeResponse {
  name: string;
  email: string;
  createdAt: string;
  profile?: {
    username?: string | null;
    bio?: string | null;
    avatarUrl?: string | null;
    city?: string | null;
    lifeStage?: string;
  };
}

const LIFE_STAGE: Record<string, string> = {
  menstrual: "🩸 Cycle tracking",
  trying_to_conceive: "🌱 Trying to conceive",
  pregnant: "🤰🏾 Pregnant",
  postpartum: "👶🏾 Postpartum",
};

const Profile = () => {
  const navigate = useNavigate();

  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await apiClient.get("/users/me");
        setMe(response.data.data);
      } catch {
        setMe(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
          <p className="mt-4 text-sm font-medium text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const avatar = me?.profile?.avatarUrl;
  const memberSince = me?.createdAt
    ? new Date(me.createdAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" })
    : null;

  const options = [
    { icon: "🔐", title: "Account & Security", text: "Manage your password and account security settings.", path: "/profile/security", cta: "Manage →" },
    { icon: "⚙️", title: "App Settings", text: "Manage general preferences for your HerBloom app.", path: "/profile/settings", cta: "Manage →" },
    { icon: "🔔", title: "Notifications", text: "Choose which reminders and alerts you receive.", path: "/notifications/settings", cta: "Manage →" },
    { icon: "💎", title: "Premium", text: "See your plan and what Premium includes.", path: "/premium/status", cta: "View →" },
    { icon: "📄", title: "Privacy & Terms", text: "Review HerBloom's privacy information and terms of service.", path: "/profile/privacy", cta: "View →" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8 text-center">
          {avatar ? (
            <img src={avatar} alt="Profile" className="mx-auto h-24 w-24 rounded-full object-cover shadow-md" />
          ) : (
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-pink-100 to-purple-100 text-5xl shadow-md">
              👤
            </div>
          )}
          <h1 className="mt-5 text-3xl font-bold text-gray-800">My Profile</h1>
          <p className="mt-2 text-gray-600">Manage your HerBloom account and app settings.</p>
        </div>

        {/* Overview */}
        <div className="rounded-3xl border border-pink-100 bg-white p-8 shadow-lg">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">Personal Profile</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-800">{me?.name || "Welcome to HerBloom 🌸"}</h2>
              {me?.profile?.username ? <p className="mt-1 text-sm text-pink-600">@{me.profile.username}</p> : null}
              <p className="mt-2 text-sm leading-6 text-gray-600">
                {me?.profile?.bio || "Manage your personal account information and HerBloom preferences from here."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/profile/edit")}
              className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:from-pink-600 hover:to-purple-700"
            >
              ✏️ Edit Profile
            </button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-pink-50 p-5">
              <div className="text-2xl">📧</div>
              <p className="mt-3 text-sm font-semibold text-gray-500">Email Address</p>
              <p className="mt-1 break-all font-bold text-gray-800">{me?.email || "Not set"}</p>
            </div>
            <div className="rounded-2xl bg-purple-50 p-5">
              <div className="text-2xl">🌸</div>
              <p className="mt-3 text-sm font-semibold text-gray-500">Journey</p>
              <p className="mt-1 font-bold text-gray-800">{LIFE_STAGE[me?.profile?.lifeStage || "menstrual"]}</p>
            </div>
            {me?.profile?.city ? (
              <div className="rounded-2xl bg-blue-50 p-5">
                <div className="text-2xl">📍</div>
                <p className="mt-3 text-sm font-semibold text-gray-500">Location</p>
                <p className="mt-1 font-bold text-gray-800">{me.profile.city}</p>
              </div>
            ) : null}
            {memberSince ? (
              <div className="rounded-2xl bg-green-50 p-5">
                <div className="text-2xl">📅</div>
                <p className="mt-3 text-sm font-semibold text-gray-500">Member Since</p>
                <p className="mt-1 font-bold text-gray-800">{memberSince}</p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Options */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {options.map((o) => (
            <button
              key={o.path}
              type="button"
              onClick={() => navigate(o.path)}
              className="rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-md transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="text-3xl">{o.icon}</div>
              <h3 className="mt-4 text-lg font-bold text-gray-800">{o.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{o.text}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-pink-600">{o.cta}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">To log out of HerBloom, use the Logout button in the sidebar.</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;