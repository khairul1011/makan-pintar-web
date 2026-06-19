"use client";

import GlassPill from "../ui/GlassPill";

export default function Navbar({ onChatOpen }) {
  return (
    <nav className="navbar" aria-label="Navigasi utama">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true">🍽️</div>
        <div>
          <h1 className="brand-text">Makan Pintar</h1>
          <span className="brand-subtitle">Budget makan harian yang ngerti kondisi dompet</span>
        </div>
      </div>
      <button 
        className="ai-button glass-pill" 
        type="button" 
        aria-label="Buka chat AI"
        onClick={onChatOpen}
      >
        <span aria-hidden="true">💬</span>
        <span>AI Chat</span>
      </button>
    </nav>
  );
}

