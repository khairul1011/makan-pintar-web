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
    <div className={`modal-overlay ${isOpen ? "open" : ""}`} onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">🍽️ Tambah Makanan</h2>

        <form className="feature-form" onSubmit={handleSubmit}>
          {/* Emoji Picker */}
          <div>
            <label className="field-label">Pilih Emoji</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {FOOD_EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  style={{
                    width: 42,
                    height: 42,
                    fontSize: "1.4rem",
                    borderRadius: 12,
                    border: emoji === e 
                      ? "2px solid rgba(74, 222, 128, 0.8)" 
                      : "1px solid rgba(255,255,255,0.12)",
                    background: emoji === e
                      ? "rgba(74, 222, 128, 0.15)"
                      : "rgba(255,255,255,0.06)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Nama Makanan */}
          <div>
            <label className="field-label">Nama Makanan</label>
            <input
              className="feature-input"
              type="text"
              placeholder="Contoh: Nasi Goreng"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              required
            />
          </div>

          {/* Waktu Makan */}
          <div>
            <label className="field-label">Waktu Makan</label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {MEAL_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setMeal(opt.value)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999,
                    border: meal === opt.value
                      ? "2px solid rgba(74, 222, 128, 0.8)"
                      : "1px solid rgba(255,255,255,0.12)",
                    background: meal === opt.value
                      ? "rgba(74, 222, 128, 0.15)"
                      : "rgba(255,255,255,0.06)",
                    color: meal === opt.value ? "#4ade80" : "rgba(255,255,255,0.6)",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {opt.emoji} {opt.value}
                </button>
              ))}
            </div>
          </div>

          {/* Harga */}
          <div>
            <label className="field-label">Harga</label>
            <div className="rp-field">
              <span>Rp</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="15.000"
                value={price}
                onChange={handlePriceChange}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            className="feature-cta"
            type="submit"
            disabled={!name.trim() || isSubmitting}
            style={{
              opacity: !name.trim() || isSubmitting ? 0.5 : 1,
              cursor: !name.trim() || isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {isSubmitting ? "⏳ Menyimpan..." : "✅ Simpan Makanan"}
          </button>
        </form>
      </div>
    </div>
  );
}
