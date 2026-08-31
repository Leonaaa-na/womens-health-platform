import { useState } from "react";
import { Link } from "react-router-dom";

const articles = [
  {
    id: 1,
    title: "Understanding Your Menstrual Cycle",
    category: "Menstrual Health",
    description:
      "Learn about the different stages of the menstrual cycle and common changes.",
  },
  {
    id: 2,
    title: "What to Expect During Pregnancy",
    category: "Pregnancy",
    description:
      "Explore common pregnancy changes and important aspects of prenatal care.",
  },
  {
    id: 3,
    title: "Understanding Fertility",
    category: "Fertility",
    description:
      "Learn the basics of fertility and factors that can affect reproductive health.",
  },
  {
    id: 4,
    title: "Nutrition for Women's Health",
    category: "Nutrition",
    description:
      "Explore the role of balanced nutrition in supporting women's health.",
  },
  {
    id: 5,
    title: "Mental Wellbeing During Pregnancy",
    category: "Mental Wellbeing",
    description:
      "Learn about emotional wellbeing and mental health during pregnancy.",
  },
  {
    id: 6,
    title: "Sleep and Women's Health",
    category: "Sleep",
    description:
      "Understand why quality sleep matters and explore healthy sleep habits.",
  },
  {
    id: 7,
    title: "Wellness and Exercise",
    category: "Wellness & Exercise",
    description:
      "Explore healthy movement and everyday wellness.",
  },
  {
    id: 8,
    title: "Postpartum Recovery",
    category: "Postpartum",
    description:
      "Learn about physical and emotional changes after pregnancy.",
  },
];

function HealthSearch() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredArticles = articles.filter((article) => {
    const search = searchTerm.toLowerCase();

    return (
      article.title.toLowerCase().includes(search) ||
      article.category.toLowerCase().includes(search) ||
      article.description.toLowerCase().includes(search)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <Link
            to="/health-library"
            className="text-sm font-semibold text-pink-600 hover:text-pink-700"
          >
            ← Back to Health Library
          </Link>

          <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-pink-600">
            Health Library
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            Search Health Information
          </h1>

          <p className="mt-3 text-gray-600">
            Search for health topics, categories and articles.
          </p>
        </div>

        {/* Search Box */}
        <div className="mb-10 rounded-2xl bg-white p-6 shadow-sm">
          <label
            htmlFor="search"
            className="mb-3 block text-sm font-semibold text-gray-700"
          >
            What would you like to learn about?
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search pregnancy, fertility, nutrition..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
            />

            <button
              type="button"
              className="rounded-lg bg-pink-600 px-7 py-3 font-semibold text-white"
            >
              🔎 Search
            </button>
          </div>
        </div>

        {/* Results */}
        <div>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {searchTerm
                ? `Search Results`
                : "Health Articles"}
            </h2>

            <span className="text-sm text-gray-500">
              {filteredArticles.length} result
              {filteredArticles.length !== 1 ? "s" : ""}
            </span>
          </div>

          {filteredArticles.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2">

              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <span className="inline-block rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-600">
                    {article.category}
                  </span>

                  <h3 className="mt-4 text-xl font-bold text-gray-900">
                    {article.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    {article.description}
                  </p>

                  <button
                    type="button"
                    className="mt-5 font-semibold text-pink-600 hover:text-pink-700"
                  >
                    Read Article →
                  </button>
                </div>
              ))}

            </div>
          ) : (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <div className="text-4xl">🔎</div>

              <h2 className="mt-4 text-xl font-bold text-gray-900">
                No results found
              </h2>

              <p className="mt-2 text-gray-600">
                Try searching for another health topic.
              </p>
            </div>
          )}
        </div>

        {/* Information Notice */}
        <div className="mt-10 rounded-2xl border border-pink-100 bg-pink-50 p-6">
          <h2 className="font-bold text-gray-900">
            About our articles
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Health articles will be connected to reliable,
            verifiable medical sources. Original authors and
            sources will be identified where available.
          </p>
        </div>

      </div>
    </div>
  );
}

export default HealthSearch;