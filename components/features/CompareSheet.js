"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { formatRupiah, getDailyBudget, parsePriceInput } from "@/lib/utils";
import FeatureSheet from "../ui/FeatureSheet";
import { ArrowRight, Lightbulb } from "lucide-react";

export default function CompareSheet({ isOpen, onClose }) {
  const { state } = useApp();
  const [form, setForm] = useState({ nameA: "", priceA: "", nameB: "", priceB: "" });
  const [showResult, setShowResult] = useState(false);

  const budgetHarian = getDailyBudget(state.saldoMakan, state.hariKeKiriman);
  
  const priceA = parsePriceInput(form.priceA) || 0;
  const priceB = parsePriceInput(form.priceB) || 0;
  const nameA = form.nameA || "Pilihan A";
  const nameB = form.nameB || "Pilihan B";

  const diff = Math.abs(priceA - priceB);
  const winner = priceA <= priceB ? "A" : "B";
  const winnerName = winner === "A" ? nameA : nameB;
  const higherPrice = Math.max(priceA, priceB) || 1;
  const diffPercent = Math.round((diff / higherPrice) * 100);
  const gorengan = Math.max(1, Math.floor(diff / 2000));
  const daysSaved = diff / budgetHarian;

  const insight = diffPercent > 30
    ? `${winnerName} lebih hemat ${diffPercent}%`
    : diffPercent < 15
      ? "Hampir sama, pilih yang kamu suka aja"
      : `${winnerName} lumayan lebih hemat`;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.priceA || !form.priceB) return;
    setShowResult(true);
  };

  const handleClose = () => {
    setShowResult(false);
    setForm({ nameA: "", priceA: "", nameB: "", priceB: "" });
    onClose();
  };

  return (
    <FeatureSheet
      isOpen={isOpen}
      onClose={handleClose}
      title="⚖️ Bandingkan Dua Pilihan"
      showBack={showResult}
      onBack={() => setShowResult(false)}
    >
      {!showResult ? (
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {/* Pilihan A */}
          <div className="bg-zinc-900/30 border border-zinc-800/40 p-4 rounded-2xl flex flex-col gap-4">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Pilihan A</h3>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-zinc-400" htmlFor="compareAName">Nama Makanan/Tempat</label>
              <input
                className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
                id="compareAName"
                type="text"
                placeholder="Contoh: Nasi Padang Sabar Menanti"
                value={form.nameA}
                onChange={(e) => setForm({ ...form, nameA: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-zinc-400" htmlFor="compareAPrice">Harga</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-zinc-500 font-medium text-sm">Rp</span>
                <input
                  id="compareAPrice"
                  type="text"
                  className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-colors font-mono"
                  placeholder="20.000"
                  inputMode="numeric"
                  value={form.priceA}
                  onChange={(e) => {
                    import("@/lib/utils").then(({ formatRupiahInput }) => {
                      setForm({ ...form, priceA: formatRupiahInput(e.target.value) });
                    });
                  }}
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center -my-2 relative z-10">
            <span className="bg-zinc-950 border border-zinc-800 text-zinc-500 text-xs font-black italic px-3 py-1 rounded-full shadow-lg">VS</span>
          </div>
          
          {/* Pilihan B */}
          <div className="bg-zinc-900/30 border border-zinc-800/40 p-4 rounded-2xl flex flex-col gap-4">
            <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider">Pilihan B</h3>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-zinc-400" htmlFor="compareBName">Nama Makanan/Tempat</label>
              <input
                className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-purple-500/50 transition-colors"
                id="compareBName"
                type="text"
                placeholder="Contoh: Ayam Geprek Bu Rum"
                value={form.nameB}
                onChange={(e) => setForm({ ...form, nameB: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-zinc-400" htmlFor="compareBPrice">Harga</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-zinc-500 font-medium text-sm">Rp</span>
                <input
                  id="compareBPrice"
                  type="text"
                  className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-purple-500/50 transition-colors font-mono"
                  placeholder="15.000"
                  inputMode="numeric"
                  value={form.priceB}
                  onChange={(e) => {
                    import("@/lib/utils").then(({ formatRupiahInput }) => {
                      setForm({ ...form, priceB: formatRupiahInput(e.target.value) });
                    });
                  }}
                />
              </div>
            </div>
          </div>
          
          <button 
            className="mt-2 w-full bg-zinc-100 hover:bg-white text-zinc-950 font-bold rounded-xl py-3.5 px-4 shadow-xl transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]" 
            type="submit"
          >
            Bandingkan
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="grid grid-cols-2 gap-3 relative">
            <div className={`p-4 rounded-2xl flex flex-col items-center justify-center text-center border ${winner === "A" ? "bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]" : "bg-zinc-900/50 border-zinc-800"}`}>
              {winner === "A" && <span className="absolute -top-2 left-4 text-xs font-bold bg-emerald-500 text-emerald-950 px-2 py-0.5 rounded-full">Lebih Hemat</span>}
              <span className="text-sm font-medium text-zinc-300 line-clamp-1 break-all">{nameA}</span>
              <strong className={`text-xl font-black tracking-tight mt-1 ${winner === "A" ? "text-emerald-400" : "text-zinc-100"}`}>{formatRupiah(priceA)}</strong>
            </div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-950 border border-zinc-800 rounded-full w-8 h-8 flex items-center justify-center text-[10px] font-black italic text-zinc-500 shadow-xl z-10">
              VS
            </div>
            
            <div className={`p-4 rounded-2xl flex flex-col items-center justify-center text-center border ${winner === "B" ? "bg-purple-500/10 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]" : "bg-zinc-900/50 border-zinc-800"}`}>
              {winner === "B" && <span className="absolute -top-2 right-4 text-xs font-bold bg-purple-500 text-purple-950 px-2 py-0.5 rounded-full">Lebih Hemat</span>}
              <span className="text-sm font-medium text-zinc-300 line-clamp-1 break-all">{nameB}</span>
              <strong className={`text-xl font-black tracking-tight mt-1 ${winner === "B" ? "text-purple-400" : "text-zinc-100"}`}>{formatRupiah(priceB)}</strong>
            </div>
          </div>
          
          <div className="bg-zinc-900/40 border border-zinc-800/60 p-5 rounded-2xl flex flex-col items-center text-center mt-2">
            <span className="text-sm text-zinc-400 font-medium">Selisih Harga</span>
            <strong className="text-3xl font-black text-zinc-100 font-headline tracking-tight my-1">{formatRupiah(diff)}</strong>
            
            <div className="w-full h-px bg-zinc-800/60 my-4" />
            
            <p className="text-xs text-zinc-400 uppercase tracking-wider font-bold mb-3">Dengan selisih itu kamu bisa:</p>
            <ul className="flex flex-col gap-2 w-full">
              <li className="bg-zinc-950/50 border border-zinc-800/50 rounded-xl py-2 px-3 text-sm text-zinc-300 flex justify-between">
                <span>Beli Gorengan</span>
                <strong className="text-zinc-100">{gorengan} biji</strong>
              </li>
              <li className="bg-zinc-950/50 border border-zinc-800/50 rounded-xl py-2 px-3 text-sm text-zinc-300 flex justify-between">
                <span>Ekstra Hari (Sesuai Budget)</span>
                <strong className="text-zinc-100">{daysSaved.toFixed(1)} hari</strong>
              </li>
            </ul>
          </div>
          
          <div className="flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/30 p-3.5 rounded-xl">
            <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-400 shrink-0">
              <Lightbulb className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-indigo-200 leading-snug">{insight}</span>
          </div>
          
          <p className="text-center text-xs text-zinc-500 font-medium">Keputusan tetap di tangan kamu 👍</p>
        </div>
      )}
    </FeatureSheet>
  );
}
