"use client";

import { useState, useEffect } from "react";
import { formatRupiahInput } from "@/lib/utils";

const MEAL_OPTIONS = [
  { value: "Pagi", emoji: "🌅" },
  { value: "Siang", emoji: "☀️" },
  { value: "Sore", emoji: "🌇" },
  { value: "Malam", emoji: "🌙" },
];

const FOOD_EMOJIS = ["🍛", "🍜", "🍳", "🍱", "🍗", "🥚", "🍔", "🥤", "🧁", "🥟", "🍲", "🥗"];

export default function AddFoodModal({ isOpen, onClose, onSubmit, initialData }) {
  const [name, setName] = useState("");
  const [meal, setMeal] = useState("Siang");
  const [price, setPrice] = useState("");
  const [emoji, setEmoji] = useState("🍛");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && isOpen) {
      setName(initialData.namaMakanan || "");
      if (initialData.prediksiHarga) {
        setPrice(formatRupiahInput(initialData.prediksiHarga.toString()));
      }
      if (initialData.emoji && FOOD_EMOJIS.includes(initialData.emoji)) {
        setEmoji(initialData.emoji);
      }
    }
  }, [initialData, isOpen]);

  const resetForm = () => {
    setName("");
    setMeal("Siang");
    setPrice("");
    setEmoji("🍛");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Simpan data sementara sebelum form di-reset
    const foodData = {
      emoji,
      name: name.trim(),
      meal,
      price: parseInt(price.replace(/\D/g, "")) || 0,
    };

    // Langsung tutup dan reset form (Optimistic UI)
    onClose();
    resetForm();

    // Proses onSubmit (yang mengirim request ke API secara background)
    await onSubmit({
      ...foodData,
      calories: initialData?.prediksiKalori || 0
    });
  };

  const handlePriceChange = (e) => {
    const formatted = formatRupiahInput(e.target.value);
    setPrice(formatted);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} onClick={onClose}>
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-5">
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            🍽️ <span className="mt-1">Tambah Makanan</span>
          </h2>
          <button onClick={onClose} className="p-2 -mr-2 text-zinc-500 hover:text-zinc-300 rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Emoji Picker */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2">Pilih Emoji</label>
            <div className="flex flex-wrap gap-2">
              {FOOD_EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`w-10 h-10 text-xl rounded-xl flex items-center justify-center cursor-pointer transition-all ${emoji === e ? "border-2 border-emerald-400 bg-emerald-400/10 shadow-[0_0_15px_rgba(52,211,153,0.15)] scale-110" : "border border-zinc-800 bg-zinc-900 hover:bg-zinc-800/80"}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Nama Makanan */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2">Nama Makanan / Minuman</label>
            <input
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:bg-zinc-800/50 transition-colors"
              type="text"
              placeholder="Contoh: Nasi Goreng Gila"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              required
            />
          </div>

          {/* Waktu Makan */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2">Waktu Makan</label>
            <div className="flex flex-wrap gap-2">
              {MEAL_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setMeal(opt.value)}
                  className={`px-4 py-2 rounded-full text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${meal === opt.value ? "border-2 border-emerald-400 bg-emerald-400/10 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.1)]" : "border border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-300"}`}
                >
                  <span className="text-sm">{opt.emoji}</span> <span>{opt.value}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Harga */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2">Harga</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-zinc-500 font-bold text-sm">Rp</span>
              <input
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:bg-zinc-800/50 transition-colors"
                type="text"
                inputMode="numeric"
                placeholder="15.000"
                value={price}
                onChange={handlePriceChange}
                required
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              className="w-full py-3.5 bg-zinc-100 hover:bg-white text-zinc-950 font-black tracking-wide uppercase text-xs rounded-xl shadow-lg transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
              type="submit"
              disabled={!name.trim() || isSubmitting}
            >
              {isSubmitting ? "⏳ Menyimpan..." : "✅ Simpan Log Makanan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
