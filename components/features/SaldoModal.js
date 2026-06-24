"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/lib/store";
import { formatRupiah, formatRupiahInput } from "@/lib/utils";
import { X, Wallet } from "lucide-react";

export default function SaldoModal({ isOpen, onClose }) {
  const { state, updateSaldo } = useApp();
  const [newSaldo, setNewSaldo] = useState("");

  useEffect(() => {
    if (isOpen) {
      setNewSaldo(formatRupiahInput(state.saldoMakan));
    }
  }, [isOpen, state.saldoMakan]);

  const handleSave = () => {
    const val = Number(newSaldo.replace(/[^\d]/g, ""));
    if (Number.isFinite(val) && val >= 0) {
      updateSaldo(val);
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" aria-hidden={!isOpen}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 opacity-100" 
        onClick={onClose} 
      />
      
      {/* Modal Card */}
      <section 
        className="relative w-full max-w-sm bg-zinc-950/95 backdrop-blur-xl border border-zinc-800/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200" 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modalTitle"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/60 bg-zinc-900/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Wallet className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-zinc-100 tracking-wide" id="modalTitle">Update Saldo</h2>
          </div>
          <button 
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors" 
            type="button" 
            onClick={onClose} 
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-5 flex flex-col gap-5">
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-4 flex flex-col items-center text-center">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Saldo Sekarang</span>
            <strong className="text-2xl font-black text-zinc-100 tracking-tight font-headline">{formatRupiah(state.saldoMakan)}</strong>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-zinc-300" htmlFor="newSaldo">Saldo Baru</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-zinc-500 font-medium text-lg">Rp</span>
              <input 
                className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl pl-12 pr-4 py-3.5 text-lg font-bold text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:bg-zinc-900 transition-colors font-mono tracking-wide" 
                id="newSaldo" 
                type="text" 
                inputMode="numeric" 
                placeholder="420.000"
                value={newSaldo}
                onChange={(e) => setNewSaldo(formatRupiahInput(e.target.value))}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            </div>
          </div>
          
          <button 
            className="mt-2 w-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl py-3.5 px-4 shadow-xl transition-all transform active:scale-[0.98]" 
            type="button" 
            onClick={handleSave}
          >
            Simpan Saldo
          </button>
        </div>
      </section>
    </div>
  );
}
