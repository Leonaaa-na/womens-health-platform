import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

interface HealthArticle {
  id: number;
  title: string;
  category: string;
  type: "Medical Article" | "Personal Experience";
  author: string;
  source: string;
  publishedDate: string;
  summary: string;
  content: string;
  sourceUrl: string;
}

const healthArticles: HealthArticle[] = [
  {
    id: 1,
    title: "Menstrual Health and the Menstrual Cycle",
    category: "Menstrual Health",
    type: "Medical Article",
    author: "World Health Organization",
    source: "WHO",
    publishedDate: "2024",
    summary:
      "Learn about menstrual health, the menstrual cycle and factors that can affect menstrual wellbeing.",
    content:
      "Menstrual health is an important part of overall health. Understanding your cycle can help you recognize your normal patterns and identify changes that may need professional attention.",
    sourceUrl:
      "https://www.who.int/news-room/fact-sheets/detail/menstrual-health",
  },
  {
    id: 2,
    title: "Pregnancy and Antenatal Care",
    category: "Pregnancy",
    type: "Medical Article",
    author: "World Health Organization",
    source: "WHO",
    publishedDate: "2024",
    summary:
      "Understand the importance of antenatal care and regular healthcare visits during pregnancy.",
    content:
      "Antenatal care helps support the health and wellbeing of pregnant women and their babies. Regular contact with qualified healthcare professionals can help monitor pregnancy and identify concerns early.",
    sourceUrl:
      "https://www.who.int/health-topics/maternal-health",
  },
  {
    id: 3,
    title: "Infertility and Fertility Health",
    category: "Fertility",
    type: "Medical Article",
    author: "World Health Organization",
    source: "WHO",
    publishedDate: "2024",
    summary:
      "Learn about infertility, fertility challenges and when professional support may be appropriate.",
    content:
      "Infertility can affect individuals and couples for many different reasons. Understanding fertility and seeking appropriate medical advice can help people make informed decisions about their health.",
    sourceUrl:
      "https://www.who.int/news-room/fact-sheets/detail/infertility",
  },
  {
    id: 4,
    title: "Healthy Diet and Nutrition",
    category: "Nutrition",
    type: "Medical Article",
    author: "World Health Organization",
    source: "WHO",
    publishedDate: "2024",
    summary:
      "Explore the basics of healthy eating and balanced nutrition.",
    content:
      "A healthy diet provides the nutrients needed for growth, energy and normal body function. A balanced eating pattern can include a variety of fruits, vegetables, whole grains, proteins and other nutritious foods.",
    sourceUrl:
      "https://www.who.int/news-room/fact-sheets/detail/healthy-diet",
  },
  {
    id: 5,
    title: "Mental Health and Wellbeing",
    category: "Mental Wellbeing",
    type: "Medical Article",
    author: "World Health Organization",
    source: "WHO",
    publishedDate: "2024",
    summary:
      "Learn about mental health and why emotional wellbeing is an important part of overall health.",
    content:
      "Mental health is an important part of overall wellbeing. Looking after mental health can involve healthy routines, social connection, rest and seeking professional support when needed.",
    sourceUrl:
      "https://www.who.int/health-topics/mental-health",
  },
  {
    id: 6,
    title: "Sleep and Health",
    category: "Sleep",
    type: "Medical Article",
    author: "World Health Organization",
    source: "WHO",
    publishedDate: "2024",
    summary:
      "Understand why healthy sleep is important for physical and mental wellbeing.",
    content:
      "Sleep supports physical health, mental wellbeing and normal daily functioning. Consistent sleep routines and a suitable sleep environment can support healthier sleep habits.",
    sourceUrl:
      "https://www.who.int/health-topics/sleep",
  },
  {
    id: 7,
    title: "Physical Activity and Health",
    category: "Wellness & Exercise",
    type: "Medical Article",
    author: "World Health Organization",
    source: "WHO",
    publishedDate: "2024",
    summary:
      "Learn how regular physical activity can support overall health and wellbeing.",
    content:
      "Regular physical activity can benefit physical and mental health. Activities can be adapted to individual abilities, preferences and circumstances.",
    sourceUrl:
      "https://www.who.int/news-room/fact-sheets/detail/physical-activity",
  },
  {
    id: 8,
    title: "Postpartum Health",
    category: "Postpartum",
    type: "Medical Article",
    author: "World Health Organization",
    source: "WHO",
    publishedDate: "2024",
    summary:
      "Learn about the importance of care and support after childbirth.",
    content:
      "The period after childbirth is an important time for recovery and adjustment. Postpartum care can support both the mother and baby and provide opportunities to identify health concerns.",
    sourceUrl:
      "https://www.who.int/health-topics/maternal-health",
  },
  {
    id: 9,
    title: "Understanding Menstrual Pain",
    category: "Menstrual Health",
    type: "Medical Article",
    author: "World Health Organization",
    source: "WHO",
    publishedDate: "2024",
    summary:
      "Learn about menstrual pain and when symptoms may require medical attention.",
    content:
      "Some menstrual discomfort can occur during a period. Severe, persistent or unusual pain should be discussed with a qualified healthcare professional because it can sometimes be associated with an underlying condition.",
    sourceUrl:
      "https://www.who.int/health-topics/menstrual-health",
  },
  {
    id: 10,
    title: "Nutrition During Pregnancy",
    category: "Pregnancy",
    type: "Medical Article",
    author: "World Health Organization",
    source: "WHO",
    publishedDate: "2024",
    summary:
      "Understand the importance of appropriate nutrition during pregnancy.",
    content:
      "Good nutrition during pregnancy supports the health of the mother and developing baby. Individual nutritional needs can vary, so pregnancy nutrition should be discussed with a qualified healthcare professional.",
    sourceUrl:
      "https://www.who.int/health-topics/maternal-health",
  },
  {
    id: 11,
    title: "Healthy Lifestyle and Everyday Wellness",
    category: "Wellness & Exercise",
    type: "Medical Article",
    author: "World Health Organization",
    source: "WHO",
    publishedDate: "2024",
    summary:
      "Explore everyday habits that can contribute to general health and wellbeing.",
    content:
      "Healthy living can involve regular movement, nutritious food, sufficient rest, social connection and appropriate healthcare. Small sustainable habits can contribute to overall wellbeing.",
    sourceUrl:
      "https://www.who.int/health-topics/physical-activity",
  },
];

