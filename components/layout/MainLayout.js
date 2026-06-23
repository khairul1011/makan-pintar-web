"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  History as HistoryIcon, 
  ChefHat, 
  User, 
  Coins, 
  Scale, 
  Send, 
  Bot, 
  Bell, 
  Settings, 
  Menu, 
  X, 
  UtensilsCrossed, 
  Camera,
  Flame,
  Wallet
} from "lucide-react";
import { useApp } from "@/lib/store";

export default function MainLayout({ children }) {
  const router = useRouter();
  const activePath = usePathname();
  const { state, addChatMessage, setAiTyping } = useApp();
  
  const [inputText, setInputText] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isBotDrawerOpen, setIsBotDrawerOpen] = useState(true);
  const chatEndRef = useRef(null);

  const { chatMessages, isAiTyping } = state;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isAiTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    handleSendMessage(inputText);
    setInputText("");
  };

  const handleSendMessage = async (text) => {
    const userMsg = {
      id: "um-" + Math.random(),
      sender: "user",
      text,
      createdAt: new Date().toISOString()
    };
    addChatMessage(userMsg);
    setAiTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: text,
          userProfile: {
            saldoMakan: state.saldoMakan,
            hariKeKiriman: state.hariKeKiriman,
            budgetHarian: state.budgetHarian,
            targetCalories: state.targetCalories,
            targetProtein: state.targetProtein,
            todaySpent: state.todaySpent
          }
        })
      });

      if (!response.ok) throw new Error("API call failed");

      const data = await response.json();
      const aiMsg = {
        id: "am-" + Math.random(),
        sender: "ai",
        text: data.reply,
        createdAt: new Date().toISOString()
      };
      addChatMessage(aiMsg);
    } catch (err) {
      setTimeout(() => {
        let replyText = "Asisten AI saat ini sedang offline. Tapi coba kamu ke menu Resep Hemat buat inspirasi makanan murah!";
        if (text.toLowerCase().includes("rekomendasi")) {
           replyText = "Buat budget segitu, saranku beli Gado-Gado atau Nasi Oreg Tempe + Telur Ceplok di warteg terdekat!";
        }
        const aiMsg = {
          id: "am-" + Math.random(),
          sender: "ai",
          text: replyText,
          createdAt: new Date().toISOString()
        };
        addChatMessage(aiMsg);
      }, 1000);
    }
    setAiTyping(false);
  };

  const handleQuickAiAsk = (text) => {
    handleSendMessage(text);
  };

  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Riwayat", path: "/riwayat", icon: HistoryIcon },
    { name: "Resep Hemat", path: "/resep", icon: ChefHat },
    { name: "Profil & Target", path: "/profil", icon: User },
  ];

  return (
    <div id="makan-pintar-app" className="flex h-screen w-full bg-[#09090B] text-zinc-100 font-sans overflow-hidden select-none">
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay z-0 bg-repeat" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
      
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-500/5 via-zinc-500/5 to-purple-500/5 blur-[120px] opacity-40 pointer-events-none rounded-full z-0 animate-pulse" />

      {/* DESKTOP SIDEBAR */}
      <nav id="desktop-sidebar" className="hidden lg:flex flex-col w-[240px] h-full bg-[#09090B] border-r border-zinc-800/60 py-6 z-30 relative select-none shrink-0">
        <div className="px-6 mb-6 flex flex-col items-center">
          <div className="w-[72px] h-[72px] rounded-full bg-zinc-800 overflow-hidden mb-3 border border-zinc-700/50 shadow-lg relative group">
            <div className="w-full h-full bg-emerald-800 flex items-center justify-center font-headline text-3xl">MK</div>
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h1 className="font-headline font-semibold text-xl tracking-tight text-zinc-100 text-center mb-0.5 leading-none">
            Makan Pintar
          </h1>
          <p className="text-xs text-zinc-500 font-medium tracking-wide text-center uppercase leading-tight font-sans">
            Komposisi Saku Digital
          </p>
        </div>

        <div className="px-5 mb-5">
          <div className="w-full rounded-xl bg-zinc-900/55 border border-zinc-800/60 p-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
              <span className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-zinc-400 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span>
              </span>
              Mode Hemat
            </span>
            <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full font-bold border border-zinc-700/50 uppercase">
              Mantap
            </span>
          </div>
        </div>

        <div className="px-5 mb-6">
          <button 
            onClick={() => router.push("/profil")}
            className="w-full bg-zinc-100 hover:bg-white text-zinc-950 font-bold rounded-xl py-3 px-4 shadow-xl transition-all flex items-center justify-center gap-2 transform active:scale-[0.98] cursor-pointer"
          >
            <Wallet className="w-4 h-4" />
            <span>Update Target</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-1.5">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isSelected = activePath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  router.push(item.path);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 font-medium cursor-pointer ${
                  isSelected 
                    ? "text-zinc-100 bg-zinc-900 border-l-[3.5px] border-zinc-100 pl-3.5 shadow-inner font-semibold" 
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/40 hover:translate-x-1"
                }`}
              >
                <IconComponent className={`w-5 h-5 ${isSelected ? "text-zinc-100" : "text-zinc-500"}`} />
                <span className="text-sm font-sans tracking-wide">{item.name}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-auto px-4 pt-4 border-t border-zinc-800/60 flex items-center justify-between text-zinc-500 text-xs">
          <span className="font-mono text-[10px]">V1.4.2 Premium</span>
          <button onClick={() => router.push("/profil")} className="hover:text-zinc-100 transition-colors p-1 cursor-pointer">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* MIDDLE CONTAINER */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0">
        <header id="app-top-nav" className="flex items-center justify-between w-full px-6 lg:px-8 py-4 bg-[#09090B]/70 backdrop-blur-xl border-b border-zinc-800/50 sticky top-0 z-20 h-18 select-none shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex flex-col">
              <span className="text-xs text-zinc-500 font-sans tracking-widest uppercase">Halo, Anak Kos!</span>
              <span className="text-sm font-semibold text-zinc-300 font-mono">
                {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleQuickAiAsk("Analisis foto makanan dari dompetku!")}
              className="hidden sm:flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 text-zinc-200 font-bold rounded-xl px-5 py-2.5 text-xs transition-all tracking-wider uppercase active:scale-[0.98] shadow-sm cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              Foto Makanan
            </button>

            <button className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/65 hover:bg-zinc-800/40 text-zinc-300 hover:text-zinc-100 relative transition-colors cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-zinc-400 animate-pulse"></span>
            </button>

            <div className="lg:hidden w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center font-headline text-sm overflow-hidden border border-zinc-700/50">
               MK
            </div>
          </div>
        </header>

        <main className="flex-grow overflow-y-auto px-4 md:px-8 py-6 pb-24 lg:pb-8 relative">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* RIGHT SIDEBAR ASISTEN AI (DESKTOP) */}
      <aside 
        id="desktop-ai-assistant"
        className={`hidden xl:flex flex-col w-[380px] h-full border-l border-zinc-800/80 bg-zinc-950/90 backdrop-blur-2xl shadow-2xl z-20 relative shrink-0 transition-all duration-300 ${
          isBotDrawerOpen ? "translate-x-0" : "translate-x-full w-0 hidden"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-zinc-800/40 bg-zinc-950/55 select-none shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-zinc-900/60 flex items-center justify-center border border-zinc-800">
              <Bot className="w-6 h-6 text-zinc-100" />
            </div>
            <div>
              <h2 className="text-zinc-100 font-bold font-sans text-sm uppercase tracking-wider flex items-center gap-1.5">
                Asisten Pintar
                <span className="inline-block text-[9px] bg-zinc-800 text-zinc-300 border border-zinc-700 tracking-normal normal-case font-bold px-1.5 py-0.2 rounded">Gemini AI</span>
              </h2>
              <p className="text-xs text-zinc-500 font-medium">Tanya tips masak / budget makanan</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {chatMessages.map((msg) => (
            <div key={msg.id} className={`flex flex-col max-w-[85%] ${msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"}`}>
              <div className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                msg.sender === "user" ? "bg-zinc-100 text-zinc-950 font-medium rounded-tr-none" : "bg-zinc-900/80 border border-zinc-800/80 rounded-tl-none text-zinc-100"
              }`}>
                {msg.text.split("\n").map((line, idx) => (
                  <p key={idx} className={idx > 0 ? "mt-1.5" : ""}>{line}</p>
                ))}
              </div>
              <span className="text-[10px] text-zinc-500 mt-1 px-1 font-mono">
                {new Date(msg.createdAt).toLocaleTimeString("id", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))}

          {isAiTyping && (
            <div className="mr-auto items-start max-w-[85%]">
              <div className="p-4 bg-zinc-900/80 border border-zinc-800/80 rounded-2xl rounded-tl-none text-sm text-zinc-300 flex items-center gap-2">
                <span className="p-1 rounded-full bg-zinc-800 text-zinc-300 animate-pulse">
                  <Bot className="w-4 h-4 animate-spin-slow" />
                </span>
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="h-1.5 w-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="h-1.5 w-1.5 bg-zinc-300 rounded-full animate-bounce"></span>
                </span>
                <span className="text-xs text-zinc-500 italic">Makan Pintar berpikir...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="px-5 py-3 border-t border-zinc-800/40 bg-zinc-950/50 shrink-0">
          <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-2">Ide Obrolan:</p>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            <button onClick={() => handleQuickAiAsk("Ada telur 2 biji sama nasi sisa kemarin. Bisa bikin apa?")} className="text-[11px] bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800/60 px-2.5 py-1.5 rounded-lg text-left transition-all cursor-pointer">🍳 Ada telur & nasi sisa</button>
            <button onClick={() => handleQuickAiAsk("Rekomendasi makan sehat budget Rp 15.000")} className="text-[11px] bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800/60 px-2.5 py-1.5 rounded-lg text-left transition-all cursor-pointer">💰 Makan sehat Rp 15k</button>
          </div>
        </div>

        <div className="p-4 border-t border-zinc-800/60 bg-zinc-950 shrink-0">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Tanya gizimu atau bahan masakan..." className="w-full bg-zinc-900/60 border border-zinc-800 rounded-2xl pl-4 pr-12 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400 transition-colors"/>
            <button type="submit" className="absolute right-1.5 p-2 rounded-xl text-zinc-400 hover:text-zinc-100 flex items-center justify-center transition-colors hover:bg-zinc-800 cursor-pointer">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </aside>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div id="mobile-sidebar-drawer" className="lg:hidden fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex">
          <div className="w-[280px] bg-zinc-950 h-full p-6 flex flex-col border-r border-zinc-800 relative">
            <button onClick={() => setMobileMenuOpen(false)} className="absolute top-5 right-5 p-1 rounded-lg hover:bg-zinc-900 text-zinc-350 cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5 mb-8 pb-4 border-b border-zinc-900">
              <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
                <UtensilsCrossed className="w-5 h-5 text-zinc-300" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-zinc-100 leading-tight">Makan Pintar</h3>
                <p className="text-[11px] text-zinc-500 font-mono">Komposisi Saku Digital</p>
              </div>
            </div>

            <div className="space-y-1.5 overflow-y-auto flex-1">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const isSelected = activePath === item.path;
                return (
                  <button key={item.path} onClick={() => { router.push(item.path); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all cursor-pointer ${isSelected ? "text-zinc-100 bg-zinc-900 border-l-4 border-zinc-100 pl-3" : "text-zinc-450 hover:text-zinc-100"}`}>
                    <IconComponent className="w-5 h-5" />
                    <span className="text-sm">{item.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-auto text-center text-[10px] text-zinc-650 font-mono">
              Premium Student Edition
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* MOBILE BOTTOM NAV */}
      <footer id="app-mobile-nav" className="lg:hidden fixed bottom-5 left-4 right-4 h-16 bg-zinc-950/90 backdrop-blur-xl border border-zinc-800/85 rounded-2xl z-40 flex items-center justify-around px-2 shadow-2xl select-none">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button key={item.path} onClick={() => router.push(item.path)} className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer ${activePath === item.path ? "text-zinc-100 font-semibold" : "text-zinc-450"}`}>
              <IconComponent className="w-5 h-5" />
              <span className="text-[9px] mt-0.5 uppercase tracking-wider font-medium">{item.name.split(" ")[0]}</span>
            </button>
          )
        })}
      </footer>
    </div>
  );
}
