import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

const PROFILE_KEY = "herbloomProfile";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
}

const EditProfile = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(PROFILE_KEY);

      if (!savedProfile) {
        return;
      }

      const profile = JSON.parse(savedProfile) as Partial<ProfileData>;

      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setEmail(profile.email || "");
      setProfilePicture(profile.profilePicture || "");
    } catch {
      // Ignore invalid local profile data.
    }
  }, []);

  const handlePictureChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfilePicture(reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const profile: ProfileData = {
      firstName,
      lastName,
      email,
      profilePicture,
    };

    localStorage.setItem(
      PROFILE_KEY,
      JSON.stringify(profile)
    );

    setSaved(true);

    setTimeout(() => {
      navigate("/profile");
    }, 1000);
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

          <form onSubmit={handleSave} className="space-y-6">

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
                onChange={(event) =>
                  setFirstName(event.target.value)
                }
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
                onChange={(event) =>
                  setLastName(event.target.value)
                }
                placeholder="Enter your last name"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
              />
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
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Enter your email address"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
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
                className="flex-1 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 font-bold text-white shadow-md transition hover:from-pink-600 hover:to-purple-700"
              >
                Save Changes
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
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Profile information is currently stored locally while
          HerBloom is being developed.
        </p>

      </div>
    </div>
  );
};

export default EditProfile;