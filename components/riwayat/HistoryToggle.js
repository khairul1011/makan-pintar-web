"use client";

export default function HistoryToggle({ mode, setMode }) {
  return (
    <div 
      className="history-toggle" 
      data-mode={mode} 
      aria-label="Pilih tampilan riwayat"
    >
      <button 
        className={`toggle-option ${mode === "spending" ? "active" : ""}`} 
        type="button" 
        onClick={() => setMode("spending")}
      >
        💸 Pengeluaran
      </button>
      <button 
        className={`toggle-option ${mode === "calories" ? "active" : ""}`} 
        type="button" 
        onClick={() => setMode("calories")}
      >
        🔥 Kalori
      </button>
    </div>
  );
}
