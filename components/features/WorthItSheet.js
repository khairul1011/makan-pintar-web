"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/lib/store";
import { formatRupiah, getDailyBudget, parsePriceInput, formatRupiahInput } from "@/lib/utils";
import FeatureSheet from "../ui/FeatureSheet";
import { ArrowRight, CheckCircle2, AlertTriangle, AlertCircle, TrendingDown, Scale } from "lucide-react";

export default function WorthItSheet({ isOpen, onClose }) {
  const { state } = useApp();
  const [foodName, setFoodName] = useState("");
  const [foodPrice, setFoodPrice] = useState("");
  const [showResult, setShowResult] = useState(false);

  const budgetHarian = getDailyBudget(state.saldoMakan, state.hariKeKiriman) || 100000;
  const foodPriceNum = parsePriceInput(foodPrice);
  const afterSpent = state.todaySpent + foodPriceNum;
  const remaining = budgetHarian - afterSpent;
  const percent = Math.min(Math.max((afterSpent / budgetHarian) * 100, 0), 100);

  let status = { 
    bg: "bg-red-500/10", 
    border: "border-red-500/30", 
    text: "text-red-400", 
    icon: <AlertCircle className="w-5 h-5" />, 
    msg: "Mepet Banget!" 
  };
  
  if (remaining > 15000) {
    status = { 
      bg: "bg-emerald-500/10", 
      border: "border-emerald-500/30", 
      text: "text-emerald-400", 
      icon: <CheckCircle2 className="w-5 h-5" />, 
      msg: "Masih Aman" 
    };
  } else if (remaining >= 5000) {
    status = { 
      bg: "bg-yellow-500/10", 
      border: "border-yellow-500/30", 
      text: "text-yellow-400", 
      icon: <AlertTriangle className="w-5 h-5" />, 
      msg: "Agak Mepet" 
    };
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!foodPrice || foodPriceNum <= 0) return;
    setShowResult(true);
  };

  const handleClose = () => {
    setShowResult(false);
    setFoodName("");
    setFoodPrice("");
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      setFoodName("");
      setFoodPrice("");
      setShowResult(false);
    }
  }, [isOpen]);

  const jumlahGorengan = Math.floor(foodPriceNum / 1500);
  
  // Dynamic alternatives based on price
  const getAlternatives = (price) => {
    if (price <= 10000) return [
      { name: "Masak mie instan + telur", price: 5000 },
      { name: "Nasi warteg porsi kuli", price: 10000 }
    ];
    if (price <= 25000) return [
      { name: "Warteg lauk ayam", price: 15000 },
      { name: "Ayam geprek pinggir jalan", price: 18000 }
    ];
    if (price <= 50000) return [
      { name: "Nasi padang komplit", price: 25000 },
      { name: "Masak lauk ayam untuk 2 hari", price: 40000 }
    ];
    return [
      { name: "Belanja sayur 1 minggu", price: 70000 },
      { name: "All you can eat murah", price: 99000 }
    ];
  };

  const alternatives = getAlternatives(foodPriceNum);

  return (
    <FeatureSheet
      isOpen={isOpen}
      onClose={handleClose}
      title="🤔 Worth It Checker"
      showBack={showResult}
      onBack={() => setShowResult(false)}
    >
      {!showResult ? (
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-zinc-300" htmlFor="worthFood">Mau beli apa?</label>
            <input
              className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:bg-zinc-900 transition-colors"
              id="worthFood"
              type="text"
              placeholder="Contoh: Ayam Geprek"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              autoComplete="off"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-zinc-300" htmlFor="worthPrice">Harganya berapa?</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-zinc-500 font-medium">Rp</span>
              <input
                id="worthPrice"
                type="text"
                className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:bg-zinc-900 transition-colors font-mono"
                placeholder="25.000"
                inputMode="numeric"
                value={foodPrice}
                onChange={(e) => setFoodPrice(formatRupiahInput(e.target.value))}
              />
            </div>
          </div>
          
          <button 
            className="mt-2 w-full bg-zinc-100 hover:bg-white text-zinc-950 font-bold rounded-xl py-3.5 px-4 shadow-xl transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]" 
            type="submit"
          >
            Cek Sekarang
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-5 flex flex-col items-center text-center">
            <h3 className="text-lg font-bold text-zinc-100 mb-1">{foodName || "Makanan ini"}</h3>
            <p className="text-3xl font-black text-zinc-100 tracking-tight font-headline mb-6">{formatRupiah(foodPriceNum)}</p>
            
            <div className="w-full mb-4">
              <div className="flex justify-between text-xs font-semibold text-zinc-400 mb-2">
                <span>Budget hari ini: {formatRupiah(budgetHarian)}</span>
                <span className={percent >= 100 ? "text-red-400" : ""}>{Math.round(percent)}%</span>
              </div>
              <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${percent >= 100 ? "bg-red-500" : percent >= 75 ? "bg-yellow-500" : "bg-emerald-500"}`} 
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
            </div>
            
            <p className="text-sm font-medium text-zinc-300">
              Kalau beli ini, sisa <span className={`font-bold ${remaining <= 0 ? "text-red-400" : ""}`}>{formatRupiah(remaining)}</span>
            </p>
          </div>
          
          <div className={`flex items-center justify-center gap-2.5 p-4 rounded-xl border ${status.bg} ${status.border} ${status.text}`}>
            {status.icon}
            <strong className="font-bold text-base tracking-wide">{status.msg}</strong>
          </div>
          
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Konteks untuk anak kos:</p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 bg-zinc-900/30 border border-zinc-800/40 px-4 py-3 rounded-xl">
                <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400">
                  <Flame className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-zinc-200">Bisa dapet {jumlahGorengan} gorengan</span>
                  <span className="text-xs text-zinc-500">Asumsi harga Rp 1.500/biji</span>
                </div>
              </div>
            </div>
            
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mt-2">Alternatif lebih hemat:</p>
            <div className="flex flex-col gap-2">
              {alternatives.map((alt, i) => (
                <div key={i} className="flex justify-between items-center bg-zinc-900/30 border border-zinc-800/40 px-4 py-3 rounded-xl">
                  <span className="text-sm text-zinc-300">{alt.name}</span>
                  <strong className="text-sm font-mono text-zinc-400">{formatRupiah(alt.price)}</strong>
                </div>
              ))}
            </div>
          </div>
          
          <p className="text-center text-xs text-zinc-500 font-medium">Keputusan tetap di tangan kamu 👍</p>
        </div>
      )}
    </FeatureSheet>
  );
}
