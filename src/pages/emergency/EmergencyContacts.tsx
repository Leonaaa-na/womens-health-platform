interface EmergencyContact {
  name: string;
  number: string;
  description: string;
  icon: string;
}

const medicalContacts: EmergencyContact[] = [
  {
    name: "National Ambulance Service",
    number: "193",
    description:
      "For urgent medical emergencies and ambulance assistance.",
    icon: "🚑",
  },
  {
    name: "National Emergency",
    number: "112",
    description:
      "For immediate emergency response and assistance.",
    icon: "🚨",
  },
];

const safetyContacts: EmergencyContact[] = [
  {
    name: "Ghana Police Service",
    number: "191",
    description:
      "For emergencies involving personal safety and situations requiring police assistance.",
    icon: "🛡️",
  },
  {
    name: "Ghana National Fire Service",
    number: "192",
    description:
      "For fire emergencies and rescue assistance.",
    icon: "🔥",
  },
];

function ContactCard({
  contact,
}: {
  contact: EmergencyContact;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pink-100 text-2xl">
          {contact.icon}
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">
            {contact.name}
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            {contact.description}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">
              {contact.number}
            </span>

            <a
              href={`tel:${contact.number}`}
              className="rounded-xl bg-pink-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-700"
            >
              📞 Call
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EmergencyContacts() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-2xl">
              📞
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Emergency Contacts
              </h1>

              <p className="text-sm text-gray-600">
                Important services to contact during an emergency.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800">
            <strong>Emergency?</strong> If you are experiencing a serious
            emergency, contact the appropriate emergency service.
          </div>
        </div>

        {/* Medical & Health Emergencies */}
        <section className="mb-8">
          <h2 className="mb-1 text-xl font-bold text-gray-900">
            🚑 Medical & Health Emergencies
          </h2>

          <p className="mb-4 text-sm text-gray-600">
            Services for urgent medical situations and emergency response.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {medicalContacts.map((contact) => (
              <ContactCard
                key={contact.number}
                contact={contact}
              />
            ))}
          </div>
        </section>

        {/* Safety & Rescue Emergencies */}
        <section className="mb-8">
          <h2 className="mb-1 text-xl font-bold text-gray-900">
            🛡️ Safety & Rescue Emergencies
          </h2>

          <p className="mb-4 text-sm text-gray-600">
            Services that may be needed when an emergency also involves
            personal safety or rescue.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {safetyContacts.map((contact) => (
              <ContactCard
                key={contact.number}
                contact={contact}
              />
            ))}
          </div>
        </section>

        {/* Personal Emergency Contacts */}
        <section>
          <div className="rounded-2xl border border-purple-200 bg-purple-50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-2xl">
                👥
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">
                  👥 Personal Emergency Contacts
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  People you trust who can be contacted when you need
                  personal support.
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-white p-4">
                    <p className="font-semibold text-gray-900">
                      Trusted Family Member
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Add a family member
                    </p>
                  </div>

                  <div className="rounded-xl bg-white p-4">
                    <p className="font-semibold text-gray-900">
                      Partner / Guardian
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Add a trusted person
                    </p>
                  </div>

                  <div className="rounded-xl bg-white p-4">
                    <p className="font-semibold text-gray-900">
                      Doctor / Healthcare Professional
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Add a healthcare contact
                    </p>
                  </div>

                  <div className="rounded-xl bg-white p-4">
                    <p className="font-semibold text-gray-900">
                      Other Contact
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Add someone you choose
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-5 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
                >
                  + Add Personal Contact
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Notice */}
        <div className="mt-8 rounded-xl bg-white p-4 text-center text-xs text-gray-500 shadow-sm">
          Emergency contact numbers are provided for quick access. Always use
          the appropriate service for your situation.
        </div>

      </div>
    </div>
  );
}