"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import BottomNav from "@/components/layout/BottomNav";
import HistoryToggle from "@/components/riwayat/HistoryToggle";
import HistoryChart from "@/components/riwayat/HistoryChart";
import SummaryRow from "@/components/riwayat/SummaryRow";
import HistoryList from "@/components/riwayat/HistoryList";

export default function RiwayatPage() {
  const [mode, setMode] = useState("spending");

  return (
    <>
      <AppShell>
        <main className="app-page active">
          <header className="page-header">
            <div>
              <h2 className="page-title">Riwayat</h2>
              <span className="page-subtitle">Juni 2025</span>
            </div>
          </header>

          <HistoryToggle mode={mode} setMode={setMode} />

          <section className="history-content">
            <HistoryChart mode={mode} />
            <SummaryRow mode={mode} />
            <HistoryList mode={mode} />
          </section>
        </main>
      </AppShell>
      <BottomNav />
    </>
  );
}
