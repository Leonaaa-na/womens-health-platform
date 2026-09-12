import { Link } from "react-router-dom";

export default function EmergencyServices() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 p-6">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-2xl">
              📱
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Emergency Services
              </h1>

              <p className="text-sm text-gray-600">
                Quick access to important emergency services.
              </p>
            </div>
          </div>

          {/* Warning */}
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <h2 className="font-bold text-red-700">
              🚨 Need immediate help?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-700">
              If you are experiencing a serious or life-threatening
              emergency, contact the appropriate emergency service
              immediately. HerBloom does not replace professional
              emergency care.
            </p>
          </div>
        </div>

        {/* Emergency Services */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            🚨 Quick Emergency Services
          </h2>

          <div className="grid gap-5 md:grid-cols-2">

            {/* National Emergency */}
            <div className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-3xl">
                  🚨
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    National Emergency
                  </h3>

                  <p className="mt-1 text-sm text-gray-600">
                    For urgent emergencies requiring immediate assistance.
                  </p>
                </div>
              </div>

              <a
                href="tel:112"
                className="mt-5 block rounded-xl bg-red-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-red-700"
              >
                📞 Call 112
              </a>
            </div>

            {/* Ambulance */}
            <div className="rounded-2xl border border-pink-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-3xl">
                  🚑
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    National Ambulance Service
                  </h3>

                  <p className="mt-1 text-sm text-gray-600">
                    Contact ambulance services for urgent medical
                    emergencies.
                  </p>
                </div>
              </div>

              <a
                href="tel:193"
                className="mt-5 block rounded-xl bg-pink-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-pink-700"
              >
                📞 Call 193
              </a>
            </div>

            {/* Police */}
            <div className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-3xl">
                  🛡️
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Ghana Police Service
                  </h3>

                  <p className="mt-1 text-sm text-gray-600">
                    For situations involving immediate personal safety
                    or security concerns.
                  </p>
                </div>
              </div>

              <a
                href="tel:191"
                className="mt-5 block rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                📞 Call 191
              </a>
            </div>

            {/* Fire Service */}
            <div className="rounded-2xl border border-orange-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-3xl">
                  🔥
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Ghana National Fire Service
                  </h3>

                  <p className="mt-1 text-sm text-gray-600">
                    For fire emergencies and situations requiring
                    rescue assistance.
                  </p>
                </div>
              </div>

              <a
                href="tel:192"
                className="mt-5 block rounded-xl bg-orange-500 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                📞 Call 192
              </a>
            </div>

          </div>
        </div>

        {/* Other Emergency Actions */}
        <div>
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            🏥 Other Emergency Assistance
          </h2>

          <div className="grid gap-5 md:grid-cols-2">

            {/* Healthcare Facilities */}
            <Link
              to="/emergency/facilities"
              className="rounded-2xl border border-purple-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-3xl">
                  🏥
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    Find Healthcare Facility
                  </h3>

                  <p className="mt-1 text-sm text-gray-600">
                    Find healthcare facilities that may be able to
                    assist you.
                  </p>
                </div>
              </div>
            </Link>

            {/* Emergency Contacts */}
            <Link
              to="/emergency/contacts"
              className="rounded-2xl border border-pink-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-3xl">
                  📞
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    Emergency Contacts
                  </h3>

                  <p className="mt-1 text-sm text-gray-600">
                    View emergency numbers and personal emergency
                    contacts.
                  </p>
                </div>
              </div>
            </Link>

          </div>
        </div>

        {/* Safety Notice */}
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5">
          <h3 className="font-bold text-gray-900">
            ℹ️ Important
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Emergency numbers and services are provided to help users
            quickly access appropriate assistance. Always seek
            professional help when an emergency requires it.
          </p>
        </div>

      </div>
    </div>
  );
}