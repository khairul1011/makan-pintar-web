"use client";

import { Suspense } from "react";
import LoginContent from "./LoginContent";

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="login-page">
        <div className="login-card glass-card" style={{ textAlign: "center", padding: "36px" }}>
          <p style={{ color: "var(--muted)", fontWeight: 700 }}>⏳ Memuat...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
