"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Utensils, TrendingUp, ChefHat, Scale } from "lucide-react";

export default function LoginContent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const supabase = createClient();

  // Deteksi session setelah redirect dari Google
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
    setSuccessMsg(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      setError("Gagal login dengan Google. Silakan coba lagi.");
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setError("Email dan password harus diisi.");
      setLoading(false);
      return;
    }

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccessMsg("Berhasil mendaftar! Cek email untuk konfirmasi.");
        setIsSignUp(false);
        setPassword("");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccessMsg("Berhasil masuk. Mengarahkan...");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col lg:flex-row font-sans text-zinc-200">
      
      {/* KIRI - Panel Branding (Hidden di Mobile) */}
      <div className="hidden lg:flex w-[55%] flex-col justify-between bg-[#0C0C0E] border-r border-zinc-800 p-12 lg:p-20 relative overflow-hidden group">
        {/* Dekorasi efek cahaya */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-zinc-800/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 group-hover:bg-zinc-800/20 transition-all duration-1000"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center shadow-inner">
              <Utensils className="w-6 h-6 text-zinc-100" />
            </div>
            <h1 className="text-3xl font-headline font-black text-zinc-100 tracking-tight">Makan Pintar</h1>
          </div>
          <p className="text-xl text-zinc-400 font-medium max-w-md leading-relaxed">
            Budget makan harian yang ngerti bener kondisi dompet anak kos.
          </p>
        </div>

        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4 bg-zinc-900/40 border border-zinc-800/60 p-5 rounded-2xl max-w-sm backdrop-blur-sm">
            <div className="p-3 bg-zinc-800 rounded-xl text-zinc-300">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100">Pantau Limit Harian</h3>
              <p className="text-xs text-zinc-500 mt-1">Otomatis dihitung dari saldo yang tersisa.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-zinc-900/40 border border-zinc-800/60 p-5 rounded-2xl max-w-sm backdrop-blur-sm ml-8">
            <div className="p-3 bg-zinc-800 rounded-xl text-zinc-300">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100">Resep Survival AI</h3>
              <p className="text-xs text-zinc-500 mt-1">Ide masakan murah sesuai sisa budget kamu.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-zinc-900/40 border border-zinc-800/60 p-5 rounded-2xl max-w-sm backdrop-blur-sm ml-16">
            <div className="p-3 bg-zinc-800 rounded-xl text-zinc-300">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100">Bandingkan Cost</h3>
              <p className="text-xs text-zinc-500 mt-1">Evaluasi pengeluaran bulanan dengan mudah.</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-zinc-600 font-mono mt-8">
          &copy; {new Date().getFullYear()} Makan Pintar — Mode Bertahan Hidup.
        </div>
      </div>

      {/* KANAN - Panel Form Login */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative">
        <div className="w-full max-w-[400px]">
          {/* Logo Mobile Only */}
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center">
              <Utensils className="w-5 h-5 text-zinc-100" />
            </div>
            <h1 className="text-2xl font-headline font-black text-zinc-100">Makan Pintar</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100">
              {isSignUp ? "Buat Akun Baru" : "Selamat Datang"}
            </h2>
            <p className="text-sm text-zinc-500 mt-2">
              {isSignUp ? "Daftar sekarang untuk mulai mengelola jatah makanmu." : "Masuk ke akunmu untuk lanjut mengatur budget."}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center gap-2">
              <span className="text-lg">⚠️</span> {error}
            </div>
          )}
          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium flex items-center gap-2">
              <span className="text-lg">✅</span> {successMsg}
            </div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-500 font-bold mb-1.5 ml-1">Alamat Email</label>
              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-500 font-bold mb-1.5 ml-1">Kata Sandi</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-zinc-100 hover:bg-white text-zinc-950 font-bold rounded-xl py-3.5 mt-2 transition-all transform active:scale-[0.98] shadow-lg flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-zinc-400 border-t-zinc-950 rounded-full animate-spin"></div>
              ) : (
                isSignUp ? "Daftar Akun" : "Masuk"
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-2 text-sm justify-center">
            <span className="text-zinc-500">
              {isSignUp ? "Sudah punya akun?" : "Belum punya akun?"}
            </span>
            <button 
              type="button" 
              onClick={() => setIsSignUp(!isSignUp)}
              disabled={loading}
              className="text-zinc-300 font-bold hover:text-white transition-colors underline decoration-zinc-700 underline-offset-4"
            >
              {isSignUp ? "Masuk di sini" : "Daftar sekarang"}
            </button>
          </div>

          <div className="flex items-center gap-3 my-8">
            <div className="flex-1 h-px bg-zinc-800"></div>
            <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Atau</span>
            <div className="flex-1 h-px bg-zinc-800"></div>
          </div>

          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl py-3.5 transition-colors text-sm font-bold disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Masuk dengan Google
          </button>

          <p className="text-center text-xs text-zinc-600 mt-8 font-medium">
            Data kamu aman & tersimpan di cloud ☁️
          </p>
        </div>
      </div>
    </div>
  );
}
