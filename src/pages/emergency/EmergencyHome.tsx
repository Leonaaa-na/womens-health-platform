import { Link } from "react-router-dom";

function EmergencyHome() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
            Emergency Assistance
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            Emergency Home
          </h1>

          <p className="mt-3 max-w-2xl text-gray-600">
            Quick access to emergency contacts, healthcare
            facilities, emergency services, and trusted health
            information.
          </p>
        </div>

        {/* Emergency Warning */}
        <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-4">
            <div className="text-3xl">🚨</div>

            <div>
              <h2 className="text-lg font-bold text-red-800">
                Need immediate help?
              </h2>

              <p className="mt-2 text-sm leading-6 text-red-700">
                If you are experiencing a life-threatening
                emergency, contact your local emergency service
                or go to the nearest healthcare facility
                immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <section>
          <h2 className="mb-5 text-2xl font-bold text-gray-900">
            Quick Emergency Actions
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {/* Emergency Contacts */}
            <Link
              to="/emergency/contacts"
              className="group rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-3xl">
                📞
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-900">
                Emergency Contacts
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Access important emergency contacts quickly.
              </p>

              <span className="mt-4 inline-block text-sm font-semibold text-red-600">
                View Contacts →
              </span>
            </Link>

            {/* Healthcare Facility */}
            <Link
              to="/emergency/facilities"
              className="group rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-50 text-3xl">
                🏥
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-900">
                Find Healthcare Facility
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Find hospitals and healthcare facilities when
                you need assistance.
              </p>

              <span className="mt-4 inline-block text-sm font-semibold text-pink-600">
                Find Facility →
              </span>
            </Link>

            {/* Emergency Services */}
            <Link
              to="/emergency/services"
              className="group rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-3xl">
                📱
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-900">
                Emergency Services
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Access emergency services and essential support
                options.
              </p>

              <span className="mt-4 inline-block text-sm font-semibold text-orange-600">
                View Services →
              </span>
            </Link>

            {/* Emergency Information */}
            <Link
              to="/emergency/information"
              className="group rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-3xl">
                📚
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-900">
                Emergency Information
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Learn about emergency situations and find
                trusted health guidance.
              </p>

              <span className="mt-4 inline-block text-sm font-semibold text-blue-600">
                Learn More →
              </span>
            </Link>

          </div>
        </section>

        {/* Safety Notice */}
        <div className="mt-10 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-bold text-gray-900">
            Important Safety Notice
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            HerBloom provides information and tools to help you
            access appropriate support. Emergency information
            does not replace professional medical care.
          </p>
        </div>

      </div>
    </div>
  );
}

export default EmergencyHome;