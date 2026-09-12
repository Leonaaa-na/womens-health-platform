import { Link, useParams } from "react-router-dom";

interface Professional {
  id: number;
  name: string;
  specialty: string;
  location: string;
  experience: string;
  availability: string;
  verified: boolean;
  qualifications: string[];
  about: string;
  consultationTypes: string[];
}

const professionals: Professional[] = [
  {
    id: 1,
    name: "Dr. Ama Mensah",
    specialty: "Obstetrician & Gynaecologist",
    location: "Accra, Ghana",
    experience: "8 years experience",
    availability: "Available for consultation",
    verified: true,
    qualifications: [
      "MBChB",
      "Membership in Obstetrics & Gynaecology",
      "Women's Health Specialist",
    ],
    about:
      "Dr. Ama Mensah provides care and guidance relating to reproductive health, pregnancy, menstrual health and women's wellbeing.",
    consultationTypes: [
      "General Women's Health",
      "Pregnancy Care",
      "Menstrual Health",
    ],
  },
  {
    id: 2,
    name: "Dr. Efua Owusu",
    specialty: "Women's Health Specialist",
    location: "Kumasi, Ghana",
    experience: "6 years experience",
    availability: "Available this week",
    verified: true,
    qualifications: [
      "MBChB",
      "Women's Health Certification",
      "Reproductive Health Specialist",
    ],
    about:
      "Dr. Efua Owusu focuses on women's health and reproductive wellbeing, providing education and professional guidance.",
    consultationTypes: [
      "Women's Health",
      "Reproductive Health",
      "Wellbeing",
    ],
  },
  {
    id: 3,
    name: "Dr. Abena Boateng",
    specialty: "Fertility Specialist",
    location: "Accra, Ghana",
    experience: "10 years experience",
    availability: "Available for consultation",
    verified: true,
    qualifications: [
      "MBChB",
      "Fertility Medicine Certification",
      "Reproductive Health Specialist",
    ],
    about:
      "Dr. Abena Boateng provides professional guidance relating to fertility and reproductive health.",
    consultationTypes: [
      "Fertility",
      "Reproductive Health",
      "Conception Planning",
    ],
  },
  {
    id: 4,
    name: "Dr. Akosua Asante",
    specialty: "Midwife",
    location: "Tema, Ghana",
    experience: "7 years experience",
    availability: "Available this week",
    verified: true,
    qualifications: [
      "Registered Midwife",
      "Maternal Health Certification",
      "Pregnancy Care Specialist",
    ],
    about:
      "Dr. Akosua Asante supports women through pregnancy, maternal health education and preparation for childbirth.",
    consultationTypes: [
      "Pregnancy Care",
      "Maternal Health",
      "Birth Preparation",
    ],
  },
];

function ProfessionalProfile() {
  const { id } = useParams();

  const professional = professionals.find(
    (item) => item.id === Number(id)
  );

  if (!professional) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">

          <div className="text-5xl">
            👩🏾‍⚕️
          </div>

          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Professional Not Found
          </h1>

          <p className="mt-3 text-gray-600">
            We could not find the healthcare professional
            you are looking for.
          </p>

          <Link
            to="/healthcare-professionals"
            className="mt-6 inline-block rounded-lg bg-pink-600 px-5 py-3 font-semibold text-white transition hover:bg-pink-700"
          >
            Find a Professional
          </Link>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">

        {/* Back */}
        <Link
          to="/healthcare-professionals"
          className="text-sm font-semibold text-pink-600 hover:text-pink-700"
        >
          ← Back to Professionals
        </Link>

        {/* Profile Header */}
        <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">

          <div className="flex flex-col gap-6 md:flex-row md:items-start">

            {/* Profile Image */}
            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-pink-50 text-6xl">
              👩🏾‍⚕️
            </div>

            {/* Main Details */}
            <div className="flex-1">

              <div className="flex flex-wrap items-center gap-3">

                <h1 className="text-3xl font-bold text-gray-900">
                  {professional.name}
                </h1>

                {professional.verified && (
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    ✓ Verified Professional
                  </span>
                )}

              </div>

              <p className="mt-2 text-lg font-semibold text-pink-600">
                {professional.specialty}
              </p>

              <div className="mt-4 space-y-2 text-sm text-gray-600">

                <p>
                  📍 {professional.location}
                </p>

                <p>
                  🩺 {professional.experience}
                </p>

                <p className="font-semibold text-green-600">
                  ● {professional.availability}
                </p>

              </div>

            </div>

          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">

            <Link
              to={`/healthcare-professionals/${professional.id}/chat`}
              className="flex-1 rounded-lg bg-pink-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-pink-700"
            >
              💬 Start Consultation Chat
            </Link>

            <button
              type="button"
              className="flex-1 rounded-lg border border-pink-600 px-5 py-3 font-semibold text-pink-600 transition hover:bg-pink-50"
            >
              📅 Book an Appointment
            </button>

          </div>

        </div>

        {/* Profile Information */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">

          {/* About */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-gray-900">
              About
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              {professional.about}
            </p>

          </section>

          {/* Qualifications */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-gray-900">
              Qualifications
            </h2>

            <ul className="mt-4 space-y-3">

              {professional.qualifications.map(
                (qualification) => (
                  <li
                    key={qualification}
                    className="flex items-start gap-3 text-sm text-gray-600"
                  >
                    <span className="mt-0.5 text-pink-600">
                      ✓
                    </span>

                    <span>
                      {qualification}
                    </span>
                  </li>
                )
              )}

            </ul>

          </section>

        </div>

        {/* Consultation Areas */}
        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold text-gray-900">
            Consultation Areas
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Areas this professional can provide guidance
            and consultation for.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">

            {professional.consultationTypes.map(
              (type) => (
                <span
                  key={type}
                  className="rounded-full bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-600"
                >
                  {type}
                </span>
              )
            )}

          </div>

        </section>

        {/* Important Notice */}
        <div className="mt-6 rounded-2xl border border-pink-100 bg-pink-50 p-6">

          <h2 className="font-bold text-gray-900">
            Important
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Professional profiles and verification details
            will eventually be managed through HerBloom's
            backend and healthcare professional system.
            This page currently uses demonstration data.
          </p>

        </div>

      </div>
    </div>
  );
}

export default ProfessionalProfile;