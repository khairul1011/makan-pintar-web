"use client";

import GlassCard from "../ui/GlassCard";

export default function SettingsCard({ title, children }) {
  return (
    <GlassCard className="card-pad settings-card">
      <h3>{title}</h3>
      {children}
    </GlassCard>
  );
}
