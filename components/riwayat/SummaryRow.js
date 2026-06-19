"use client";

import { useMemo } from "react";
import { useApp } from "@/lib/store";
import { formatRupiah } from "@/lib/utils";

export default function SummaryRow({ mode }) {
  const { state } = useApp();

  const stats = useMemo(() => {
    if (mode === "calories") {
      const avg = Math.round(state.weeklyCalories.reduce((sum, item) => sum + item.amount, 0) / 7);
      const max = Math.max(...state.weeklyCalories.map(i => i.amount));
      const enoughDays = state.weeklyCalories.filter(i => i.amount >= state.targetCalories).length;
      
      return [
        { label: "Rata-rata/Hari", value: `${formatRupiah(avg).replace("Rp", "").trim()} kkal` },
        { label: "Hari Tercukupi", value: `${enoughDays} dari 7` },
        { label: "Tertinggi", value: `${formatRupiah(max).replace("Rp", "").trim()} kkal` }
      ];
    } else {
      const total = state.weeklySpending.reduce((sum, item) => sum + item.amount, 0);
      const avg = Math.round(total / 7);
      const max = Math.max(...state.weeklySpending.map(i => i.amount));
      
      return [
        { label: "Total Minggu Ini", value: formatRupiah(total) },
        { label: "Rata-rata/Hari", value: formatRupiah(avg) },
        { label: "Terboros", value: formatRupiah(max) }
      ];
    }
  }, [mode, state]);

  return (
    <div className="summary-row">
      {stats.map((stat, idx) => (
        <article key={idx} className="summary-card">
          <span>{stat.label}</span>
          <strong>{stat.value}</strong>
        </article>
      ))}
    </div>
  );
}
