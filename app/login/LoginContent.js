"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function LoginContent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const supabase = createClient();

  // Deteksi session setelah redirect dari Google (implicit flow mengembalikan token di URL hash)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        router.replace("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError("Gagal login. Silakan coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card glass-card">
        <div className="login-brand">
          <div className="brand-mark login-mark" aria-hidden="true">🍽️</div>
          <h1 className="login-title">Makan Pintar</h1>
          <p className="login-subtitle">Budget makan harian yang ngerti kondisi dompet</p>
        </div>

        <div className="login-features">
          <div className="login-feature">
            <span aria-hidden="true">📊</span>
            <span>Lacak pengeluaran makan harian</span>
          </div>
          <div className="login-feature">
            <span aria-hidden="true">🤔</span>
            <span>Worth It Checker & Compare</span>
          </div>
          <div className="login-feature">
            <span aria-hidden="true">🍳</span>
            <span>Resep survival AI-powered</span>
          </div>
        </div>

        {error && (
          <div className="login-error">⚠️ {error}</div>
        )}

        {loading ? (
          <p style={{ color: "var(--muted)", fontWeight: 700, textAlign: "center" }}>⏳ Menghubungkan ke Google...</p>
        ) : (
          <button 
            className="google-login-btn" 
            onClick={handleGoogleLogin}
            disabled={loading}
            type="button"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Masuk dengan Google</span>
          </button>
        )}

        <p className="login-note">Data kamu aman & tersimpan di cloud ☁️</p>
      </div>
    </div>
  );
}
