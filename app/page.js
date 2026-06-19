"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import StatusCard from "@/components/dashboard/StatusCard";
import BudgetRing from "@/components/dashboard/BudgetRing";
import FoodLog from "@/components/dashboard/FoodLog";
import QuickActions from "@/components/dashboard/QuickActions";
import ChartCard from "@/components/dashboard/ChartCard";
import ChatPanel from "@/components/features/ChatPanel";

export default function Dashboard() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <AppShell>
        <Navbar onChatOpen={() => setChatOpen(true)} />
        
        <main className="dashboard-grid app-page active">
          <section className="column left-column" aria-label="Ringkasan dan log makan">
            <StatusCard />
            <FoodLog />
            <QuickActions />
          </section>

          <aside className="column right-column" aria-label="Budget dan riwayat">
            <BudgetRing />
            <ChartCard />
          </aside>
        </main>
      </AppShell>

      <BottomNav />
      <ChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}
