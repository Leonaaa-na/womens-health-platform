import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Section =
  | "privacy"
  | "terms"
  | "medical"
  | null;

const PrivacyTerms = () => {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] =
    useState<Section>(null);

  const toggleSection = (section: Exclude<Section, null>) => {
    setActiveSection(
      activeSection === section ? null : section
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="mb-5 text-sm font-semibold text-pink-600 transition hover:text-pink-700"
          >
            ← Back to Profile
          </button>

          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-pink-100 to-purple-100 text-4xl shadow-md">
              📄
            </div>

            <h1 className="mt-5 text-3xl font-bold text-gray-800">
              Privacy & Terms
            </h1>

            <p className="mt-2 text-gray-600">
              Understand how HerBloom handles information and how the
              platform should be used.
            </p>
          </div>
        </div>

        {/* Important Notice */}
        <div className="mb-6 rounded-2xl border border-pink-200 bg-pink-50 p-6">
          <div className="flex gap-4">
            <span className="text-2xl">🌸</span>

            <div>
              <h2 className="font-bold text-pink-800">
                HerBloom Privacy & Legal Information
              </h2>

              <p className="mt-2 text-sm leading-7 text-pink-700">
                HerBloom is designed to support women's health management,
                education, and access to healthcare-related services.
                Because the platform may involve personal and
                health-related information, protecting user privacy is
                an important part of the HerBloom experience.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Policy */}
        <section className="mb-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md">

          <button
            type="button"
            onClick={() => toggleSection("privacy")}
            className="flex w-full items-center justify-between p-6 text-left transition hover:bg-pink-50"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">🔒</span>

              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Privacy Policy
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  How HerBloom may collect, use, protect, and manage
                  information.
                </p>
              </div>
            </div>

            <span className="text-2xl text-gray-400">
              {activeSection === "privacy" ? "−" : "+"}
            </span>
          </button>

          {activeSection === "privacy" && (
            <div className="border-t border-gray-100 p-6">

              <div className="space-y-7 text-sm leading-7 text-gray-600">

                <div>
                  <h3 className="text-base font-bold text-gray-800">
                    1. Information We May Collect
                  </h3>

                  <p className="mt-2">
                    Depending on the features a user chooses to use,
                    HerBloom may collect information such as a user's
                    name, email address, account credentials, and
                    information voluntarily entered into the platform.
                  </p>

                  <p className="mt-2">
                    Health-related information may include information
                    entered into features such as period tracking,
                    pregnancy tracking, symptoms, medication records,
                    wellness information, appointments, and other
                    health-management tools.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-800">
                    2. How Information May Be Used
                  </h3>

                  <p className="mt-2">
                    Information may be used to provide and operate
                    HerBloom features, maintain user accounts,
                    personalize platform experiences, provide reminders,
                    support appointments, improve the platform, and
                    maintain security.
                  </p>

                  <p className="mt-2">
                    HerBloom should only use information for legitimate
                    purposes connected to the services provided by the
                    platform and purposes communicated to users.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-800">
                    3. Health Information
                  </h3>

                  <p className="mt-2">
                    Some HerBloom features allow users to voluntarily
                    record health-related information. Users should
                    understand that information entered into these
                    features may be sensitive and should take reasonable
                    steps to protect access to their account.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-800">
                    4. Appointments and Healthcare Professionals
                  </h3>

                  <p className="mt-2">
                    When users choose to use healthcare professional or
                    appointment features, information necessary to
                    provide those services may be processed or shared
                    with the relevant service provider, subject to the
                    applicable service and user's choices.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-800">
                    5. Community Information
                  </h3>

                  <p className="mt-2">
                    HerBloom may provide community features that allow
                    users to create posts, comments, or other content.
                    Users should avoid posting sensitive personal
                    information that they do not want other community
                    members to see.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-800">
                    6. Device and Technical Information
                  </h3>

                  <p className="mt-2">
                    The platform may process limited technical information
                    required to operate, secure, troubleshoot, and
                    improve the service. The specific information
                    collected will depend on the final HerBloom
                    implementation.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-800">
                    7. Information Sharing
                  </h3>

                  <p className="mt-2">
                    HerBloom should not share personal information with
                    third parties except where necessary to provide a
                    requested service, protect the platform and its
                    users, comply with applicable legal requirements,
                    or where the user has otherwise provided appropriate
                    permission.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-800">
                    8. Data Security
                  </h3>

                  <p className="mt-2">
                    HerBloom is intended to use appropriate technical and
                    organizational safeguards to help protect personal
                    information against unauthorized access, loss,
                    misuse, alteration, or disclosure.
                  </p>

                  <p className="mt-2">
                    No digital service can guarantee absolute security,
                    so users should also protect their passwords and
                    account access.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-800">
                    9. Data Retention and Deletion
                  </h3>

                  <p className="mt-2">
                    Information should be retained only for as long as
                    reasonably necessary for the purposes for which it
                    was collected, subject to applicable legal,
                    security, and operational requirements.
                  </p>

                  <p className="mt-2">
                    HerBloom's final account deletion and data-retention
                    procedures will be described in the finalized
                    privacy policy.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-800">
                    10. User Privacy Choices
                  </h3>

                  <p className="mt-2">
                    HerBloom is designed to give users appropriate
                    control over information they provide and the
                    privacy-related settings available within the
                    platform.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-800">
                    11. Policy Updates
                  </h3>

                  <p className="mt-2">
                    This Privacy Policy may be updated as HerBloom
                    develops. Significant changes should be communicated
                    through appropriate platform channels.
                  </p>
                </div>

              </div>
            </div>
          )}
        </section>

        {/* Terms of Service */}
        <section className="mb-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md">

          <button
            type="button"
            onClick={() => toggleSection("terms")}
            className="flex w-full items-center justify-between p-6 text-left transition hover:bg-purple-50"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">📋</span>

              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Terms of Service
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Rules and conditions for using HerBloom.
                </p>
              </div>
            </div>

            <span className="text-2xl text-gray-400">
              {activeSection === "terms" ? "−" : "+"}
            </span>
          </button>

          {activeSection === "terms" && (
            <div className="border-t border-gray-100 p-6">

              <div className="space-y-7 text-sm leading-7 text-gray-600">

                <div>
                  <h3 className="text-base font-bold text-gray-800">
                    1. Acceptance of These Terms
                  </h3>

                  <p className="mt-2">
                    By accessing or using HerBloom, users agree to use
                    the platform responsibly and in accordance with
                    these terms and any applicable laws.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-800">
                    2. HerBloom Services
                  </h3>

                  <p className="mt-2">
                    HerBloom may provide period tracking, pregnancy
                    tracking, health education, healthcare professional
                    information, appointments, reminders, emergency
                    assistance information, community features, and
                    other health-management tools.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-800">
                    3. Account Responsibilities
                  </h3>

                  <p className="mt-2">
                    Users are responsible for providing accurate
                    information where required and keeping their account
                    credentials confidential.
                  </p>

                  <p className="mt-2">
                    Users should notify HerBloom through the appropriate
                    support channel if they believe their account has
                    been accessed without authorization.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-800">
                    4. Acceptable Use
                  </h3>

                  <p className="mt-2">
                    Users must not use HerBloom to abuse, threaten,
                    impersonate, harass, deceive, or unlawfully harm
                    another person.
                  </p>

                  <p className="mt-2">
                    Users must not intentionally interfere with the
                    operation or security of the platform.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-800">
                    5. Health Information
                  </h3>

                  <p className="mt-2">
                    Users are responsible for the information they enter
                    into personal health-management features. Users
                    should provide information as accurately as possible
                    when using tracking and record-keeping tools.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-800">
                    6. Healthcare Professionals
                  </h3>

                  <p className="mt-2">
                    HerBloom may provide access to healthcare
                    professional profiles or communication features.
                    Information displayed about professionals should be
                    treated as platform information and verified where
                    appropriate before relying on it for healthcare
                    decisions.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-800">
                    7. Appointments
                  </h3>

                  <p className="mt-2">
                    Appointment availability, scheduling, cancellation,
                    and rescheduling may depend on the relevant
                    healthcare professional or service provider.
                  </p>

                  <p className="mt-2">
                    Users should review appointment details carefully and
                    follow any instructions provided by the relevant
                    healthcare provider.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-800">
                    8. Community Content
                  </h3>

                  <p className="mt-2">
                    Users are responsible for content they post within
                    HerBloom's community features.
                  </p>

                  <p className="mt-2">
                    Community content should remain respectful and must
                    not intentionally contain harmful, abusive,
                    misleading, or unlawful material.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-800">
                    9. Emergency Features
                  </h3>

                  <p className="mt-2">
                    Emergency information and contact features are
                    intended to help users locate or access emergency
                    resources. HerBloom does not replace emergency
                    services or emergency medical care.
                  </p>

                  <p className="mt-2">
                    In an emergency, users should contact the appropriate
                    emergency service or seek immediate professional
                    assistance.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-800">
                    10. Premium Services
                  </h3>

                  <p className="mt-2">
                    HerBloom may offer optional Premium features.
                    Premium pricing, subscription periods, payment
                    conditions, cancellation procedures, and available
                    features may be updated as the service develops.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-800">
                    11. Third-Party Services
                  </h3>

                  <p className="mt-2">
                    Some HerBloom features may depend on third-party
                    services or external websites. Those services may
                    have their own terms and privacy policies.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-800">
                    12. Intellectual Property
                  </h3>

                  <p className="mt-2">
                    HerBloom's original branding, interface, software,
                    design elements, and platform content are intended
                    to remain the property of their respective owners
                    unless otherwise stated.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-800">
                    13. Service Changes
                  </h3>

                  <p className="mt-2">
                    HerBloom may add, modify, suspend, or remove features
                    as the platform develops, subject to applicable
                    requirements and any commitments made to users.
                  </p>
                </div>

              </div>
            </div>
          )}
        </section>

        {/* Medical Disclaimer */}
        <section className="mb-6 overflow-hidden rounded-2xl border border-yellow-100 bg-white shadow-md">

          <button
            type="button"
            onClick={() => toggleSection("medical")}
            className="flex w-full items-center justify-between p-6 text-left transition hover:bg-yellow-50"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">⚠️</span>

              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Medical & Health Disclaimer
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Important information about HerBloom's health features.
                </p>
              </div>
            </div>

            <span className="text-2xl text-gray-400">
              {activeSection === "medical" ? "−" : "+"}
            </span>
          </button>

          {activeSection === "medical" && (
            <div className="border-t border-gray-100 p-6">

              <div className="rounded-2xl bg-yellow-50 p-6 text-sm leading-7 text-gray-700">

                <h3 className="font-bold text-gray-800">
                  HerBloom is a health-support platform.
                </h3>

                <p className="mt-3">
                  HerBloom's trackers, educational materials, reminders,
                  community features, and other tools are intended to
                  support health management and education.
                </p>

                <p className="mt-3">
                  They are not intended to replace examination,
                  diagnosis, treatment, or advice from a qualified
                  healthcare professional.
                </p>

                <p className="mt-3">
                  Health information available through HerBloom may not
                  apply to every individual. Users should consult an
                  appropriate healthcare professional when they need
                  personalized medical advice.
                </p>

                <p className="mt-3 font-semibold text-gray-800">
                  If you believe you are experiencing a medical
                  emergency, seek emergency assistance immediately.
                </p>

              </div>
            </div>
          )}
        </section>

        {/* Final Notice */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">

          <p className="text-xs leading-6 text-gray-500">
            These Privacy Policy and Terms of Service sections are
            preliminary platform wording for the HerBloom project.
            They should be reviewed and finalized by an appropriately
            qualified legal professional before HerBloom is released
            publicly.
          </p>

          <p className="mt-3 text-xs font-semibold text-pink-600">
            HerBloom — Her health. Her journey. Her bloom. 🌸
          </p>

        </div>

      </div>
    </div>
  );
};

export default PrivacyTerms;