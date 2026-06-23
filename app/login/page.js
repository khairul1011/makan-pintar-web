"use client";

import { Suspense } from "react";
import LoginContent from "./LoginContent";

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="text-zinc-500 font-bold flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-zinc-800 border-t-zinc-400 rounded-full animate-spin"></div>
          Memuat...
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
