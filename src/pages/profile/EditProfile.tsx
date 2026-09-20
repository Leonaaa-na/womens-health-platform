import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../api/client";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
  bio: string;
  username: string;
  averageCycleLength: string;
  averagePeriodLength: string;
  lastPeriodDate: string;
}

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, refreshPremium } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [averageCycleLength, setAverageCycleLength] = useState("");
  const [averagePeriodLength, setAveragePeriodLength] = useState("");
  const [lastPeriodDate, setLastPeriodDate] = useState("");

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get<{
          name: string;
          email: string;
          profile?: {
            username?: string;
            bio?: string;
            avatarUrl?: string;
            averageCycleLength?: number;
            averagePeriodLength?: number;
            lastPeriodDate?: string;
          };
        }>("/users/me");

        if (response.data.success && response.data.data) {
          const data = response.data.data;
          const nameParts = data.name ? data.name.trim().split(/\s+/) : ["", ""];
          setFirstName(nameParts[0] || "");
          setLastName(nameParts.length > 1 ? nameParts.slice(1).join(" ") : "");
          setEmail(data.email || "");
          setUsername(data.profile?.username || "");
          setBio(data.profile?.bio || "");
          setProfilePicture(data.profile?.avatarUrl || "");
          setAverageCycleLength(data.profile?.averageCycleLength?.toString() || "28");
          setAveragePeriodLength(data.profile?.averagePeriodLength?.toString() || "5");
          setLastPeriodDate(data.profile?.lastPeriodDate || "");
        } else if (user) {
          setFirstName(user.firstName);
          setLastName(user.lastName);
          setEmail(user.email);
        }
      } catch {
        if (user) {
          setFirstName(user.firstName);
          setLastName(user.lastName);
          setEmail(user.email);
        }
      }
    };

    fetchProfile();
  }, [user]);

  const handlePictureChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfilePicture(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

      await apiClient.put("/users/me", {
        name: fullName,
        email: email.trim(),
      });

      await apiClient.put("/profile", {
        username,
        bio,
        averageCycleLength: Number(averageCycleLength),
        averagePeriodLength: Number(averagePeriodLength),
        lastPeriodDate: lastPeriodDate || null,
      });

      setSaved(true);
      setTimeout(() => navigate("/profile"), 1000);
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
        "Could not save profile changes.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="mb-5 text-sm font-semibold text-pink-600 transition hover:text-pink-700"
          >
            ← Back to Profile
          </button>

          <div className="text-center">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile preview"
                className="mx-auto h-24 w-24 rounded-full object-cover shadow-md"
              />
            ) : (
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-pink-100 to-purple-100 text-5xl shadow-md">
                👤
              </div>
            )}

            <h1 className="mt-5 text-3xl font-bold text-gray-800">
              Edit Profile
            </h1>
            <p className="mt-2 text-gray-600">
              Update your basic HerBloom account information.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-pink-100 bg-white p-8 shadow-lg">
          {saved && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
              ✅ Profile changes saved successfully.
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  placeholder="Enter your first name"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  placeholder="Enter your last name"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email address"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
              />
            </div>

            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Display name for the community"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
              />
            </div>

            <div>
              <label
                htmlFor="bio"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                placeholder="Tell us about yourself..."
                rows={3}
                className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
              />
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-gray-700">
                Profile Picture
              </p>
              <label
                htmlFor="profilePicture"
                className="inline-flex cursor-pointer items-center rounded-xl border border-dashed border-pink-300 bg-pink-50 px-5 py-3 text-sm font-semibold text-pink-600 transition hover:bg-pink-100"
              >
                📷 Change Profile Picture
              </label>
              <input
                id="profilePicture"
                type="file"
                accept="image/*"
                onChange={handlePictureChange}
                className="hidden"
              />
              {profilePicture && (
                <p className="mt-3 text-xs font-medium text-green-600">
                  ✅ New profile picture selected.
                </p>
              )}
              <p className="mt-2 text-xs text-gray-400">
                Choose an image from your device.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 font-bold text-white shadow-md transition hover:from-pink-600 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="flex-1 rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            HerBloom securely stores your profile information on our servers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
