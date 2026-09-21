import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/client";

const MAX_PHOTO_MB = 5;

const errorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } }).response?.data?.message || fallback;

// Keep the name/photo the sidebar reads (herbloomUser) in step after a save
const updateStoredUser = (changes: { firstName?: string; lastName?: string; avatar?: string; bio?: string }) => {
  try {
    const stored = JSON.parse(localStorage.getItem("herbloomUser") || "null");
    if (!stored) return;
    localStorage.setItem(
      "herbloomUser",
      JSON.stringify({
        ...stored,
        ...(changes.firstName !== undefined && { firstName: changes.firstName }),
        ...(changes.lastName !== undefined && { lastName: changes.lastName }),
        profile: {
          ...(stored.profile || {}),
          ...(changes.avatar !== undefined && { avatar: changes.avatar }),
          ...(changes.bio !== undefined && { bio: changes.bio }),
        },
      })
    );
  } catch {
    // not critical
  }
};

const EditProfile = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [loadingPage, setLoadingPage] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [photoMessage, setPhotoMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = (await apiClient.get("/users/me")).data.data;
        const parts = (data.name || "").trim().split(/\s+/);
        setFirstName(parts[0] || "");
        setLastName(parts.slice(1).join(" "));
        setEmail(data.email || "");
        setUsername(data.profile?.username || "");
        setBio(data.profile?.bio || "");
        setCity(data.profile?.city || "");
        setAvatarUrl(data.profile?.avatarUrl || "");
      } catch {
        setError("Could not load your profile.");
      } finally {
        setLoadingPage(false);
      }
    };
    load();
  }, []);

  // Photo uploads straight away, separately from the form
  const handlePictureChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // allow picking the same file again
    if (!file) return;
    setPhotoMessage("");

    if (!file.type.startsWith("image/")) {
      setPhotoMessage("Please choose an image file.");
      return;
    }
    if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
      setPhotoMessage(`Please choose an image smaller than ${MAX_PHOTO_MB} MB.`);
      return;
    }

    const previous = avatarUrl;
    setAvatarUrl(URL.createObjectURL(file)); // instant preview
    setUploading(true);

    try {
      const form = new FormData();
      form.append("avatar", file);
      const profile = (await apiClient.post("/users/profile/avatar", form)).data.data;
      setAvatarUrl(profile.avatarUrl);
      updateStoredUser({ avatar: profile.avatarUrl });
      setPhotoMessage("✅ Profile picture updated.");
    } catch (err) {
      setAvatarUrl(previous);
      setPhotoMessage(errorMessage(err, "Couldn't upload your photo. Please try again."));
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSaved(false);

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (!fullName) {
      setError("Please enter your name.");
      return;
    }

    const cleanUsername = username.trim().replace(/^@/, "");
    if (cleanUsername && !/^[a-zA-Z0-9_.]{3,30}$/.test(cleanUsername)) {
      setError("Usernames can use letters, numbers, dots and underscores (3–30 characters).");
      return;
    }

    setSaving(true);
    try {
      // Name lives on the account; username, bio and city on the profile
      await apiClient.put("/users/me", { name: fullName });
      await apiClient.put("/users/profile", {
        username: cleanUsername || null,
        bio: bio.trim() || null,
        city: city.trim() || null,
      });

      updateStoredUser({ firstName: firstName.trim(), lastName: lastName.trim(), bio: bio.trim() });
      setSaved(true);
      setTimeout(() => navigate("/profile"), 900);
    } catch (err) {
      const msg = errorMessage(err, "Could not save profile changes.");
      setError(msg === "Already exists" ? "That username is already taken. Try another one." : msg);
    } finally {
      setSaving(false);
    }
  };

  if (loadingPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100";

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
            <div className="relative mx-auto h-24 w-24">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="h-24 w-24 rounded-full object-cover shadow-md" />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-pink-100 to-purple-100 text-5xl shadow-md">
                  👤
                </div>
              )}
              {uploading ? (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-white/70">
                  <div className="h-6 w-6 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
                </div>
              ) : null}
            </div>
            <h1 className="mt-5 text-3xl font-bold text-gray-800">Edit Profile</h1>
            <p className="mt-2 text-gray-600">Update your basic HerBloom account information.</p>
          </div>
        </div>

        <div className="rounded-3xl border border-pink-100 bg-white p-8 shadow-lg">
          {saved ? (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
              ✅ Profile changes saved successfully.
            </div>
          ) : null}

          {error ? (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              ⚠️ {error}
            </div>
          ) : null}

          {/* Photo */}
          <div className="mb-8">
            <p className="mb-3 text-sm font-semibold text-gray-700">Profile Picture</p>
            <label
              htmlFor="profilePicture"
              className={`inline-flex cursor-pointer items-center rounded-xl border border-dashed border-pink-300 bg-pink-50 px-5 py-3 text-sm font-semibold text-pink-600 transition hover:bg-pink-100 ${
                uploading ? "pointer-events-none opacity-60" : ""
              }`}
            >
              {uploading ? "Uploading..." : "📷 Change Profile Picture"}
            </label>
            <input
              id="profilePicture"
              type="file"
              accept="image/*"
              onChange={handlePictureChange}
              className="hidden"
            />
            {photoMessage ? <p className="mt-3 text-xs font-medium text-gray-600">{photoMessage}</p> : null}
            <p className="mt-2 text-xs text-gray-400">JPG or PNG, up to {MAX_PHOTO_MB} MB. Saves straight away.</p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="mb-2 block text-sm font-semibold text-gray-700">First Name</label>
                <input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Enter your first name" className={inputClass} />
              </div>
              <div>
                <label htmlFor="lastName" className="mb-2 block text-sm font-semibold text-gray-700">Last Name</label>
                <input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Enter your last name" className={inputClass} />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-700">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                readOnly
                className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500 outline-none"
              />
              <p className="mt-2 text-xs text-gray-400">Your email is used to sign in and can't be changed here.</p>
            </div>

            <div>
              <label htmlFor="username" className="mb-2 block text-sm font-semibold text-gray-700">Username</label>
              <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. zelda_blooms" className={inputClass} />
              <p className="mt-2 text-xs text-gray-400">Shown on your community posts instead of your name.</p>
            </div>

            <div>
              <label htmlFor="city" className="mb-2 block text-sm font-semibold text-gray-700">City</label>
              <input id="city" type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Accra" className={inputClass} />
            </div>

            <div>
              <label htmlFor="bio" className="mb-2 block text-sm font-semibold text-gray-700">Bio</label>
              <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself..." rows={3} className={`${inputClass} resize-none`} />
            </div>

            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <button
                type="submit"
                disabled={saving || uploading}
                className="flex-1 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 font-bold text-white shadow-md transition hover:from-pink-600 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
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

          <p className="mt-6 text-center text-xs text-gray-400">HerBloom securely stores your profile information on our servers.</p>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;