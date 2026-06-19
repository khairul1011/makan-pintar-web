"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import GlassCard from "../ui/GlassCard";

export default function BottomNav() {
  const pathname = usePathname();
  const [cameraOpen, setCameraOpen] = useState(false);

  const getActiveClass = (path) => {
    return pathname === path ? "nav-item active" : "nav-item";
  };

  return (
    <>
      <div className={`camera-popup glass-card ${cameraOpen ? "open" : ""}`} aria-hidden={!cameraOpen}>
        <button className="camera-option" type="button">
          <span className="camera-option-icon" aria-hidden="true">🍛</span>
          <span><strong>Scan Makanan</strong><span>Deteksi nutrisi & kkal</span></span>
        </button>
        <button className="camera-option" type="button">
          <span className="camera-option-icon" aria-hidden="true">🧾</span>
          <span><strong>Scan Struk</strong><span>Update budget otomatis</span></span>
        </button>
      </div>

      <nav className="bottom-nav" aria-label="Navigasi bawah">
        <Link href="/" className={getActiveClass("/")}>
          <span className="nav-icon" aria-hidden="true">🏠</span>
          <span>Dashboard</span>
        </Link>
        <Link href="/riwayat" className={getActiveClass("/riwayat")}>
          <span className="nav-icon" aria-hidden="true">📊</span>
          <span>Riwayat</span>
        </Link>
        
        <div className="camera-nav-wrap">
          <button 
            className="camera-nav" 
            type="button" 
            aria-label="Buka menu kamera"
            onClick={() => setCameraOpen(!cameraOpen)}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 8.5C4 7.12 5.12 6 6.5 6h1.84c.42 0 .81-.21 1.04-.55l.74-1.1c.23-.34.62-.55 1.04-.55h1.7c.42 0 .81.21 1.04.55l.74 1.1c.23.34.62.55 1.04.55h1.78C18.88 6 20 7.12 20 8.5v8A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-8Z" strokeWidth="2" strokeLinejoin="round"></path>
              <path d="M12 15.75a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Z" strokeWidth="2"></path>
            </svg>
          </button>
        </div>

        <Link href="/resep" className={getActiveClass("/resep")}>
          <span className="nav-icon" aria-hidden="true">🍳</span>
          <span>Resep</span>
        </Link>
        <Link href="/profil" className={getActiveClass("/profil")}>
          <span className="nav-icon" aria-hidden="true">👤</span>
          <span>Profil</span>
        </Link>
      </nav>

      {/* Backdrop for camera popup */}
      {cameraOpen && (
        <div 
          className="overlay open" 
          onClick={() => setCameraOpen(false)}
          style={{ zIndex: 34, background: "transparent" }} 
        />
      )}
    </>
  );
}
