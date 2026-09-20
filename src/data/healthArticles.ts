export interface HealthArticle {
  id: number;
  title: string;
  category: string;
  categorySlug: string;
  type: "Medical Article" | "Personal Experience";
  author: string;
  source: string;
  publishedDate: string;
  summary: string;
  content: string;
  sourceUrl: string;
}

export const healthArticles: HealthArticle[] = [
  {
    id: 1,
    title: "Menstrual Health and the Menstrual Cycle",
    category: "Menstrual Health",
    categorySlug: "menstrual-health",
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
    categorySlug: "pregnancy",
    type: "Medical Article",
    author: "World Health Organization",
    source: "WHO",
    publishedDate: "2024",
    summary:
      "Understand the importance of antenatal care and regular healthcare visits during pregnancy.",
    content:
      "Antenatal care supports the health and wellbeing of pregnant women and their babies. Regular contact with qualified healthcare professionals can help monitor pregnancy and identify concerns early.",
    sourceUrl:
      "https://www.who.int/health-topics/maternal-health",
  },

  {
    id: 3,
    title: "Infertility and Fertility Health",
    category: "Fertility",
    categorySlug: "fertility",
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
    categorySlug: "nutrition",
    type: "Medical Article",
    author: "World Health Organization",
    source: "WHO",
    publishedDate: "2024",
    summary:
      "Explore the basics of healthy eating and balanced nutrition.",
    content:
      "A healthy diet provides nutrients needed for growth, energy and normal body function. A balanced eating pattern can include a variety of fruits, vegetables, whole grains, proteins and other nutritious foods.",
    sourceUrl:
      "https://www.who.int/news-room/fact-sheets/detail/healthy-diet",
  },

  {
    id: 5,
    title: "Mental Health and Wellbeing",
    category: "Mental Wellbeing",
    categorySlug: "mental-wellbeing",
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
    categorySlug: "sleep",
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
    categorySlug: "wellness-exercise",
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
    categorySlug: "postpartum",
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
    categorySlug: "menstrual-health",
    type: "Medical Article",
    author: "World Health Organization",
    source: "WHO",
    publishedDate: "2024",
    summary:
      "Learn about menstrual pain and when symptoms may require medical attention.",
    content:
      "Some menstrual discomfort can occur during a period. Severe, persistent or unusual pain should be discussed with a qualified healthcare professional because it can sometimes be associated with an underlying condition.",
    sourceUrl:
      "https://www.who.int/news-room/fact-sheets/detail/menstrual-health",
  },

  {
    id: 10,
    title: "Nutrition During Pregnancy",
    category: "Pregnancy",
    categorySlug: "pregnancy",
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
    categorySlug: "wellness-exercise",
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