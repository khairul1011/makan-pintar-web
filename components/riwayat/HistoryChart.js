"use client";

import { useApp } from "@/lib/store";
import { formatRupiah, getDailyBudget } from "@/lib/utils";
import GlassCard from "../ui/GlassCard";
import BarChart from "../ui/BarChart";

export default function HistoryChart({ mode }) {
  const { state } = useApp();
  const isCalories = mode === "calories";
  
  const budgetHarian = getDailyBudget(state.saldoMakan, state.hariKeKiriman);
  const data = isCalories ? state.weeklyCalories : state.weeklySpending;
  const maxValue = isCalories ? 2400 : state.maxChartSpend;
  const target = isCalories ? state.targetCalories : budgetHarian;
  const targetRatio = Math.min((target / maxValue) * 100, 100);

  const title = isCalories ? "Kalori 7 Hari" : "Pengeluaran 7 Hari";
  const targetLabel = isCalories ? `Target ${formatRupiah(state.targetCalories).replace("Rp", "").trim()} kkal` : `Limit ${formatRupiah(budgetHarian)}`;

  return (
    <GlassCard className="card-pad chart-card">
      <div className="section-header">
        <h3 className="section-title">{title}</h3>
        <span className="section-note">Target harian</span>
      </div>
      <div className="chart-shell history-chart-shell" aria-label="Grafik riwayat tujuh hari">
        <div className="chart-axis" aria-hidden="true">
          {isCalories ? (
            <><span>2.400</span><span>1.200</span><span>0</span></>
          ) : (
            <><span>80rb</span><span>40rb</span><span>0</span></>
          )}
        </div>
        <div 
          className="budget-line" 
          style={{ 
            bottom: `calc(30px + ${targetRatio}%)`,
            borderTopColor: isCalories ? "rgba(74, 222, 128, 0.9)" : "rgba(255, 255, 255, 0.85)"
          }}
        >
          <span>{targetLabel}</span>
        </div>
        <BarChart 
          data={data} 
          maxValue={maxValue} 
          budgetHarian={budgetHarian} 
          isCalories={isCalories} 
        />
      </div>
    </GlassCard>
  );
}
