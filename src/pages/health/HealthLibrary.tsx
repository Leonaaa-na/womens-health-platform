import { Link } from "react-router-dom";

const categories = [
  {
    name: "Menstrual Health",
    description: "Cycles, periods, symptoms and reproductive health.",
    icon: "🩸",
  },
  {
    name: "Pregnancy",
    description:
      "Pregnancy changes, care, warning signs and what to expect.",
    icon: "🤰🏾",
  },
  {
    name: "Fertility",
    description:
      "Fertility, conception and reproductive planning.",
    icon: "🌱",
  },
  {
    name: "Nutrition",
    description:
      "Healthy eating and nutrition for women's health.",
    icon: "🥗",
  },
  {
    name: "Mental Wellbeing",
    description:
      "Mental health during everyday life, pregnancy and beyond.",
    icon: "🧠",
  },
  {
    name: "Sleep",
    description:
      "Sleep, rest and healthy routines.",
    icon: "🌙",
  },
  {
    name: "Wellness & Exercise",
    description:
      "Movement, wellness and healthy lifestyle information.",
    icon: "🏃🏾‍♀️",
  },
  {
    name: "Postpartum",
    description:
      "Recovery, postnatal care and life after pregnancy.",
    icon: "👶🏾",
  },
];

function HealthLibrary() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-pink-600">
            Health Library
          </p>

          <h1 className="text-4xl font-bold text-gray-900">
            Learn. Understand. Take Care.
          </h1>

          <p className="mt-3 max-w-3xl text-gray-600">
            Explore reliable women's health information
            across different stages of life, pregnancy,
            postpartum care and wellbeing.
          </p>
        </div>

        {/* Search */}
        <div className="mb-10 rounded-2xl bg-white p-6 shadow-sm">
          <label
            htmlFor="health-search"
            className="mb-3 block text-sm font-semibold text-gray-700"
          >
            Search the Health Library
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="health-search"
              type="text"
              placeholder="Search articles, topics or health information..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
            />

            <button
              type="button"
              className="rounded-lg bg-pink-600 px-6 py-3 font-semibold text-white transition hover:bg-pink-700"
            >
              Search
            </button>
          </div>
        </div>

        {/* Featured Sections */}
        <div className="mb-10 grid gap-6 md:grid-cols-3">

          {/* Browse Articles */}
          <Link
            to="/health-library/articles"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 text-3xl">📖</div>

            <h2 className="text-xl font-bold text-gray-900">
              Browse Articles
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Explore health articles from reliable,
              verifiable medical sources.
            </p>

            <span className="mt-4 inline-block font-semibold text-pink-600">
              View Articles →
            </span>
          </Link>

          {/* Saved Articles */}
          <Link
            to="/health-library/saved"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 text-3xl">❤️</div>

            <h2 className="text-xl font-bold text-gray-900">
              Saved Articles
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Keep useful health information in one
              place for later.
            </p>

            <span className="mt-4 inline-block font-semibold text-pink-600">
              View Saved →
            </span>
          </Link>

          {/* Trusted Information */}
          <div className="rounded-2xl bg-pink-600 p-6 text-white shadow-sm">
            <div className="mb-4 text-3xl">🔎</div>

            <h2 className="text-xl font-bold">
              Trusted Information
            </h2>

            <p className="mt-2 text-sm leading-6 text-pink-50">
              Medical information will be connected to
              its original, verifiable source.
            </p>
          </div>

        </div>

        {/* Categories */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Explore Categories
            </h2>

            <p className="mt-1 text-gray-600">
              Find information based on what you want
              to learn about.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/health-library/articles?category=${encodeURIComponent(
                  category.name
                )}`}
                className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 text-3xl">
                  {category.icon}
                </div>

                <h3 className="text-lg font-bold text-gray-900">
                  {category.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {category.description}
                </p>

                <span className="mt-4 inline-block text-sm font-semibold text-pink-600">
                  Explore →
                </span>
              </Link>
            ))}

          </div>
        </div>

        {/* Important Note */}
        <div className="mt-10 rounded-2xl border border-pink-100 bg-pink-50 p-6">
          <h2 className="font-bold text-gray-900">
            A note about our health information
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            HerBloom's Health Library is designed to help
            you learn and prepare for conversations with
            healthcare professionals. Medical articles will
            identify their original sources, and personal
            experiences will be clearly labelled as personal
            stories rather than medical advice.
          </p>
        </div>

      </div>
    </div>
  );
}

export default HealthLibrary;