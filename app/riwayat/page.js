"use client";

import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Search, Filter, Trash2, Flame } from "lucide-react";
import { useApp } from "@/lib/store";

export default function RiwayatPage() {
  const { state, removeFoodEntry } = useApp();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("semua");
  const [sortBy, setSortBy] = useState("date");

  const foodLogs = state.historyEntries || [];

  // Filter & Search logic
  const filteredLogs = foodLogs.filter((log) => {
    const matchesSearch = log.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "semua" || log.meal === filterType;
    return matchesSearch && matchesType;
  }).sort((a, b) => {
    if (sortBy === "price") return (b.price || 0) - (a.price || 0);
    if (sortBy === "calories") return (b.calories || 0) - (a.calories || 0);
    return new Date(b.rawDate || 0).getTime() - new Date(a.rawDate || 0).getTime();
  });

  const totalCost = filteredLogs.reduce((sum, log) => sum + (log.price || 0), 0);
  const averageCost = filteredLogs.length > 0 ? Math.round(totalCost / filteredLogs.length) : 0;

  return (
    <MainLayout>
      <div className="space-y-6 font-sans">
        {/* HEADER SECTION */}
        <div>
          <h2 className="text-2xl font-bold text-zinc-150 flex items-center gap-2">
            🧾 Riwayat Makan & Jajan
          </h2>
          <p className="text-xs text-zinc-405 mt-1 leading-normal">
            Pantau semua transaksi jajan dan makan kamu demi masa depan dompet yang lebih cerah.
          </p>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#0C0C0E] border border-zinc-800/80 rounded-2xl p-4 shadow-xl">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block">Total Transaksi</span>
            <span className="text-2xl font-bold text-zinc-200 mt-1 block font-sans">{filteredLogs.length} Kali Makan</span>
          </div>
          <div className="bg-[#0C0C0E] border border-zinc-800/80 rounded-2xl p-4 shadow-xl">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block">Total Pengeluaran</span>
            <span className="text-2xl font-bold text-zinc-100 mt-1 block font-sans">Rp {totalCost.toLocaleString("id")}</span>
          </div>
          <div className="bg-[#0C0C0E] border border-zinc-800/80 rounded-2xl p-4 shadow-xl">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block">Rata-rata / Makan</span>
            <span className="text-2xl font-bold text-emerald-400 mt-1 block font-sans">Rp {averageCost.toLocaleString("id")}</span>
          </div>
        </div>

        {/* SEARCH AND FILTERS TOOLBAR */}
        <div className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-2xl space-y-3.5 shadow-xl">
          <div className="flex flex-col md:flex-row gap-3.5">
            {/* Search Box */}
            <div className="relative flex-1">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari makanan (e.g. Ayam, Kopi, Warteg)..."
                className="w-full bg-zinc-950/75 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
              />
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
            </div>

            {/* Sort trigger */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 whitespace-nowrap">Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-zinc-950/75 border border-zinc-800 text-xs text-zinc-200 font-sans rounded-xl p-2.5 focus:outline-none focus:border-zinc-500 cursor-pointer"
              >
                <option value="date">Tanggal Terbaru</option>
                <option value="price">Harga Tertinggi</option>
                <option value="calories">Kalori Terbanyak</option>
              </select>
            </div>
          </div>

          {/* Categories Tags */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs text-zinc-500 mr-2 flex items-center gap-1"><Filter className="w-3.5 h-3.5 text-zinc-400" /> Filter:</span>
            {(["semua", "pagi", "siang", "malam", "cemilan"]).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`text-[10px] px-3.5 py-1.5 rounded-xl font-bold tracking-wider uppercase transition-all cursor-pointer ${
                  filterType === type 
                    ? "bg-zinc-100 text-zinc-950 shadow-md font-extrabold" 
                    : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300 border border-zinc-800"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* TRANSACTION ITEMS LIST */}
        <div className="bg-[#0C0C0E] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-sm text-zinc-500 italic">Tidak ada catatan transaksi yang cocok.</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/80">
              {filteredLogs.map((log) => (
                <div 
                  key={log.id} 
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#0C0C0E] hover:bg-zinc-900/30 transition-all duration-150 gap-3"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-full bg-zinc-900 border border-zinc-800/80 flex items-center justify-center text-xl shadow-inner shrink-0">
                      {log.emoji || "🍱"}
                    </div>
                    <div>
                      <h4 className="font-semibold text-zinc-200 text-sm sm:text-base">{log.name}</h4>
                      <div className="flex flex-wrap items-center gap-2.5 mt-1 text-xs text-sans">
                        <span className="text-zinc-500 font-mono">
                          {log.date}
                        </span>
                        <span className="text-zinc-700">•</span>
                        <span className={`uppercase font-bold text-[9px] px-1.5 rounded tracking-wider ${
                          log.meal === "pagi" ? "bg-amber-500/10 text-amber-400" :
                          log.meal === "siang" ? "bg-blue-500/10 text-blue-400" :
                          log.meal === "malam" ? "bg-indigo-500/10 text-indigo-400" :
                          "bg-gray-500/10 text-gray-400"
                        }`}>
                          {log.meal}
                        </span>
                        <span className="text-zinc-700">•</span>
                        <span className="text-zinc-400 flex items-center gap-0.5 font-mono">
                          <Flame className="w-3.5 h-3.5 text-emerald-400" /> {log.calories > 0 ? `${log.calories} kkal` : "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5">
                    <div className="text-left sm:text-right font-sans">
                      <span className="text-base font-bold text-zinc-100 block">Rp {(log.price || 0).toLocaleString("id")}</span>
                      {(log.price || 0) > 18000 ? (
                        <span className="text-[9px] font-bold text-red-400 uppercase px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 italic tracking-wider">Cukup Boros</span>
                      ) : (
                        <span className="text-[9px] font-bold text-emerald-400 uppercase px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 tracking-wider">Sesuai Budget</span>
                      )}
                    </div>

                    <button 
                      onClick={() => removeFoodEntry(log.id)}
                      className="p-2.5 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