const categories = [
  "All",
  "Menstrual Health",
  "Pregnancy",
  "Fertility",
  "Nutrition",
  "Mental Wellbeing",
  "Sleep",
  "Wellness & Exercise",
  "Postpartum",
];

function HealthLibrary() {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [search, setSearch] = useState("");

  const filteredArticles = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return healthArticles.filter((article) => {
      const matchesCategory =
        selectedCategory === "All" ||
        article.category === selectedCategory;

      const matchesSearch =
        !searchValue ||
        article.title.toLowerCase().includes(searchValue) ||
        article.category.toLowerCase().includes(searchValue) ||
        article.author.toLowerCase().includes(searchValue) ||
        article.summary.toLowerCase().includes(searchValue);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, search]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate("/period-tracker")}
            className="mb-5 text-sm font-medium text-pink-600 hover:text-pink-700"
          >
            ← Back to Dashboard
          </button>

          <h1 className="text-3xl font-bold text-gray-900">
            Health Library
          </h1>

          <p className="mt-2 max-w-3xl text-gray-600">
            Reliable health information to help you learn,
            understand your body and prepare for conversations
            with healthcare professionals.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search health articles..."
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pl-11 text-sm outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            />

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              🔎
            </span>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex min-w-max gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setSelectedCategory(category)
                }
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedCategory === category
                    ? "bg-pink-600 text-white"
                    : "bg-white text-gray-600 shadow-sm hover:bg-pink-50 hover:text-pink-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Article Count */}
        <div className="mb-5">
          <p className="text-sm text-gray-500">
            {filteredArticles.length}{" "}
            {filteredArticles.length === 1
              ? "article"
              : "articles"}{" "}
            found
          </p>
        </div>

        {/* Articles */}
        {filteredArticles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                className="flex flex-col rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {/* Category */}
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-600">
                    {article.category}
                  </span>

                  <span className="text-xs text-gray-400">
                    {article.type}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-900">
                  {article.title}
                </h2>

                {/* Summary */}
                <p className="mt-3 flex-1 text-sm leading-6 text-gray-600">
                  {article.summary}
                </p>

                {/* Source */}
                <div className="mt-5 border-t border-gray-100 pt-4">
                  <p className="text-xs text-gray-500">
                    Source
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {article.source}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {article.author} ·{" "}
                    {article.publishedDate}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/health-library/article/${article.id}`
                      )
                    }
                    className="flex-1 rounded-xl bg-pink-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-pink-700"
                  >
                    Read Article
                  </button>

                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    Source ↗
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
            <div className="text-4xl">📚</div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              No articles found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Try another search term or choose a different
              category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
              className="mt-5 rounded-xl bg-pink-600 px-5 py-3 text-sm font-semibold text-white hover:bg-pink-700"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Information Notice */}
        <div className="mt-10 rounded-2xl border border-pink-100 bg-pink-50 p-6">
          <h2 className="text-lg font-bold text-gray-900">
            About HerBloom's Health Library
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-600">
            HerBloom's Health Library is designed to help
            you learn and prepare for conversations with
            healthcare professionals. Medical articles
            identify their original sources, and personal
            experiences are clearly labelled as personal
            stories rather than medical advice.
          </p>
        </div>

      </div>
    </div>
  );
}

export default HealthLibrary;