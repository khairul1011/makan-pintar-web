"use client";

import { useApp } from "@/lib/store";
import { formatRupiah, getDailyBudget } from "@/lib/utils";
import GlassCard from "../ui/GlassCard";
import BarChart from "../ui/BarChart";

export default function ChartCard() {
  const { state } = useApp();
  const budgetHarian = getDailyBudget(state.saldoMakan, state.hariKeKiriman);
  
  const budgetRatio = Math.min((budgetHarian / state.maxChartSpend) * 100, 100);

  return (
    <GlassCard className="card-pad chart-card">
      <div className="section-header">
        <h2 className="section-title">History & Chart</h2>
        <span className="section-note">7 hari terakhir</span>
      </div>
      <div className="chart-shell" aria-label="Grafik pengeluaran tujuh hari">
        <div 
          className="budget-line" 
          style={{ bottom: `calc(30px + ${budgetRatio}%)` }}
        >
          <span>Limit {formatRupiah(budgetHarian)}</span>
        </div>
        <BarChart 
          data={state.weeklySpending} 
          maxValue={state.maxChartSpend}
          budgetHarian={budgetHarian}
        />
      </div>
      <div className="history-list">
        {[...state.history].reverse().map((item, idx) => (
          <div key={idx}>
            <div className="history-date">{item.date}</div>
            <div className="history-row">
              <span>{item.food}</span>
              <strong>{formatRupiah(item.amount)}</strong>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
