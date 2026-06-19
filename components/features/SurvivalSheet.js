"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { formatRupiah, getDailyBudget } from "@/lib/utils";
import FeatureSheet from "../ui/FeatureSheet";

export default function SurvivalSheet({ isOpen, onClose }) {
  const router = useRouter();
  const { state } = useApp();
  const [selectedStrategy, setSelectedStrategy] = useState(null);

  const budgetHarian = getDailyBudget(state.saldoMakan, state.hariKeKiriman);
  
  // Hardcoded for demo, normally calculated based on average spend vs remaining
  const remainingDays = state.hariKeKiriman;
  const estimatedDaysCanSurvive = Math.floor(state.saldoMakan / (state.todaySpent || 20000));
  const survivalRatio = Math.min((estimatedDaysCanSurvive / remainingDays) * 100, 100);

  const handleRecipeRedirect = () => {
    onClose();
    router.push("/resep");
  };

  return (
    <FeatureSheet isOpen={isOpen} onClose={onClose} title="🔴 Survival Planner">
      <div className="survival-summary">
        <div className="survival-row"><span>Sisa uang</span><strong>{formatRupiah(state.saldoMakan)}</strong></div>
        <div className="survival-row"><span>Sisa hari</span><strong>{remainingDays} hari</strong></div>
        <div className="survival-row"><span>Budget/hari</span><strong>{formatRupiah(budgetHarian)}</strong></div>
      </div>
      
      <div className="result-hero">
        <h3>Dengan pola makan sekarang...</h3>
        <div className="budget-bar-wrap">
          <div className="budget-bar-label">
            <span>Hari tercakup</span>
            <span>{estimatedDaysCanSurvive} dari {remainingDays} hari</span>
          </div>
          <div className="budget-bar">
            <div className="budget-bar-fill" style={{ width: `${survivalRatio}%` }}></div>
          </div>
        </div>
        <p>
          {estimatedDaysCanSurvive >= remainingDays 
            ? "Masih cukup sampai kiriman" 
            : `Cukup sampai ${estimatedDaysCanSurvive} hari — kurang ${remainingDays - estimatedDaysCanSurvive} hari`}
        </p>
      </div>

      <p className="sheet-section-title">Pilih strategi:</p>
      <div className="strategy-list">
        <button 
          className={`strategy-card ${selectedStrategy === "outside" ? "selected" : ""}`}
          type="button" 
          onClick={() => setSelectedStrategy("outside")}
        >
          <strong>🛒 Tetap beli di luar</strong>
          <span>Estimasi cukup {estimatedDaysCanSurvive} hari</span>
        </button>
        <button 
          className={`strategy-card ${selectedStrategy === "cook" ? "selected" : ""}`}
          type="button" 
          onClick={() => setSelectedStrategy("cook")}
        >
          <strong>🍳 Mulai masak sendiri</strong>
          <span>Estimasi hemat Rp 10.000/hari<br/>Cukup sampai kiriman ✅</span>
        </button>
      </div>

      <div className={`strategy-message ${selectedStrategy === "cook" ? "visible" : ""}`}>
        <p>Yuk ke halaman Resep buat liat pilihan masak murah!</p>
        <button className="feature-cta" type="button" onClick={handleRecipeRedirect}>
          Lihat Resep →
        </button>
      </div>
    </FeatureSheet>
  );
}
