import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../api/client";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
  bio: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [profile, setProfile] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    profilePicture: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get<{
          id: string;
          name: string;
          email: string;
          profile?: {
            avatarUrl?: string;
            bio?: string;
            username?: string;
          };
          notificationSettings?: unknown;
        }>("/users/me");

        if (response.data.success && response.data.data) {
          const data = response.data.data;
          const nameParts = data.name ? data.name.trim().split(/\s+/) : ["", ""];
          setProfile({
            firstName: nameParts[0] || "",
            lastName: nameParts.length > 1 ? nameParts.slice(1).join(" ") : "",
            email: data.email || user?.email || "",
            profilePicture: data.profile?.avatarUrl || user?.profile.avatar || "",
            bio: data.profile?.bio || "",
          });
        }
      } catch {
        // Use user from context as fallback
        if (user) {
          setProfile({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            profilePicture: user.profile.avatar,
            bio: user.profile.bio,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const fullName = `${profile.firstName} ${profile.lastName}`.trim();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          {profile.profilePicture ? (
            <img
              src={profile.profilePicture}
              alt="Profile"
              className="mx-auto h-24 w-24 rounded-full object-cover shadow-md"
            />
          ) : (
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-pink-100 to-purple-100 text-5xl shadow-md">
              👤
            </div>
          )}

          <h1 className="mt-5 text-3xl font-bold text-gray-800">
            My Profile
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your HerBloom account and app settings.
          </p>
        </div>

        {/* Profile Overview */}
        <div className="rounded-3xl border border-pink-100 bg-white p-8 shadow-lg">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                Personal Profile
              </p>
              <h2 className="mt-2 text-2xl font-bold text-gray-800">
                {fullName || "Welcome to HerBloom 🌸"}
              </h2>
              {profile.bio && (
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {profile.bio}
                </p>
              )}
              {!profile.bio && (
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Manage your personal account information and
                  HerBloom preferences from here.
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => navigate("/profile/edit")}
              className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:from-pink-600 hover:to-purple-700"
            >
              ✏️ Edit Profile
            </button>
          </div>

          {/* Account Details */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-pink-50 p-5">
              <div className="text-2xl">👤</div>
              <p className="mt-3 text-sm font-semibold text-gray-500">Name</p>
              <p className="mt-1 font-bold text-gray-800">
                {fullName || "Not set"}
              </p>
            </div>
            <div className="rounded-2xl bg-purple-50 p-5">
              <div className="text-2xl">📧</div>
              <p className="mt-3 text-sm font-semibold text-gray-500">
                Email Address
              </p>
              <p className="mt-1 font-bold text-gray-800">
                {profile.email || "Not set"}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Options */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <button
            type="button"
            onClick={() => navigate("/profile/security")}
            className="rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-md transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="text-3xl">🔐</div>
            <h3 className="mt-4 text-lg font-bold text-gray-800">
              Account & Security
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Manage your password and account security settings.
            </p>
            <span className="mt-4 inline-block text-sm font-semibold text-pink-600">
              Manage →
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/profile/settings")}
            className="rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-md transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="text-3xl">⚙️</div>
            <h3 className="mt-4 text-lg font-bold text-gray-800">
              App Settings
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Manage general preferences for your HerBloom app.
            </p>
            <span className="mt-4 inline-block text-sm font-semibold text-pink-600">
              Manage →
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/profile/privacy")}
            className="rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-md transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="text-3xl">📄</div>
            <h3 className="mt-4 text-lg font-bold text-gray-800">
              Privacy & Terms
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Review HerBloom's privacy information and terms of service.
            </p>
            <span className="mt-4 inline-block text-sm font-semibold text-pink-600">
              View →
            </span>
          </button>
        </div>

        {/* Logout Information */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            To log out of HerBloom, use the Logout button in the sidebar.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
