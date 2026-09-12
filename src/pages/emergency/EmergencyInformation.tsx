import { useState } from "react";
import { Link } from "react-router-dom";

interface EmergencyGuide {
  title: string;
  icon: string;
  description: string;
  guidance: string[];
}

const emergencyGuides: EmergencyGuide[] = [
  {
    title: "Severe Bleeding",
    icon: "🩸",
    description:
      "Heavy or uncontrolled bleeding may require immediate emergency assistance.",
    guidance: [
      "Call emergency services if the bleeding is severe or does not stop.",
      "Apply firm pressure to the bleeding area with a clean cloth or dressing.",
      "Do not delay seeking professional medical assistance.",
    ],
  },
  {
    title: "Severe Abdominal or Pelvic Pain",
    icon: "🩺",
    description:
      "Sudden or severe abdominal or pelvic pain can require urgent medical assessment.",
    guidance: [
      "Seek urgent medical attention if the pain is severe, sudden, or worsening.",
      "Contact emergency services if the person appears seriously unwell.",
      "Do not rely on the app to determine the cause of severe pain.",
    ],
  },
  {
    title: "Pregnancy Emergency",
    icon: "🤰🏾",
    description:
      "Certain symptoms during pregnancy require prompt professional assessment.",
    guidance: [
      "Seek urgent medical care for severe pain, heavy bleeding, or other serious symptoms.",
      "Contact your healthcare professional or an emergency service when necessary.",
      "If the situation appears life-threatening, call emergency services immediately.",
    ],
  },
  {
    title: "Difficulty Breathing",
    icon: "🫁",
    description:
      "Serious difficulty breathing can be an emergency.",
    guidance: [
      "Call emergency services immediately if breathing difficulty is severe.",
      "Keep the person in a position that helps them breathe comfortably.",
      "Do not leave someone experiencing a serious breathing emergency alone.",
    ],
  },
  {
    title: "Fainting or Loss of Consciousness",
    icon: "⚠️",
    description:
      "Fainting or being unresponsive can require urgent medical attention.",
    guidance: [
      "Check that the person is responsive and breathing normally.",
      "Call emergency services if they are unresponsive or seriously unwell.",
      "Seek professional medical assessment, especially if the episode is unexplained.",
    ],
  },
  {
    title: "Personal Safety Emergency",
    icon: "🛡️",
    description:
      "Immediate threats to personal safety may require emergency assistance.",
    guidance: [
      "Move to a safer location if you can do so safely.",
      "Contact an appropriate emergency service when immediate help is needed.",
      "Contact a trusted person who can support you if appropriate.",
    ],
  },
];

export default function EmergencyInformation() {
  const [openGuide, setOpenGuide] = useState<string | null>(null);

  const toggleGuide = (title: string) => {
    setOpenGuide((current) => (current === title ? null : title));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 p-6">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-2xl">
              📚
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Emergency Information
              </h1>

              <p className="text-sm text-gray-600">
                Important health and safety guidance for emergency situations.
              </p>
            </div>
          </div>

          {/* Emergency Notice */}
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <h2 className="font-bold text-red-700">
              🚨 Important
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-700">
              This information is for general guidance only. It does not
              replace emergency services, a doctor, nurse, midwife, or
              other qualified healthcare professional.
            </p>

            <Link
              to="/emergency/services"
              className="mt-4 inline-block rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              📞 View Emergency Services
            </Link>
          </div>
        </div>

        {/* Emergency Guides */}
        <div>
          <h2 className="mb-2 text-xl font-bold text-gray-900">
            📖 Emergency Health Guidance
          </h2>

          <p className="mb-5 text-sm text-gray-600">
            Select a topic to view general guidance.
          </p>

          <div className="space-y-4">
            {emergencyGuides.map((guide) => {
              const isOpen = openGuide === guide.title;

              return (
                <div
                  key={guide.title}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                >
                  {/* Guide Header */}
                  <button
                    type="button"
                    onClick={() => toggleGuide(guide.title)}
                    className="flex w-full items-center justify-between p-5 text-left transition hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 text-2xl">
                        {guide.icon}
                      </div>

                      <div>
                        <h3 className="font-bold text-gray-900">
                          {guide.title}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {guide.description}
                        </p>
                      </div>
                    </div>

                    <span className="ml-4 text-xl text-gray-500">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {/* Guide Content */}
                  {isOpen && (
                    <div className="border-t border-gray-100 bg-gray-50 p-5">
                      <h4 className="mb-3 text-sm font-bold text-gray-800">
                        General guidance
                      </h4>

                      <ul className="space-y-3">
                        {guide.guidance.map((item, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-3 text-sm leading-6 text-gray-700"
                          >
                            <span className="mt-1 font-bold text-pink-600">
                              •
                            </span>

                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      <Link
                        to="/emergency/services"
                        className="mt-5 inline-block rounded-xl bg-pink-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-pink-700"
                      >
                        📞 Get Emergency Help
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Final Safety Notice */}
        <div className="mt-8 rounded-2xl border border-purple-200 bg-purple-50 p-5">
          <h3 className="font-bold text-gray-900">
            💜 Remember
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            When an emergency is serious or life-threatening, getting
            professional help quickly is more important than using an
            app. Use HerBloom to access emergency contacts and
            information, but always seek appropriate emergency care.
          </p>
        </div>

      </div>
    </div>
  );
}