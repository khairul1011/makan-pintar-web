import { NextResponse } from "next/server";
import { getAuthUser, unauthorized, serverError } from "@/lib/api-helpers";

// GET /api/stats/weekly — Ambil statistik 7 hari terakhir (pengeluaran & kalori)
export async function GET(request) {
  const { user, error, supabase } = await getAuthUser(request);
  if (!user) return unauthorized(error);

  // Hitung tanggal 7 hari lalu
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);
  const startDate = sevenDaysAgo.toISOString().split("T")[0];
  const endDate = today.toISOString().split("T")[0];

  // Ambil semua food entries 7 hari terakhir
  const { data: entries, error: dbError } = await supabase
    .from("food_entries")
    .select("price, calories, entry_date")
    .eq("user_id", user.id)
    .gte("entry_date", startDate)
    .lte("entry_date", endDate)
    .order("entry_date", { ascending: true });

  if (dbError) return serverError(dbError.message);

  // Hitung total per hari
  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const dailyStats = {};

  // Init 7 hari
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo);
    d.setDate(sevenDaysAgo.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    dailyStats[dateStr] = {
      day: dayNames[d.getDay()],
      date: dateStr,
      totalSpending: 0,
      totalCalories: 0,
      entries: 0,
    };
  }

  // Aggregate entries
  for (const entry of entries) {
    const key = entry.entry_date;
    if (dailyStats[key]) {
      dailyStats[key].totalSpending += entry.price || 0;
      dailyStats[key].totalCalories += entry.calories || 0;
      dailyStats[key].entries += 1;
    }
  }

  const weeklySpending = Object.values(dailyStats).map((d) => ({
    day: d.day,
    amount: d.totalSpending,
  }));

  const weeklyCalories = Object.values(dailyStats).map((d) => ({
    day: d.day,
    amount: d.totalCalories,
  }));

  // Hitung today spent
  const todayStr = endDate;
  const todaySpent = dailyStats[todayStr]?.totalSpending || 0;

  // Summary stats
  const totalWeek = weeklySpending.reduce((sum, d) => sum + d.amount, 0);
  const avgPerDay = Math.round(totalWeek / 7);
  const maxSpend = Math.max(...weeklySpending.map((d) => d.amount), 1);

  return NextResponse.json({
    weeklySpending,
    weeklyCalories,
    todaySpent,
    summary: {
      totalWeek,
      avgPerDay,
      maxSpend,
    },
  });
}
