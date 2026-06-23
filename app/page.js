"use client";

import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Plus, Trash2, Flame, Coins, Scale, TrendingUp, ChefHat, Utensils, Lightbulb } from "lucide-react";
import { useApp } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { state, addFoodEntry, removeFoodEntry } = useApp();
  const router = useRouter();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newFoodName, setNewFoodName] = useState("");
  const [newFoodPrice, setNewFoodPrice] = useState("");
  const [newFoodType, setNewFoodType] = useState("siang");

  const totalSpentToday = state.todaySpent || 0;
  // Calculate total calories from todayEntries
  const totalCaloriesToday = (state.todayEntries || []).reduce((sum, log) => sum + (log.calories || 0), 0);
  
  const dailyLimit = state.hariKeKiriman > 0 ? Math.floor(state.saldoMakan / state.hariKeKiriman) : state.saldoMakan;
  const remainingBudget = Math.max(0, dailyLimit - totalSpentToday);
  const spendPercentage = dailyLimit > 0 ? Math.min(100, Math.round((totalSpentToday / dailyLimit) * 100)) : 0;

  // Mock suggestions for dinner
  const mealSuggestions = [
    { name: "Nasi Gila Warteg", price: 12000, calories: 420, mealType: "malam" },
    { name: "Bubur Kacang Ijo", price: 6000, calories: 250, mealType: "malam" },
    { name: "Telur Ceplok Cabai", price: 5000, calories: 190, mealType: "malam" }
  ];

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newFoodName.trim() || !newFoodPrice) return;

    await addFoodEntry({
      name: newFoodName,
      price: Number(newFoodPrice),
      meal: newFoodType
    });

    setNewFoodName("");
    setNewFoodPrice("");
    setShowAddModal(false);
  };

  const handleQuickAdd = async (item) => {
    await addFoodEntry({
      name: item.name,
      price: item.price,
      meal: item.mealType
    });
  };

  const survivalTips = [
    "Masak nasi sendiri malam ini bisa nambah sisa Rp 5.000 di kantong lo.",
    "Beli air galon di depo isi ulang cuma Rp 6.000 dibanding beli botolan hemat Rp 130k sebulan!",
    "Belanja sayur di pasar jam 09.00 pagi biasanya dapet harga 'habisin stok' alias diskon gede-gedean.",
    "Bikin telur dadar dicampur tahu sutra jadinya tebel bagai martabak dengan modal Rp 4.000 doang."
  ];

  const randomTip = survivalTips[(state.todayEntries?.length || 0) % survivalTips.length];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* SECTION 1: HERO CONTAINER BUDGET ROW */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* BIG BUDGET DISPLAY (6-columns) */}
          <div className="lg:col-span-6 bg-gradient-to-br from-zinc-900 to-[#121214] border border-zinc-800 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform pointer-events-none" />
            
            <div className="flex justify-between items-start mb-5 z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700/60 text-zinc-300 text-[10px] font-bold uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-pulse"></span>
                Saku Aktif
              </span>
              <span className="text-xs text-zinc-400 font-mono">Limit Harian: Rp {dailyLimit.toLocaleString("id")}</span>
            </div>

            <div className="z-10">
              <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-1">Sisa Anggaran Hari Ini</p>
              <h2 className="text-5xl md:text-6xl font-headline text-zinc-100 font-black tracking-tight leading-tight select-all">
                Rp {remainingBudget.toLocaleString("id")}
              </h2>
              
              <div className="mt-5 pt-5 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-zinc-350"></span>
                  Sisa {state.hariKeKiriman} hari ke kiriman
                </span>
                <span className="font-semibold text-zinc-100 bg-zinc-800 px-2 py-1 rounded border border-zinc-700">
                  Saldo: Rp {state.saldoMakan.toLocaleString("id")}
                </span>
              </div>
            </div>
          </div>

          {/* DONUT CHART SPEND PERCENT (3-columns) */}
          <div className="lg:col-span-3 bg-[#0C0C0E] border border-zinc-800/60 rounded-3xl p-6 flex flex-col justify-center items-center relative shadow-xl">
            <div className="relative w-32 h-32 flex items-center justify-center my-3">
              <svg className="w-full h-full transform -rotate-90 select-none">
                <circle cx="64" cy="64" r="52" strokeWidth="10" stroke="#1c1c1f" fill="transparent" />
                <circle
                  cx="64" cy="64" r="52" strokeWidth="10" stroke="#e4e4e7" fill="transparent"
                  strokeDasharray={2 * Math.PI * 52}
                  strokeDashoffset={2 * Math.PI * 52 * (1 - spendPercentage / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-zinc-100">{spendPercentage}%</span>
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Terpakai</span>
              </div>
            </div>
            <div className="text-center w-full mt-2">
              <p className="text-sm font-semibold text-zinc-300">
                Spent: <span className="text-zinc-100 font-mono">Rp {totalSpentToday.toLocaleString("id")}</span>
              </p>
            </div>
          </div>

          {/* NUTRITION & CALORIES (3-columns) */}
          <div className="lg:col-span-3 bg-[#0C0C0E] border border-zinc-800/60 rounded-3xl p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Nutrisi Masuk</span>
                <Flame className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="text-3xl font-bold font-sans text-emerald-400 leading-none mb-1">
                {totalCaloriesToday} <span className="text-sm text-zinc-400 font-normal">kkal</span>
              </h3>
            </div>

            <div className="my-3">
              <div className="h-2 w-full bg-[#1c1c1f] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-400 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (totalCaloriesToday / state.targetCalories) * 100)}%` }}
                />
              </div>
              <p className="text-right text-[10px] text-zinc-500 mt-1">
                target: {state.targetCalories} kkal
              </p>
            </div>

            <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-zinc-800/60">
              <div className="bg-zinc-900/60 rounded-lg p-1 text-center border border-zinc-800/40">
                <span className="block text-[8px] text-zinc-500 uppercase font-medium">Pro</span>
                <span className="text-xs font-bold text-zinc-300">{Math.round(totalCaloriesToday * 0.08)}g</span>
              </div>
              <div className="bg-zinc-900/60 rounded-lg p-1 text-center border border-zinc-800/40">
                <span className="block text-[8px] text-zinc-500 uppercase font-medium">Karbo</span>
                <span className="text-xs font-bold text-zinc-300">{Math.round(totalCaloriesToday * 0.4)}g</span>
              </div>
              <div className="bg-zinc-900/60 rounded-lg p-1 text-center border border-zinc-800/40">
                <span className="block text-[8px] text-zinc-500 uppercase font-medium">Lemak</span>
                <span className="text-xs font-bold text-zinc-300">{Math.round(totalCaloriesToday * 0.04)}g</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: FOOD LOGS LIST & SPENDING WEEKLY CHART */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* LOG MAKAN AREA (7-columns) */}
          <div className="lg:col-span-7 bg-[#0C0C0E] border border-zinc-800/60 rounded-3xl p-5 md:p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-zinc-400" />
                  Menu Makan Hari Ini
                </h3>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-zinc-700 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah Log
                </button>
              </div>

              <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-1">
                {(!state.todayEntries || state.todayEntries.length === 0) ? (
                  <div className="text-center py-8 border border-dashed border-zinc-800 rounded-2xl">
                    <p className="text-sm text-zinc-500 italic">Belum mencatat makanan apa pun hari ini.</p>
                  </div>
                ) : (
                  state.todayEntries.map((log) => (
                    <div 
                      key={log.id} 
                      className="flex items-center justify-between p-3.5 bg-zinc-900/30 hover:bg-zinc-900/80 rounded-2xl border border-zinc-800/60 hover:border-zinc-700/60 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-zinc-800/60 flex items-center justify-center text-lg">
                          {log.emoji || "🍱"}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-zinc-200 group-hover:text-zinc-100 transition-colors">{log.name}</h4>
                          <div className="flex items-center gap-2.5 mt-0.5">
                            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded tracking-wide ${
                              log.meal === "pagi" ? "bg-amber-500/10 text-amber-400" :
                              log.meal === "siang" ? "bg-blue-500/10 text-blue-400" :
                              log.meal === "malam" ? "bg-indigo-500/10 text-indigo-400" :
                              "bg-gray-500/10 text-gray-400"
                            }`}>
                              {log.meal}
                            </span>
                            <span className="text-[11px] text-zinc-400 flex items-center gap-0.5">
                              <Flame className="w-3 h-3 text-emerald-400" /> {log.calories > 0 ? `${log.calories} kkal` : "-"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-sm font-bold text-zinc-200">Rp {log.price.toLocaleString("id")}</span>
                        </div>
                        <button 
                          onClick={() => removeFoodEntry(log.id)}
                          className="p-2 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Belum makan malam placeholder suggest box */}
            {state.todayEntries && !state.todayEntries.some(log => log.meal === "malam") && (
              <div className="mt-4 pt-4 border-t border-zinc-800/60">
                <span className="text-xs font-bold text-zinc-500 uppercase block mb-2 tracking-wider">
                  🤔 Belum makan malam? Coba rekomendasi hemat ini:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {mealSuggestions.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickAdd(item)}
                      className="flex flex-col justify-between p-3 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900 text-left transition-all group duration-200 cursor-pointer"
                    >
                      <div>
                        <h5 className="text-xs font-bold text-zinc-200 truncate group-hover:text-zinc-100">{item.name}</h5>
                        <p className="text-[10px] text-zinc-500 mt-0.5">{item.calories} kkal</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-zinc-300 mt-1.5 flex items-center justify-between w-full">
                        Rp {item.price.toLocaleString("id")}
                        <Plus className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 text-zinc-400" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* TREN PENGELUARAN BAR CHART (5-columns) */}
          <div className="lg:col-span-5 bg-[#0C0C0E] border border-zinc-800/60 rounded-3xl p-5 md:p-6 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-zinc-100">Tren Jajan</h3>
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest font-mono">7 Hari Terakhir</span>
              </div>
              <p className="text-xs text-zinc-400 leading-tight">Pengeluaran harian makan kamu vs. limit target Rp {dailyLimit.toLocaleString("id")}.</p>
            </div>

            <div className="relative h-44 flex items-end justify-between gap-3 pt-6 mb-1 select-none">
              <div className="absolute w-full border-t border-dashed border-red-500/25 top-[35%] z-0">
                <span className="absolute -top-4 right-0 text-[9px] text-red-500/80 font-bold tracking-widest uppercase bg-[#0C0C0E] px-1 rounded">Limit {Math.round(dailyLimit/1000)}k</span>
              </div>

              {state.weeklySpending?.map((item, idx) => {
                const isToday = idx === state.weeklySpending.length - 1;
                const isOver = item.amount > dailyLimit;
                const heightPercentage = dailyLimit > 0 ? Math.min(110, (item.amount / dailyLimit) * 100) : 0;
                
                return (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group relative z-10">
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-950 border border-zinc-800 text-zinc-100 font-mono text-[10px] px-2 py-1 rounded-md shadow-md pointer-events-none whitespace-nowrap">
                    Rp {item.amount.toLocaleString("id")}
                  </div>

                  <div 
                    style={{ height: `${Math.max(5, heightPercentage)}%` }}
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      isToday 
                        ? "bg-white shadow-[0_0_12px_rgba(255,255,255,0.15)]" 
                        : isOver 
                          ? "bg-gradient-to-t from-red-600/40 to-red-500" 
                          : "bg-zinc-800"
                    }`}
                  />
                  <span className={`text-[10px] mt-2 font-semibold ${isToday ? "text-zinc-200" : "text-zinc-500"}`}>
                    {item.day}
                  </span>
                </div>
              )})}
            </div>
          </div>
        </section>

        {/* SECTION 3: QUICK ACTIONS BENTO GRID */}
        <section>
          <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-3">Peralatan Makan Pintar</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => router.push("/resep")}
              className="flex flex-col items-start gap-4 p-5 rounded-2xl bg-[#0C0C0E] border border-zinc-800/70 hover:border-zinc-700 hover:translate-y-[-3px] transition-all text-left duration-200 cursor-pointer"
            >
              <div className="p-3 rounded-xl bg-zinc-900 text-zinc-200 border border-zinc-800">
                <ChefHat className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-200">Resep AI</h4>
                <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">Ide masakan super murah sesuai sisa budget harian lo.</p>
              </div>
            </button>

            <button 
              onClick={() => router.push("/profil")}
              className="flex flex-col items-start gap-4 p-5 rounded-2xl bg-[#0C0C0E] border border-zinc-800/70 hover:border-zinc-700 hover:translate-y-[-3px] transition-all text-left duration-200 cursor-pointer"
            >
              <div className="p-3 rounded-xl bg-zinc-900 text-zinc-200 border border-zinc-800">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-200">Target Nutrisi</h4>
                <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">Atur jatah duit makan mingguan lo supaya aman.</p>
              </div>
            </button>
            
            <button 
              onClick={() => router.push("/riwayat")}
              className="flex flex-col items-start gap-4 p-5 rounded-2xl bg-[#0C0C0E] border border-zinc-800/70 hover:border-zinc-700 hover:translate-y-[-3px] transition-all text-left duration-200 cursor-pointer"
            >
              <div className="p-3 rounded-xl bg-zinc-900 text-zinc-200 border border-zinc-800">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-200">Bandingkan Cost</h4>
                <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">Lihat histori lengkap dan amati kebocoran dana.</p>
              </div>
            </button>
          </div>
        </section>

        {/* SECTION 4: SURVIVAL BULLET BANNER */}
        <section className="bg-gradient-to-r from-zinc-900/50 via-zinc-900/10 to-transparent border border-zinc-800 rounded-2xl p-5 flex items-center gap-4 shadow-xl">
          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 shrink-0">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Tips Bertahan Hidup Anak Kos</h4>
            <p className="text-sm text-zinc-300 mt-0.5 leading-relaxed">
              "{randomTip}"
            </p>
          </div>
        </section>

        {/* LOG MEAL DIALOG MODAL */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
              <h4 className="text-lg font-bold text-zinc-100 mb-4 flex items-center gap-2 border-b border-zinc-900 pb-3">
                <Utensils className="w-5 h-5 text-zinc-400" />
                Catat Makanan Baru
              </h4>
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-500 font-bold mb-1.5">Nama Makanan / Minuman</label>
                  <input 
                    type="text" 
                    value={newFoodName}
                    onChange={(e) => setNewFoodName(e.target.value)}
                    placeholder="e.g. Nasi Padang Rendang" 
                    className="w-full bg-zinc-900/70 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-500 font-bold mb-1.5">Harga (Rp)</label>
                  <input 
                    type="number" 
                    value={newFoodPrice}
                    onChange={(e) => setNewFoodPrice(e.target.value)}
                    placeholder="e.g. 15000" 
                    className="w-full bg-zinc-900/70 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-500 font-bold mb-1.5">Waktu Makan</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(["pagi", "siang", "malam", "cemilan"]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setNewFoodType(type)}
                        className={`py-2 text-xs font-bold rounded-lg uppercase transition-all tracking-wide cursor-pointer ${
                          newFoodType === type 
                            ? "bg-zinc-100 text-zinc-950 font-semibold" 
                            : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-300 border border-zinc-800/80"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2.5 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 text-xs font-bold uppercase rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 text-xs font-bold uppercase rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 transition-colors shadow-lg cursor-pointer"
                  >
                    Simpan Log
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
