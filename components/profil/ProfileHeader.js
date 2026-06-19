"use client";

import { useApp } from "@/lib/store";
import { getDailyBudget, getMode } from "@/lib/utils";
import { MODE_CONFIG } from "@/lib/constants";

export default function ProfileHeader() {
  const { state, user } = useApp();
  const budgetHarian = getDailyBudget(state.saldoMakan, state.hariKeKiriman);
  const mode = getMode(budgetHarian, MODE_CONFIG);

  // Ambil nama dari email (sebelum @)
  const username = user?.email ? user.email.split('@')[0] : "User";
  // Ambil inisial untuk avatar (max 2 huruf)
  const initial = username.substring(0, 2).toUpperCase();

  return (
    <header className="profile-header">
      <div className="avatar" aria-hidden="true">{initial}</div>
      <div>
        <h2 className="page-title">{username}</h2>
        <span className="page-subtitle">Mahasiswa · Mode {mode.label} {mode.emoji}</span>
      </div>
    </header>
  );
}
