"use client";

import { useApp } from "@/lib/store";
import { formatRupiah } from "@/lib/utils";
import GlassCard from "../ui/GlassCard";

export default function HistoryList({ mode }) {
  const { state } = useApp();
  const isCalories = mode === "calories";

  // Group by date
  const groupedEntries = state.historyEntries.reduce((acc, entry) => {
    if (!acc[entry.date]) acc[entry.date] = [];
    acc[entry.date].push(entry);
    return acc;
  }, {});

  return (
    <GlassCard className="card-pad">
      <div className="section-header">
        <h3 className="section-title">Daftar Log</h3>
        <span className="section-note">{isCalories ? "Kalori" : "Pengeluaran"}</span>
      </div>
      <div className="history-page-list">
        {Object.entries(groupedEntries).map(([date, entries]) => (
          <div key={date}>
            <div className="history-date" style={{ marginTop: "12px", marginBottom: "8px" }}>{date}</div>
            {entries.map((entry, idx) => (
              <div key={idx} className="history-entry">
                <div className="food-emoji" aria-hidden="true">{entry.emoji}</div>
                <div>
                  <p className="food-name">{entry.name}</p>
                  <div className="food-meta">
                    <span className="meal-badge">{entry.meal}</span>
                  </div>
                </div>
                <strong className="history-value">
                  {isCalories ? `${entry.calories} kkal` : formatRupiah(entry.price)}
                </strong>
              </div>
            ))}
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
