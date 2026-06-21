export const MODE_CONFIG = {
  santai: {
    label: "Santai",
    emoji: "🟢",
    color: "#4ade80",
    deep: "#22c55e",
    glow: "rgba(74, 222, 128, 0.1)",
    actions: ["worth"],
  },
  hitung: {
    label: "Hitung-hitung",
    emoji: "🟡",
    color: "#fbbf24",
    deep: "#f59e0b",
    glow: "rgba(251, 191, 36, 0.1)",
    actions: ["worth", "compare"],
  },
  survival: {
    label: "Survival",
    emoji: "🔴",
    color: "#f87171",
    deep: "#ef4444",
    glow: "rgba(248, 113, 113, 0.1)",
    actions: ["survival", "cheapRecipes"],
  },
};

export const QUICK_ACTION_CARDS = {
  worth: {
    id: "worth",
    icon: "🤔",
    title: "Worth It?",
    description: "Cek apakah worth dibeli",
  },
  compare: {
    id: "compare",
    icon: "⚖️",
    title: "Compare",
    description: "Bandingin dua pilihan",
  },
  survival: {
    id: "survival",
    icon: "🍳",
    title: "Survival Planner",
    description: "Atur makan sampai kiriman",
  },
  cheapRecipes: {
    id: "cheapRecipes",
    icon: "📖",
    title: "Resep Murah",
    description: "Masak sendiri, hemat lebih",
  },
};

export function getQuickActionCards(mode) {
  if (mode.label === "Santai") return [QUICK_ACTION_CARDS.worth];
  if (mode.label === "Survival")
    return [QUICK_ACTION_CARDS.survival, QUICK_ACTION_CARDS.cheapRecipes];
  return [QUICK_ACTION_CARDS.worth, QUICK_ACTION_CARDS.compare];
}

// RECIPES removed in favor of dynamic AI generation

export const INITIAL_STATE = {
  avatarUrl: null,
  saldoMakan: 420000,
  hariKeKiriman: 12,
  todaySpent: 15000,
  maxChartSpend: 80000,
  targetCalories: 2000,
  targetProtein: 60,
  totalKiriman: 1500000,
  tanggalKiriman: "2025-06-30",
  history: [
    { day: "Sel", date: "17 Juni", food: "Bubur Ayam", amount: 25000 },
    { day: "Rab", date: "18 Juni", food: "Soto Ayam", amount: 38000 },
    { day: "Kam", date: "19 Juni", food: "Ayam Geprek", amount: 52000 },
    { day: "Jum", date: "20 Juni", food: "Mie Ayam", amount: 30000 },
    { day: "Sab", date: "21 Juni", food: "Padang Hemat", amount: 75000 },
    { day: "Min", date: "22 Juni", food: "Ketoprak", amount: 28000 },
    { day: "Sen", date: "23 Juni", food: "Nasi Goreng", amount: 15000 },
  ],
  todayEntries: [
    {
      emoji: "🍛",
      name: "Nasi Goreng",
      meal: "Siang",
      calories: 450,
      price: 15000,
    },
  ],
  historyEntries: [
    { date: "Senin 23 Jun", emoji: "🍛", name: "Nasi Goreng", meal: "Siang", price: 15000, calories: 450 },
    { date: "Minggu 22 Jun", emoji: "🍜", name: "Indomie", meal: "Malam", price: 4000, calories: 380 },
    { date: "Minggu 22 Jun", emoji: "🍱", name: "Warteg", meal: "Siang", price: 20000, calories: 550 },
    { date: "Sabtu 21 Jun", emoji: "🍗", name: "Ayam Geprek", meal: "Siang", price: 25000, calories: 620 },
    { date: "Jumat 20 Jun", emoji: "🍛", name: "Nasi Padang", meal: "Siang", price: 22000, calories: 680 },
    { date: "Jumat 20 Jun", emoji: "🥟", name: "Gorengan", meal: "Sore", price: 5000, calories: 210 },
    { date: "Kamis 19 Jun", emoji: "🍜", name: "Mie Ayam", meal: "Siang", price: 15000, calories: 480 },
    { date: "Kamis 19 Jun", emoji: "🍛", name: "Nasi Goreng", meal: "Malam", price: 15000, calories: 450 },
  ],
  weeklySpending: [
    { day: "Sen", amount: 15000 },
    { day: "Sel", amount: 35000 },
    { day: "Rab", amount: 38000 },
    { day: "Kam", amount: 30000 },
    { day: "Jum", amount: 27000 },
    { day: "Sab", amount: 75000 },
    { day: "Min", amount: 24000 },
  ],
  weeklyCalories: [
    { day: "Sen", amount: 1650 },
    { day: "Sel", amount: 1780 },
    { day: "Rab", amount: 2000 },
    { day: "Kam", amount: 930 },
    { day: "Jum", amount: 2100 },
    { day: "Sab", amount: 2020 },
    { day: "Min", amount: 1280 },
  ],
  notifications: {
    budgetWarning: true,
    logReminder: true,
    kirimanReminder: false,
  },
};
