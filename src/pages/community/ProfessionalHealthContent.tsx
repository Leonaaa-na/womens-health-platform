import { useState } from "react";
import { Link } from "react-router-dom";

interface ProfessionalArticle {
  id: number;
  professional: string;
  specialty: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  date: string;
  verified: boolean;
}

const professionalArticles: ProfessionalArticle[] = [
  {
    id: 1,
    professional: "Dr. Ama Mensah",
    specialty: "Obstetrician & Gynaecologist",
    title: "Understanding Your Menstrual Cycle",
    summary:
      "Learn about the different stages of the menstrual cycle and why understanding your cycle can be useful.",
    content:
      "The menstrual cycle involves several stages, including menstruation, the follicular phase, ovulation, and the luteal phase. Cycle patterns can vary between individuals. Tracking your cycle can help you understand your own pattern and notice changes that may be worth discussing with a healthcare professional.",
    category: "Menstrual Health",
    date: "August 20, 2026",
    verified: true,
  },
  {
    id: 2,
    professional: "Dr. Efua Owusu",
    specialty: "Women's Health Specialist",
    title: "When Should You Talk to a Healthcare Professional?",
    summary:
      "Some changes in your health deserve professional attention. Learn when it may be helpful to seek care.",
    content:
      "Changes in your usual health pattern can have many possible causes. Persistent, severe, or concerning symptoms should be discussed with an appropriate healthcare professional. Keeping track of symptoms, when they occur, and any changes over time can help make a healthcare consultation more useful.",
    category: "Women's Health",
    date: "August 18, 2026",
    verified: true,
  },
  {
    id: 3,
    professional: "Dr. Abena Boateng",
    specialty: "Fertility Specialist",
    title: "What Can Affect Fertility?",
    summary:
      "Fertility can be influenced by several factors. Here's a general overview of things healthcare professionals consider.",
    content:
      "Fertility is influenced by many factors, and experiences differ from person to person. Age, reproductive health, certain medical conditions, lifestyle factors, and other circumstances can all be relevant. If you have concerns about fertility, a qualified healthcare professional can help you understand your individual situation.",
    category: "Fertility",
    date: "August 15, 2026",
    verified: true,
  },
  {
    id: 4,
    professional: "Midwife Akosua Asante",
    specialty: "Registered Midwife",
    title: "Preparing for a Healthy Pregnancy",
    summary:
      "General considerations that can help someone prepare for pregnancy and discuss their plans with a healthcare professional.",
    content:
      "Preparing for pregnancy can involve discussing your health history and current medications with a healthcare professional, reviewing recommended health checks, and thinking about healthy habits. Individual recommendations can vary, so professional guidance is important when planning for pregnancy.",
    category: "Pregnancy",
    date: "August 12, 2026",
    verified: true,
  },
];

const categories = [
  "All",
  "Menstrual Health",
  "Women's Health",
  "Fertility",
  "Pregnancy",
];

export default function ProfessionalHealthContent() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedArticle, setSelectedArticle] =
    useState<ProfessionalArticle | null>(null);

  const filteredArticles =
    selectedCategory === "All"
      ? professionalArticles
      : professionalArticles.filter(
          (article) => article.category === selectedCategory
        );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-2xl">
              🩺
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Professional Health Content
              </h1>

              <p className="text-sm text-gray-600">
                Learn from health content created by healthcare
                professionals.
              </p>
            </div>
          </div>

          <Link
            to="/community"
            className="inline-block rounded-xl border border-pink-200 bg-white px-5 py-3 text-sm font-semibold text-pink-700 transition hover:bg-pink-50"
          >
            ← Back to Community
          </Link>
        </div>

        {/* Verified Notice */}
        <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-5">
          <div className="flex gap-3">
            <span className="text-2xl">✅</span>

            <div>
              <h2 className="font-bold text-gray-900">
                Verified healthcare professionals
              </h2>

              <p className="mt-1 text-sm leading-6 text-gray-600">
                Content marked with the verified badge is presented as
                professional content. In the full platform, professional
                verification will be connected to the backend.
              </p>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-bold text-gray-800">
            Browse by category
          </h2>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  selectedCategory === category
                    ? "bg-purple-600 text-white"
                    : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Articles */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Health Articles
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {filteredArticles.length}{" "}
            {filteredArticles.length === 1 ? "article" : "articles"}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              {/* Professional */}
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-100 text-xl">
                  👩🏾‍⚕️
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-gray-900">
                      {article.professional}
                    </p>

                    {article.verified && (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                        ✓ Verified
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-500">
                    {article.specialty}
                  </p>
                </div>
              </div>

              {/* Article */}
              <div className="mt-5">
                <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-700">
                  {article.category}
                </span>

                <h3 className="mt-4 text-xl font-bold text-gray-900">
                  {article.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {article.summary}
                </p>
              </div>

              {/* Footer */}
              <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-xs text-gray-400">
                  {article.date}
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedArticle(article)}
                  className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
                >
                  Read Article
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="text-5xl">🩺</div>

            <h3 className="mt-4 text-xl font-bold text-gray-900">
              No articles found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Try selecting another category.
            </p>
          </div>
        )}

        {/* Medical Notice */}
        <div className="mt-8 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
          <h3 className="font-bold text-gray-900">
            ⚠️ Important
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Professional health content is for general education and does
            not replace an individual medical assessment or professional
            healthcare advice.
          </p>
        </div>
      </div>

      {/* Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">

            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-700">
                    {selectedArticle.category}
                  </span>

                  {selectedArticle.verified && (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                      ✓ Verified Professional
                    </span>
                  )}
                </div>

                <h2 className="mt-4 text-2xl font-bold text-gray-900">
                  {selectedArticle.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="rounded-full bg-gray-100 px-3 py-2 text-gray-600 transition hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            {/* Professional */}
            <div className="mt-6 rounded-2xl bg-purple-50 p-4">
              <p className="font-bold text-gray-900">
                {selectedArticle.professional}
              </p>

              <p className="text-sm text-gray-600">
                {selectedArticle.specialty}
              </p>
            </div>

            {/* Content */}
            <div className="mt-6">
              <p className="text-base leading-8 text-gray-700">
                {selectedArticle.content}
              </p>
            </div>

            <p className="mt-6 text-xs text-gray-400">
              Published {selectedArticle.date}
            </p>

            <button
              type="button"
              onClick={() => setSelectedArticle(null)}
              className="mt-6 w-full rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
              Close Article
            </button>
          </div>
        </div>
      )}
    </div>
  );
}