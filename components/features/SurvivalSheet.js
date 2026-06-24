"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { formatRupiah, getDailyBudget } from "@/lib/utils";
import FeatureSheet from "../ui/FeatureSheet";
import { ChefHat, ShoppingBag, ArrowRight } from "lucide-react";

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
      <div className="flex flex-col gap-6">
        <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex justify-between items-center py-1 border-b border-zinc-800/50">
            <span className="text-sm font-semibold text-zinc-400">Sisa uang</span>
            <strong className="text-sm font-bold text-zinc-100">{formatRupiah(state.saldoMakan)}</strong>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-zinc-800/50">
            <span className="text-sm font-semibold text-zinc-400">Sisa hari</span>
            <strong className="text-sm font-bold text-zinc-100">{remainingDays} hari</strong>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-sm font-semibold text-zinc-400">Budget/hari</span>
            <strong className="text-sm font-bold text-zinc-100">{formatRupiah(budgetHarian)}</strong>
          </div>
        </div>
        
        <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-5 flex flex-col items-center text-center">
          <h3 className="text-sm font-bold text-zinc-300 mb-4">Dengan pola makan sekarang...</h3>
          
          <div className="w-full mb-4">
            <div className="flex justify-between text-xs font-semibold text-zinc-400 mb-2">
              <span>Hari tercakup</span>
              <span className={survivalRatio < 100 ? "text-red-400" : "text-emerald-400"}>
                {estimatedDaysCanSurvive} dari {remainingDays} hari
              </span>
            </div>
            <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${survivalRatio < 50 ? "bg-red-500" : survivalRatio < 100 ? "bg-yellow-500" : "bg-emerald-500"}`} 
                style={{ width: `${survivalRatio}%` }}
              ></div>
            </div>
          </div>
          
          <p className="text-sm font-medium text-zinc-300 mt-2">
            {estimatedDaysCanSurvive >= remainingDays 
              ? "Masih cukup sampai kiriman 🎉" 
              : `Cukup sampai ${estimatedDaysCanSurvive} hari — kurang ${remainingDays - estimatedDaysCanSurvive} hari 😢`}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Pilih strategi:</p>
          <div className="grid grid-cols-1 gap-3">
            <button 
              className={`p-4 rounded-xl flex items-start gap-4 text-left transition-all duration-200 border ${
                selectedStrategy === "outside" 
                  ? "bg-zinc-900 border-zinc-500 shadow-md transform scale-[1.01]" 
                  : "bg-zinc-950/50 border-zinc-800/50 hover:bg-zinc-900/50"
              }`}
              type="button" 
              onClick={() => setSelectedStrategy("outside")}
            >
              <div className={`p-2 rounded-full shrink-0 ${selectedStrategy === "outside" ? "bg-zinc-800 text-zinc-100" : "bg-zinc-900 text-zinc-400"}`}>
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1">
                <strong className={`text-sm ${selectedStrategy === "outside" ? "text-zinc-100" : "text-zinc-300"}`}>Tetap beli di luar</strong>
                <span className="text-xs text-zinc-500">Estimasi cukup {estimatedDaysCanSurvive} hari</span>
              </div>
            </button>
            
            <button 
              className={`p-4 rounded-xl flex items-start gap-4 text-left transition-all duration-200 border ${
                selectedStrategy === "cook" 
                  ? "bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)] transform scale-[1.01]" 
                  : "bg-zinc-950/50 border-zinc-800/50 hover:bg-zinc-900/50"
              }`}
              type="button" 
              onClick={() => setSelectedStrategy("cook")}
            >
              <div className={`p-2 rounded-full shrink-0 ${selectedStrategy === "cook" ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-900 text-zinc-400"}`}>
                <ChefHat className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1">
                <strong className={`text-sm ${selectedStrategy === "cook" ? "text-emerald-400" : "text-zinc-300"}`}>Mulai masak sendiri</strong>
                <span className="text-xs text-zinc-500 leading-snug">Estimasi hemat Rp 10.000/hari<br/>Cukup sampai kiriman ✅</span>
              </div>
            </button>
          </div>
        </div>

        {selectedStrategy === "cook" && (
          <div className="bg-indigo-500/10 border border-indigo-500/30 p-4 rounded-xl flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="text-sm font-medium text-indigo-200 text-center">Yuk ke halaman Resep buat liat pilihan masak murah!</p>
            <button 
              className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl py-3 px-4 shadow-xl transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]" 
              type="button" 
              onClick={handleRecipeRedirect}
            >
              Lihat Resep
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </FeatureSheet>
  );
}
