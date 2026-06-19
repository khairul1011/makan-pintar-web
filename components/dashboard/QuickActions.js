"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { getDailyBudget, getMode } from "@/lib/utils";
import { MODE_CONFIG, getQuickActionCards } from "@/lib/constants";
import GlassCard from "../ui/GlassCard";
import WorthItSheet from "../features/WorthItSheet";
import CompareSheet from "../features/CompareSheet";
import SurvivalSheet from "../features/SurvivalSheet";

export default function QuickActions() {
  const router = useRouter();
  const { state } = useApp();
  
  const [activeSheet, setActiveSheet] = useState(null);

  const budgetHarian = getDailyBudget(state.saldoMakan, state.hariKeKiriman);
  const mode = getMode(budgetHarian, MODE_CONFIG);
  const actions = getQuickActionCards(mode);

  const handleActionClick = (actionId) => {
    if (actionId === "cheapRecipes") {
      router.push("/resep");
    } else {
      setActiveSheet(actionId);
    }
  };

  return (
    <>
      <GlassCard className="card-pad">
        <div className="section-header">
          <h2 className="section-title">Quick Actions</h2>
          <span className="mode-badge quick-mode-badge">
            {mode.emoji} {mode.label}
          </span>
        </div>
        <div className={`quick-actions ${actions.length === 1 ? "single" : ""}`}>
          {actions.map((action) => (
            <button
              key={action.id}
              className="quick-action-card"
              type="button"
              onClick={() => handleActionClick(action.id)}
            >
              <span className="quick-action-icon" aria-hidden="true">{action.icon}</span>
              <span className="quick-action-title">{action.title}</span>
              <span className="quick-action-desc">{action.description}</span>
            </button>
          ))}
        </div>
      </GlassCard>

      <WorthItSheet isOpen={activeSheet === "worth"} onClose={() => setActiveSheet(null)} />
      <CompareSheet isOpen={activeSheet === "compare"} onClose={() => setActiveSheet(null)} />
      <SurvivalSheet isOpen={activeSheet === "survival"} onClose={() => setActiveSheet(null)} />
    </>
  );
}
