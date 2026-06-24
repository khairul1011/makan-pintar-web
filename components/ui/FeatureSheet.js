import { useEffect, useState } from "react";
import { X, ArrowLeft } from "lucide-react";

export default function FeatureSheet({ isOpen, onClose, title, children, showBack = false, onBack = null }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`fixed inset-0 z-50 flex flex-col justify-end transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} aria-hidden={!isOpen}>
      <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${isOpen ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
      
      <section 
        className={`relative w-full max-w-2xl mx-auto bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/80 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden transition-transform duration-300 ease-in-out ${isOpen ? "translate-y-0" : "translate-y-full"}`} 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="sheet-title"
        style={{ maxHeight: "85vh" }}
      >
        <div className="w-full flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-12 h-1.5 rounded-full bg-zinc-800" />
        </div>
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60 shrink-0">
          <div className="flex items-center gap-3">
            {showBack && (
              <button 
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors" 
                type="button" 
                onClick={onBack}
                aria-label="Kembali"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-lg font-bold text-zinc-100 font-sans tracking-tight" id="sheet-title">{title}</h2>
          </div>
          <button className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors" onClick={onClose} type="button" aria-label="Tutup">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
          {children}
        </div>
      </section>
    </div>
  );
}
