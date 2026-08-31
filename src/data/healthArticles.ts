export interface HealthArticle {
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

export const healthArticles: HealthArticle[] = [
  // =========================
  // MENSTRUAL HEALTH
  // =========================

  {
    id: 1,
    title: "Menstrual Health",
    category: "Menstrual Health",
    type: "Medical Article",
    author: "World Health Organization",
    source: "World Health Organization (WHO)",
    publishedDate: "2024",
    summary:
      "Learn about menstrual health and its importance to women's physical, mental and social wellbeing.",
    content:
      "Menstrual health is an important part of sexual and reproductive health. Reliable information, access to appropriate menstrual products, sanitation and healthcare can support women and girls throughout their menstrual years.",
    sourceUrl:
      "https://www.who.int/health-topics/sexual-and-reproductive-health-and-rights",
  },

  // =========================
  // PREGNANCY
  // =========================

  {
    id: 2,
    title: "Keeping Well During Pregnancy",
    category: "Pregnancy",
    type: "Medical Article",
    author: "World Health Organization",
    source: "World Health Organization (WHO)",
    publishedDate: "2022",
    summary:
      "Explore important health information and care considerations during pregnancy.",
    content:
      "Pregnancy is an important period for maternal and fetal health. Regular healthcare visits, attention to nutrition, physical activity where appropriate and awareness of warning signs can support a healthy pregnancy.",
    sourceUrl:
      "https://www.who.int/tools/your-life-your-health/life-phase/pregnancy--birth-and-after-childbirth/keeping-well-during-pregnancy-and-after-childbirth",
  },

  // =========================
  // FERTILITY
  // =========================

  {
    id: 3,
    title: "Infertility and Fertility Care",
    category: "Fertility",
    type: "Medical Article",
    author: "World Health Organization",
    source: "World Health Organization (WHO)",
    publishedDate: "2024",
    summary:
      "Learn about infertility, fertility care and reproductive health.",
    content:
      "Fertility can be affected by many different factors. Infertility is a medical condition that can affect people and couples, and appropriate evaluation and care from qualified healthcare professionals can help identify possible causes and available options.",
    sourceUrl:
      "https://www.who.int/health-topics/infertility",
  },

  // =========================
  // NUTRITION
  // =========================

  {
    id: 4,
    title: "Healthy Diet",
    category: "Nutrition",
    type: "Medical Article",
    author: "World Health Organization",
    source: "World Health Organization (WHO)",
    publishedDate: "2026",
    summary:
      "Learn the basic principles of a healthy and balanced diet.",
    content:
      "A healthy diet supports wellbeing throughout life. WHO describes adequacy, balance, moderation and diversity as important principles of healthy eating. Individual nutritional needs can vary depending on age, health and other circumstances.",
    sourceUrl:
      "https://www.who.int/news-room/fact-sheets/detail/healthy-diet",
  },

  // =========================
  // MENTAL WELLBEING
  // =========================

  {
    id: 5,
    title: "Perinatal Mental Health",
    category: "Mental Wellbeing",
    type: "Medical Article",
    author: "World Health Organization",
    source: "World Health Organization (WHO)",
    publishedDate: "2024",
    summary:
      "Learn about mental wellbeing during pregnancy and after childbirth.",
    content:
      "Mental health is an important part of maternal health. Some women experience mental health conditions during pregnancy or after childbirth. Early identification, appropriate support and professional care can help women receive the assistance they need.",
    sourceUrl:
      "https://www.who.int/teams/mental-health-and-substance-use/promotion-prevention/perinatal-mental-health",
  },

  // =========================
  // SLEEP
  // =========================

  {
    id: 6,
    title: "Sleep and Wellbeing",
    category: "Sleep",
    type: "Medical Article",
    author: "World Health Organization",
    source: "World Health Organization (WHO)",
    publishedDate: "2024",
    summary:
      "Explore why healthy sleep is an important part of overall wellbeing.",
    content:
      "Sleep is an important part of maintaining health and wellbeing. Sleep needs can change throughout life, and factors such as stress, lifestyle and health conditions can affect sleep.",
    sourceUrl:
      "https://www.who.int/health-topics/sleep",
  },

  // =========================
  // WELLNESS & EXERCISE
  // =========================

  {
    id: 7,
    title: "Physical Activity and Women's Health",
    category: "Wellness & Exercise",
    type: "Medical Article",
    author: "World Health Organization",
    source: "World Health Organization (WHO)",
    publishedDate: "2024",
    summary:
      "Learn about the health benefits of regular physical activity.",
    content:
      "Regular physical activity is associated with a range of health benefits. The appropriate type and amount of activity can vary between people, and pregnant or postpartum women should consider guidance from qualified healthcare professionals when special circumstances or complications are present.",
    sourceUrl:
      "https://www.who.int/news-room/fact-sheets/detail/physical-activity",
  },

  // =========================
  // POSTPARTUM
  // =========================

  {
    id: 8,
    title: "Postnatal Care and Recovery",
    category: "Postpartum",
    type: "Medical Article",
    author: "World Health Organization",
    source: "World Health Organization (WHO)",
    publishedDate: "2022",
    summary:
      "Learn about physical and emotional care during the period after childbirth.",
    content:
      "The postnatal period is an important stage of maternal and newborn care. Appropriate care can support physical recovery, mental wellbeing, breastfeeding, family planning and the health of both mother and baby.",
    sourceUrl:
      "https://www.who.int/publications/i/item/9789240045989",
  },

  {
    id: 9,
    title: "Postpartum Mental Health",
    category: "Postpartum",
    type: "Medical Article",
    author: "World Health Organization",
    source: "World Health Organization (WHO)",
    publishedDate: "2024",
    summary:
      "Understand why mental health support is an important part of care after childbirth.",
    content:
      "Mental wellbeing should be considered as part of postnatal care. Some women experience depression or other mental health difficulties after childbirth. Professional support can help with identification, treatment and recovery.",
    sourceUrl:
      "https://www.who.int/teams/mental-health-and-substance-use/promotion-prevention/perinatal-mental-health",
  },

  // =========================
  // PREGNANCY - DEEPER TOPIC
  // =========================

  {
    id: 10,
    title: "Nutrition During Pregnancy",
    category: "Pregnancy",
    type: "Medical Article",
    author: "World Health Organization",
    source: "World Health Organization (WHO)",
    publishedDate: "2023",
    summary:
      "Learn about nutrition counselling and healthy eating during pregnancy.",
    content:
      "Good nutrition during pregnancy supports the health of the mother and unborn child. WHO recommends nutrition counselling during pregnancy, with attention to a varied and balanced diet and appropriate nutritional support.",
    sourceUrl:
      "https://www.who.int/tools/elena/interventions/nutrition-counselling-pregnancy",
  },

  // =========================
  // PREGNANCY & POSTPARTUM EXERCISE
  // =========================

  {
    id: 11,
    title: "Physical Activity During Pregnancy and After Childbirth",
    category: "Wellness & Exercise",
    type: "Medical Article",
    author: "World Health Organization",
    source: "World Health Organization (WHO)",
    publishedDate: "2020",
    summary:
      "Learn about physical activity recommendations for pregnant and postpartum women.",
    content:
      "Physical activity can provide health benefits during pregnancy and after childbirth when appropriate. Women with pregnancy or delivery complications should seek guidance from a qualified healthcare professional about suitable activity.",
    sourceUrl:
      "https://www.who.int/publications/i/item/9789240015128",
  },
];