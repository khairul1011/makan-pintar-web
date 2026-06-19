"use client";

import { useApp } from "@/lib/store";
import { getDailyBudget, getMode, formatRupiah } from "@/lib/utils";
import { MODE_CONFIG } from "@/lib/constants";
import GlassCard from "../ui/GlassCard";

export default function BudgetRing() {
  const { state } = useApp();
  const budgetHarian = getDailyBudget(state.saldoMakan, state.hariKeKiriman);
  const mode = getMode(budgetHarian, MODE_CONFIG);
  
  const percentUsed = Math.min(Math.round((state.todaySpent / budgetHarian) * 100), 100) || 0;
  const ringOffset = 628 - (628 * percentUsed) / 100;

  // Calculate meal stats based on today's entries
  const stats = state.todayEntries.reduce((acc, entry) => {
    const meal = entry.meal.toLowerCase();
    if (meal.includes('pagi')) acc.pagi += entry.price;
    else if (meal.includes('siang')) acc.siang += entry.price;
    else if (meal.includes('malam')) acc.malam += entry.price;
    return acc;
  }, { pagi: 0, siang: 0, malam: 0 });

  return (
    <GlassCard className="card-pad ring-card">
      <div className="section-header" style={{ width: "100%" }}>
        <h2 className="section-title">Budget Ring</h2>
        <span className="section-note">{formatRupiah(state.todaySpent)} terpakai</span>
      </div>
      <div className="ring-wrap">
        <svg className="progress-ring" viewBox="0 0 240 240" role="img" aria-labelledby="ringTitle">
          <title id="ringTitle">Persentase budget hari ini yang sudah terpakai</title>
          <defs>
            <linearGradient id="ringGradient" x1="40" y1="40" x2="200" y2="200" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={mode.color}></stop>
              <stop offset="100%" stopColor={mode.deep}></stop>
            </linearGradient>
          </defs>
          <circle className="ring-track" cx="120" cy="120" r="100"></circle>
          <circle 
            className="ring-progress" 
            cx="120" cy="120" r="100"
            style={{ strokeDashoffset: ringOffset, stroke: "url(#ringGradient)" }}
          ></circle>
        </svg>
        <div className="ring-center">
          <div className="ring-percent">{percentUsed}%</div>
          <div className="ring-copy">terpakai</div>
        </div>
      </div>
      <div className="meal-stats">
        <div className="mini-stat">
          <span>Makan Pagi</span>
          <strong>{formatRupiah(stats.pagi)}</strong>
        </div>
        <div className="mini-stat">
          <span>Makan Siang</span>
          <strong>{formatRupiah(stats.siang)}</strong>
        </div>
        <div className="mini-stat">
          <span>Makan Malam</span>
          <strong>{formatRupiah(stats.malam)}</strong>
        </div>
      </div>
    </GlassCard>
  );
}
