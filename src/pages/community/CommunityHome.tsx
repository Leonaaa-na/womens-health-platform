import { Link } from "react-router-dom";

export default function CommunityHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-2xl">
              👥
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                HerBloom Community
              </h1>

              <p className="text-sm text-gray-600">
                Connect, share, learn, and support one another.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-pink-200 bg-pink-50 p-5">
            <h2 className="font-bold text-pink-700">
              🌸 A space for women to connect
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-700">
              Share experiences, ask questions, discover helpful health
              information, and support other members of the HerBloom
              community.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid gap-5 md:grid-cols-3">

          <Link
            to="/community/posts"
            className="rounded-2xl border border-pink-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 text-2xl">
              📝
            </div>

            <h3 className="font-bold text-gray-900">
              Community Discussions
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Browse conversations, questions, and experiences shared
              by community members.
            </p>
          </Link>

          <Link
            to="/community/professional-content"
            className="rounded-2xl border border-purple-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl">
              🩺
            </div>

            <h3 className="font-bold text-gray-900">
              Professional Health Content
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Explore health content shared by qualified healthcare
              professionals.
            </p>
          </Link>

          <Link
            to="/community/verified"
            className="rounded-2xl border border-green-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
              ✅
            </div>

            <h3 className="font-bold text-gray-900">
              Verified Community
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Learn how verified proof can help build trust within the
              community.
            </p>
          </Link>

        </div>

        {/* Community Highlights */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            💬 Community Highlights
          </h2>

          <div className="grid gap-5 md:grid-cols-2">

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                  🌸
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Share your experience
                  </h3>

                  <p className="text-xs text-gray-500">
                    Your experience may help someone else.
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-gray-600">
                Talk about your health journey, ask questions, or
                encourage another community member.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                  💜
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Support one another
                  </h3>

                  <p className="text-xs text-gray-500">
                    Kindness and respect come first.
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-gray-600">
                HerBloom Community is designed to encourage respectful
                conversations and positive support.
              </p>
            </div>

          </div>
        </div>

        {/* Community Guidelines */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-bold text-gray-900">
            🤝 Community Guidelines
          </h2>

          <div className="mt-4 grid gap-3 text-sm text-gray-600 md:grid-cols-2">
            <p>✓ Treat other members with respect.</p>
            <p>✓ Do not share another person's private information.</p>
            <p>✓ Avoid presenting personal experiences as medical facts.</p>
            <p>✓ Seek professional help for serious health concerns.</p>
          </div>
        </div>

      </div>
    </div>
  );
}