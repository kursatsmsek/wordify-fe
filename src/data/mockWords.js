export const MOCK_WORDS = [
  {
    id: 1,
    english: "Abundant",
    turkish: "Bereketli, Bol",
    level: "B1",
    examples: [
      "The region has abundant natural resources.",
      "Food was abundant at the festival.",
    ],
    successRate: 85,
    quizCount: 12,
  },
  {
    id: 2,
    english: "Consistent",
    turkish: "Tutarlı",
    level: "B2",
    examples: [
      "She has been consistent in her efforts.",
      "His performance is consistent throughout the year.",
    ],
    successRate: 72,
    quizCount: 9,
  },
  {
    id: 3,
    english: "Eloquent",
    turkish: "Etkileyici, Güzel Konuşan",
    level: "C1",
    examples: [
      "He gave an eloquent speech at the ceremony.",
      "She is an eloquent writer.",
    ],
    successRate: 90,
    quizCount: 15,
  },
  {
    id: 4,
    english: "Frugal",
    turkish: "Tutumlu, İdareli",
    level: "B2",
    examples: [
      "Living a frugal life helped him save money.",
      "She is frugal with her spending.",
    ],
    successRate: 45,
    quizCount: 7,
  },
  {
    id: 5,
    english: "Resilient",
    turkish: "Dayanıklı, Esnek",
    level: "B2",
    examples: [
      "Children are surprisingly resilient.",
      "The resilient community rebuilt after the disaster.",
    ],
    successRate: 50,
    quizCount: 8,
  },
  {
    id: 6,
    english: "Ephemeral",
    turkish: "Geçici, Kısa Ömürlü",
    level: "C1",
    examples: [
      "The beauty of the sunset was ephemeral, lasting only a few minutes.",
      "Fame can be ephemeral in the modern world.",
    ],
    successRate: 38,
    quizCount: 6,
  },
  {
    id: 7,
    english: "Languid",
    turkish: "Yorgun, Halsiz",
    level: "C1",
    examples: [
      "She felt languid in the summer heat.",
      "He gave a languid wave of his hand.",
    ],
    successRate: 30,
    quizCount: 5,
  },
  {
    id: 8,
    english: "Pragmatic",
    turkish: "Pratik, Gerçekçi",
    level: "B2",
    examples: [
      "A pragmatic approach is needed to solve this problem.",
      "She is known for her pragmatic thinking.",
    ],
    successRate: 78,
    quizCount: 11,
  },
  {
    id: 9,
    english: "Tenacious",
    turkish: "Azimli, Kararlı",
    level: "C1",
    examples: [
      "Despite many failures, he remained tenacious.",
      "Her tenacious spirit helped her succeed.",
    ],
    successRate: 65,
    quizCount: 10,
  },
  {
    id: 10,
    english: "Ambiguous",
    turkish: "Belirsiz, Çift Anlamlı",
    level: "B2",
    examples: [
      "The instructions were ambiguous and confusing.",
      "His smile was ambiguous — we couldn't tell if he was happy.",
    ],
    successRate: 55,
    quizCount: 8,
  },
  {
    id: 11,
    english: "Diligent",
    turkish: "Çalışkan, Özenli",
    level: "B1",
    examples: [
      "She is a diligent student who never misses class.",
      "His diligent work led to a promotion.",
    ],
    successRate: 88,
    quizCount: 14,
  },
  {
    id: 12,
    english: "Meticulous",
    turkish: "Titiz, Dikkatli",
    level: "C1",
    examples: [
      "The surgeon was meticulous in his approach.",
      "She kept meticulous records of every transaction.",
    ],
    successRate: 70,
    quizCount: 9,
  },
  {
    id: 13,
    english: "Serene",
    turkish: "Sakin, Huzurlu",
    level: "B1",
    examples: [
      "The lake was perfectly serene at dawn.",
      "She had a serene smile on her face.",
    ],
    successRate: 82,
    quizCount: 12,
  },
  {
    id: 14,
    english: "Verbose",
    turkish: "Fazla Sözcük Kullanan, Laf Kalabalığı Yapan",
    level: "C2",
    examples: [
      "His verbose explanations often confused the audience.",
      "Try not to be verbose in your essays.",
    ],
    successRate: 42,
    quizCount: 6,
  },
  {
    id: 15,
    english: "Candid",
    turkish: "Açık Yürekli, Dürüst",
    level: "B2",
    examples: [
      "She gave a candid assessment of the situation.",
      "I appreciate your candid feedback.",
    ],
    successRate: 75,
    quizCount: 10,
  },
];

export const DEFAULT_SETTINGS = {
  typingMode: true,
  quizMode: "TYPING", // "TYPING" | "MULTIPLE_CHOICE"
  quizDirection: "TR_TO_EN", // "TR_TO_EN" | "EN_TO_TR"
  darkMode: false,
  colorPalette: "#2b8cee", // blue default
  quizType: "RECENT", // "LAST_WRONG" | "RECENT" | "RANDOM"
  quizCount: 50,
  readingCount: 3,
};

export const COLOR_PALETTES = [
  { name: "Blue", value: "#2b8cee", hover: "#1a7ad4" },
  { name: "Emerald", value: "#10b981", hover: "#059669" },
  { name: "Amber", value: "#f59e0b", hover: "#d97706" },
  { name: "Rose", value: "#f43f5e", hover: "#e11d48" },
  { name: "Violet", value: "#8b5cf6", hover: "#7c3aed" },
];
