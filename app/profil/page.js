"use client";

import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Wallet, Flame, ShieldAlert, Check, Calendar, LogOut } from "lucide-react";
import { useApp } from "@/lib/store";

export default function ProfilPage() {
  const { state, updateSetting, updateSaldo, signOut } = useApp();
  
  // Local state for the form inputs
  const [saldo, setSaldo] = useState("");
  const [totalKiriman, setTotalKiriman] = useState("");
  const [tanggalKiriman, setTanggalKiriman] = useState("");
  const [targetCalories, setTargetCalories] = useState("");
  
  const [tier, setTier] = useState("custom");
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Sync state when component mounts or state changes
  useEffect(() => {
    if (state) {
      setSaldo(state.saldoMakan?.toString() || "");
      setTotalKiriman(state.totalKiriman?.toString() || "");
      setTanggalKiriman(state.tanggalKiriman || "");
      setTargetCalories(state.targetCalories?.toString() || "");
    }
  }, [state]);

  const handleSave = async (e) => {
    e.preventDefault();
    
    // Update settings via store actions
    await updateSaldo(Number(saldo) || 0);
    await updateSetting("totalKiriman", Number(totalKiriman) || 0);
    await updateSetting("tanggalKiriman", tanggalKiriman);
    await updateSetting("targetCalories", Number(targetCalories) || 0);

    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
    }, 3000);
  };

  const applyTierPreset = (selectedTier) => {
    setTier(selectedTier);
    if (selectedTier === "survival") {
      setTargetCalories("1700");
    } else if (selectedTier === "steady") {
      setTargetCalories("2100");
    } else {
      setTargetCalories("2500");
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 relative font-sans">
        {/* Save Success Notification Toast */}
        {showSavedToast && (
          <div id="profile-saved-toast" className="fixed top-5 right-5 max-w-sm bg-zinc-950 border border-zinc-800 text-zinc-100 p-4 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-fade-in">
            <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider font-sans">Target Disimpan</h5>
              <p className="text-xs text-zinc-400 mt-0.5">Budget & target nutrisi berhasil di-update!</p>
            </div>
          </div>
        )}

        {/* Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
              ⚙️ Atur Profil & Jatah Bulanan
            </h2>
            <p className="text-xs text-zinc-400 mt-1 leading-normal">
              Sesuaikan kondisi dompet mutakhirmu dan dapatkan perhitungan budget harian yang pas.
            </p>
          </div>
          <button 
            onClick={signOut}
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start font-sans">
          {/* PRESET CHIPS SELECTOR (4-columns) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Preset Kalori</h3>
            
            <div className="space-y-3 font-sans">
              {/* Survival */}
              <button
                type="button"
                onClick={() => applyTierPreset("survival")}
                className={`w-full p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                  tier === "survival" 
                    ? "bg-red-500/5 border-red-500/50 shadow-md" 
                    : "bg-[#0C0C0E] border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60"
                }`}
              >
                <span className="inline-block text-[9px] bg-red-500/10 text-red-400 border border-red-500/25 px-2 py-0.5 rounded uppercase font-bold tracking-wider mb-2">
                  Survival Parah
                </span>
                <h4 className="text-sm font-bold text-zinc-200">Mode Defisit</h4>
                <p className="text-xs text-zinc-500 mt-1">Target gizi minimalis (1700 kkal). Cocok buat akhir bulan uang nipis.</p>
              </button>

              {/* Steady standard */}
              <button
                type="button"
                onClick={() => applyTierPreset("steady")}
                className={`w-full p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                  tier === "steady" 
                    ? "bg-zinc-800/80 border-zinc-600 shadow-md" 
                    : "bg-[#0C0C0E] border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60"
                }`}
              >
                <span className="inline-block text-[9px] bg-zinc-800 text-zinc-300 border border-zinc-700 px-2 py-0.5 rounded uppercase font-bold tracking-wider mb-2">
                  Aman / Seimbang
                </span>
                <h4 className="text-sm font-bold text-zinc-200">Warteg Estetik</h4>
                <p className="text-xs text-zinc-500 mt-1">Cukup gizi seimbang (2100 kkal). Standar kebutuhan harian normal.</p>
              </button>

              {/* Sultan luxury */}
              <button
                type="button"
                onClick={() => applyTierPreset("sultan")}
                className={`w-full p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                  tier === "sultan" 
                    ? "bg-emerald-500/5 border-emerald-500/50 shadow-md" 
                    : "bg-[#0C0C0E] border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60"
                }`}
              >
                <span className="inline-block text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded uppercase font-bold tracking-wider mb-2">
                  Gaya Sultan
                </span>
                <h4 className="text-sm font-bold text-zinc-200">Bulking Anak Kos</h4>
                <p className="text-xs text-zinc-500 mt-1">Target gizi tinggi (2500 kkal). Saat kiriman baru turun dan bisa pesan apa aja.</p>
              </button>
            </div>
          </div>

          {/* PROFILE INPUTS FORM (8-columns) */}
          <div className="lg:col-span-8 bg-[#0C0C0E] border border-zinc-800/80 rounded-3xl p-6 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">Edit Form Target</h3>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-500 font-bold mb-1.5 flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5 text-zinc-400" /> 
                    Saldo Makan Saat Ini (Rp)
                  </label>
                  <input
                    type="number"
                    value={saldo}
                    onChange={(e) => setSaldo(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-zinc-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-500 font-bold mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" /> 
                    Tanggal Kiriman Berikutnya
                  </label>
                  <input
                    type="date"
                    value={tanggalKiriman}
                    onChange={(e) => setTanggalKiriman(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-zinc-500 [color-scheme:dark]"
                    required
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-500 font-bold mb-1.5 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-zinc-400" /> 
                    Total Kiriman Per Bulan (Rp)
                  </label>
                  <input
                    type="number"
                    value={totalKiriman}
                    onChange={(e) => setTotalKiriman(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-500 font-bold mb-1.5 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-emerald-400" /> 
                    Target Kalori Harian (kkal)
                  </label>
                  <input
                    type="number"
                    value={targetCalories}
                    onChange={(e) => {
                      setTargetCalories(e.target.value);
                      setTier("custom");
                    }}
                    className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-zinc-500"
                    required
                  />
                </div>
              </div>

              {/* Note alert */}
              <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800/80 text-xs text-zinc-400 flex items-start gap-2.5 mt-2">
                <span className="p-1 rounded bg-zinc-800 border border-zinc-700 font-bold text-[9px] uppercase shrink-0">INFO</span>
                <p className="mt-0.5 leading-normal">
                  Sisa uang harian kamu (Daily Limit) akan <span className="text-zinc-300 font-bold">otomatis dihitung</span> berdasarkan Saldo Makan dibagi sisa hari sampai Tanggal Kiriman Berikutnya. Update saldomu secara berkala!
                </p>
              </div>

              {/* Submit */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="bg-zinc-100 hover:bg-white text-zinc-950 font-bold rounded-xl py-3 px-8 text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer transform active:scale-[0.98]"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
