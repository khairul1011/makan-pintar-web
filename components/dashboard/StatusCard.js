"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { formatRupiah, getDailyBudget, getMode } from "@/lib/utils";
import { MODE_CONFIG } from "@/lib/constants";
import GlassCard from "../ui/GlassCard";
import IconButton from "../ui/IconButton";
import SaldoModal from "../features/SaldoModal";

export default function StatusCard() {
  const { state } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  const budgetHarian = getDailyBudget(state.saldoMakan, state.hariKeKiriman);
  const mode = getMode(budgetHarian, MODE_CONFIG);

  return (
    <>
      <GlassCard className="card-pad status-card">
        <div className="status-top">
          <span className="mode-badge">
            {mode.emoji} {mode.label}
          </span>
        </div>
        <p className="eyebrow">Budget hari ini</p>
        <p className="budget-amount">{formatRupiah(budgetHarian)}</p>
        <p className="subtitle">Sisa {state.hariKeKiriman} hari ke kiriman berikutnya</p>
        <div className="status-bottom">
          <div>
            <span className="balance-label">Saldo makan</span>
            <span className="balance-value">{formatRupiah(state.saldoMakan)}</span>
          </div>
          <IconButton 
            className="glass-card" 
            aria-label="Edit saldo makan"
            onClick={() => setModalOpen(true)}
          >
            ✏️
          </IconButton>
        </div>
      </GlassCard>

      <SaldoModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
