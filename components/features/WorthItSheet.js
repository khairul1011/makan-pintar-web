"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { formatRupiah, getDailyBudget, parsePriceInput } from "@/lib/utils";
import FeatureSheet from "../ui/FeatureSheet";

export default function WorthItSheet({ isOpen, onClose }) {
  const { state } = useApp();
  const [foodName, setFoodName] = useState("");
  const [foodPrice, setFoodPrice] = useState("");
  const [showResult, setShowResult] = useState(false);

  const budgetHarian = getDailyBudget(state.saldoMakan, state.hariKeKiriman);
  const foodPriceNum = parsePriceInput(foodPrice);
  const afterSpent = state.todaySpent + foodPriceNum;
  const remaining = budgetHarian - afterSpent;
  const percent = Math.min(Math.max((afterSpent / budgetHarian) * 100, 0), 100);

  let status = { className: "red", icon: "🔴", text: "Mepet banget" };
  if (remaining > 15000) {
    status = { className: "green", icon: "✅", text: "Masih aman" };
  } else if (remaining >= 5000) {
    status = { className: "yellow", icon: "⚠️", text: "Agak mepet" };
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!foodPrice) return;
    setShowResult(true);
  };

  const handleClose = () => {
    setShowResult(false);
    setFoodName("");
    setFoodPrice("");
    onClose();
  };

  return (
    <FeatureSheet
      isOpen={isOpen}
      onClose={handleClose}
      title="🤔 Worth It Checker"
      showBack={showResult}
      onBack={() => setShowResult(false)}
    >
      {!showResult ? (
        <form className="feature-form active" onSubmit={handleSubmit}>
          <label className="field-label" htmlFor="worthFood">Mau beli apa?</label>
          <input
            className="feature-input"
            id="worthFood"
            type="text"
            placeholder="Contoh: Ayam Geprek"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            autoComplete="off"
          />
          <label className="field-label" htmlFor="worthPrice">Harganya berapa?</label>
          <div className="rp-field">
            <span>Rp</span>
            <input
              id="worthPrice"
              type="text"
              placeholder="25.000"
              inputMode="numeric"
              value={foodPrice}
              onChange={(e) => {
                import("@/lib/utils").then(({ formatRupiahInput }) => {
                  setFoodPrice(formatRupiahInput(e.target.value));
                });
              }}
            />
          </div>
          <button className="feature-cta" type="submit">Cek Sekarang →</button>
        </form>
      ) : (
        <div className="active">
          <div className="result-hero">
            <h3>{foodName || "Makanan ini"}</h3>
            <p>{formatRupiah(foodPriceNum)}</p>
            <div className="budget-bar-wrap">
              <div className="budget-bar-label">
                <span>Budget hari ini: {formatRupiah(budgetHarian)}</span>
                <span>{Math.round(percent)}%</span>
              </div>
              <div className="budget-bar">
                <div className="budget-bar-fill" style={{ width: `${percent}%` }}></div>
              </div>
            </div>
            <p>Kalau beli ini, sisa {formatRupiah(remaining)}</p>
          </div>
          <div className={`decision-card ${status.className}`}>
            <strong>{status.icon} {status.text}</strong>
          </div>
          <p className="sheet-section-title">Alternatif sekitar harga segitu:</p>
          <div className="alt-list">
            <div className="alt-row"><span>Warteg</span><strong>~Rp 15.000</strong></div>
            <div className="alt-row"><span>Masak sendiri</span><strong>~Rp 5.000</strong></div>
            <div className="alt-row"><span>GoFood promo</span><strong>~Rp 20.000</strong></div>
          </div>
          <p className="sheet-note">Keputusan tetap di tangan kamu 👍</p>
        </div>
      )}
    </FeatureSheet>
  );
}
