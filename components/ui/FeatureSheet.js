import { useEffect, useState } from "react";

export default function FeatureSheet({ isOpen, onClose, title, children, showBack = false, onBack = null }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`feature-sheet ${isOpen ? "open" : ""}`} aria-hidden={!isOpen}>
      <section className="feature-sheet-card glass-card card-pad" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
        <div className="sheet-handle"></div>
        <div className="modal-header">
          <div className="sheet-title-wrap">
            <button 
              className={`sheet-back ${showBack ? "visible" : ""}`} 
              type="button" 
              onClick={onBack}
              aria-label="Kembali"
            >
              ←
            </button>
            <h2 className="modal-title" id="sheet-title">{title}</h2>
          </div>
          <button className="icon-button" onClick={onClose} type="button" aria-label="Tutup">
            ×
          </button>
        </div>
        {children}
      </section>
      <div className={`overlay ${isOpen ? "open" : ""}`} onClick={onClose} style={{ zIndex: -1 }} />
    </div>
  );
}
