"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { formatRupiah, getDailyBudget, parsePriceInput } from "@/lib/utils";
import FeatureSheet from "../ui/FeatureSheet";

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
    ? `💡 ${winnerName} lebih hemat ${diffPercent}%`
    : diffPercent < 15
      ? "💡 Hampir sama, pilih yang kamu suka aja"
      : `💡 ${winnerName} lumayan lebih hemat`;

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
        <form className="feature-form active" onSubmit={handleSubmit}>
          <div className="compare-choice">
            <label className="field-label" htmlFor="compareAName">Pilihan A</label>
            <input
              className="feature-input"
              id="compareAName"
              type="text"
              placeholder="Nama makanan/tempat"
              value={form.nameA}
              onChange={(e) => setForm({ ...form, nameA: e.target.value })}
            />
            <div className="rp-field" style={{ marginTop: "10px" }}>
              <span>Rp</span>
              <input
                id="compareAPrice"
                type="text"
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
          <div className="vs-divider">VS</div>
          <div className="compare-choice purple">
            <label className="field-label" htmlFor="compareBName">Pilihan B</label>
            <input
              className="feature-input"
              id="compareBName"
              type="text"
              placeholder="Nama makanan/tempat"
              value={form.nameB}
              onChange={(e) => setForm({ ...form, nameB: e.target.value })}
            />
            <div className="rp-field" style={{ marginTop: "10px" }}>
              <span>Rp</span>
              <input
                id="compareBPrice"
                type="text"
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
          <button className="feature-cta" type="submit">Bandingkan →</button>
        </form>
      ) : (
        <div className="active">
          <div className="compare-result-grid">
            <div className={`compare-result-card ${winner === "A" ? "winner" : ""}`}>
              <span>{nameA}</span>
              <strong>{formatRupiah(priceA)}</strong>
            </div>
            <div className="compare-vs">VS</div>
            <div className={`compare-result-card ${winner === "B" ? "winner" : ""}`}>
              <span>{nameB}</span>
              <strong>{formatRupiah(priceB)}</strong>
            </div>
          </div>
          <div className="compare-diff-card">
            <span>Selisih</span>
            <strong>{formatRupiah(diff)}</strong>
            <p>Dengan selisih itu kamu bisa:</p>
            <ul>
              <li>Beli {gorengan} gorengan</li>
              <li>Hemat {daysSaved.toFixed(1)} hari kalau budget {formatRupiah(budgetHarian)}</li>
            </ul>
          </div>
          <span className="insight-pill">{insight}</span>
          <p className="sheet-note">Keputusan tetap di tangan kamu 👍</p>
        </div>
      )}
    </FeatureSheet>
  );
}
