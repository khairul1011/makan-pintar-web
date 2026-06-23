"use client";

import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Flame, Clock, DollarSign, ChevronRight, Check } from "lucide-react";
import { useApp } from "@/lib/store";
import { getDailyBudget } from "@/lib/utils";

export default function ResepPage() {
  const { state, fetchWithAuth, addFoodEntry } = useApp();
  
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const budgetHarian = getDailyBudget(state.saldoMakan, state.hariKeKiriman);

  useEffect(() => {
    if (!fetchWithAuth) return;

    const fetchRecipes = async () => {
      const CACHE_KEY = `mp_recipes_cache_${budgetHarian}`;
      const CACHE_EXPIRY = 24 * 60 * 60 * 1000;
      
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_EXPIRY) {
            setRecipes(data);
            setSelectedRecipe(data[0]);
            setIsLoading(false);
            return;
          }
        } catch(e) {}
      }

      try {
        const res = await fetchWithAuth(`/api/recipes/generate?budget=${budgetHarian}`);
        if (res.ok) {
          const json = await res.json();
          setRecipes(json.recipes);
          setSelectedRecipe(json.recipes[0]);
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: json.recipes,
            timestamp: Date.now()
          }));
        }
      } catch (err) {
        console.error("Failed to fetch AI recipes", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, [budgetHarian, fetchWithAuth]);

  const toggleIngredient = (ing) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [ing]: !prev[ing]
    }));
  };

  const handleCookIt = async (rec) => {
    await addFoodEntry({
      name: `Masak: ${rec.name}`,
      price: rec.price,
      calories: rec.calories,
      meal: "siang" // Default to siang
    });

    setToastMessage(`Sukses mencatat "${rec.name}"! Rp ${rec.price.toLocaleString("id")} & ${rec.calories} kkal ditambahkan ke log makan.`);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  return (
    <MainLayout>
      <div className="space-y-6 relative font-sans">
        {/* Dynamic Floating Toast Notification */}
        {showToast && (
          <div id="recipe-cooked-toast" className="fixed top-5 right-5 max-w-sm bg-zinc-950 border border-emerald-500/30 text-zinc-150 p-4 rounded-xl shadow-2xl z-50 animate-bounce flex items-start gap-3">
            <div className="p-1.5 rounded-full bg-emerald-500/10 text-emerald-400">
              <Check className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h5 className="text-xs font-bold uppercase text-emerald-400 tracking-wider font-sans">Berhasil Dimasak</h5>
              <p className="text-xs text-zinc-400 mt-1">{toastMessage}</p>
            </div>
          </div>
        )}

        {/* Title block */}
        <div>
          <h2 className="text-2xl font-bold text-zinc-150 flex items-center gap-2">
            🍽️ Ide Resep Hemat Anak Kos
          </h2>
          <p className="text-xs text-zinc-405 mt-1 leading-normal">
            Siapa bilang hemat gak bisa enak? Masak makananmu sendiri dari ide AI, jamin nambah sisa saldo! (Budget: Rp {budgetHarian.toLocaleString("id")})
          </p>
        </div>

        {/* Main Grid: Recipes list (left) - Detail view (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* RECIPES LIST CARDS BAR (5-columns) */}
          <div className="lg:col-span-5 space-y-3.5 animate-fade-in text-sans">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Katalog Resep</h3>
            
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {isLoading ? (
                // Skeleton Loaders
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-full flex items-center gap-3 p-4 rounded-2xl border border-zinc-800 bg-[#0C0C0E] animate-pulse">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
                      <div className="h-3 bg-zinc-800 rounded w-1/2"></div>
                    </div>
                  </div>
                ))
              ) : recipes.length === 0 ? (
                 <div className="text-center py-10 text-zinc-500 italic border border-dashed border-zinc-800 rounded-2xl">
                   Belum ada resep AI yang tersedia.
                 </div>
              ) : (
                recipes.map((rec, idx) => {
                  const isSelected = selectedRecipe?.name === rec.name;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedRecipe(rec);
                        setCheckedIngredients({});
                      }}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected 
                          ? "bg-zinc-900 border-zinc-700 shadow-md" 
                          : "bg-[#0C0C0E] border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center border border-zinc-800">
                          {rec.emoji || "🍲"}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-zinc-200">{rec.name}</h4>
                          <p className="text-[11px] text-zinc-500 mt-1 flex items-center gap-2.5">
                            <span className="text-zinc-300 font-bold">Est: Rp {rec.price.toLocaleString("id")}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5"><Flame className="w-3.5 h-3.5 text-emerald-400" /> {rec.calories} kkal</span>
                          </p>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${isSelected ? "text-zinc-300" : "text-zinc-600"}`} />
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* RECIPE DETAIL VIEW (7-columns) */}
          <div className="lg:col-span-7 bg-[#0C0C0E] border border-zinc-800/80 rounded-3xl p-6 shadow-xl space-y-5">
            {isLoading ? (
               <div className="animate-pulse space-y-6">
                 <div className="flex items-center gap-4 border-b border-zinc-900 pb-4">
                   <div className="w-14 h-14 bg-zinc-800 rounded-full"></div>
                   <div className="space-y-2 flex-1">
                     <div className="h-6 bg-zinc-800 rounded w-1/2"></div>
                     <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
                   </div>
                 </div>
                 <div className="grid grid-cols-3 gap-3">
                   <div className="h-14 bg-zinc-800 rounded-xl"></div>
                   <div className="h-14 bg-zinc-800 rounded-xl"></div>
                   <div className="h-14 bg-zinc-800 rounded-xl"></div>
                 </div>
                 <div className="space-y-2">
                   <div className="h-8 bg-zinc-800 rounded-xl w-full"></div>
                   <div className="h-8 bg-zinc-800 rounded-xl w-full"></div>
                 </div>
               </div>
            ) : selectedRecipe ? (
              <div className="space-y-5 animate-fade-in">
                {/* Header inside detail */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-900">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{selectedRecipe.emoji || "🍲"}</span>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-100">{selectedRecipe.name}</h3>
                      <p className="text-xs text-zinc-500 italic mt-0.5 leading-tight line-clamp-2">{selectedRecipe.description || "Resep lezat nan hemat."}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCookIt(selectedRecipe)}
                    className="bg-emerald-400 hover:bg-emerald-500 text-zinc-950 font-bold rounded-xl px-5 py-2.5 text-xs tracking-wider uppercase flex items-center gap-1.5 self-start sm:self-center shadow-lg transition-all transform active:scale-[0.98] cursor-pointer shrink-0"
                  >
                    <Check className="w-4 h-4" />
                    Masak & Catat
                  </button>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-800 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-zinc-300" />
                    <div>
                      <span className="block text-[9px] text-zinc-500 uppercase font-mono">Durasi</span>
                      <span className="text-xs font-bold text-zinc-300">{selectedRecipe.prepTime || "15 Min"}</span>
                    </div>
                  </div>
                  <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-800 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="block text-[9px] text-zinc-500 uppercase font-mono">Kalori</span>
                      <span className="text-xs font-bold text-zinc-300">{selectedRecipe.calories} kkal</span>
                    </div>
                  </div>
                  <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-800 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-zinc-300" />
                    <div>
                      <span className="block text-[9px] text-zinc-500 uppercase font-mono">Estimasi</span>
                      <span className="text-xs font-bold text-zinc-300">Rp {selectedRecipe.price.toLocaleString("id")}</span>
                    </div>
                  </div>
                </div>

                {/* Ingredients Lists */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Bahan-bahan (Bisa dicentang)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedRecipe.ingredients?.map((ing, idx) => {
                      const isChecked = !!checkedIngredients[ing];
                      return (
                        <button
                          key={idx}
                          onClick={() => toggleIngredient(ing)}
                          className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                            isChecked 
                              ? "bg-emerald-500/5 border-emerald-500/20 text-zinc-500 line-through" 
                              : "bg-zinc-900/30 border-zinc-800/80 text-zinc-200 hover:border-zinc-700 hover:bg-zinc-900/80"
                          }`}
                        >
                          <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all shrink-0 ${
                            isChecked ? "bg-emerald-400 border-emerald-400 text-zinc-950" : "border-zinc-700"
                          }`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="truncate">{ing}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Steps */}
                <div className="space-y-2.5 pt-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Langkah Pembuatan</h4>
                  <ol className="space-y-2.5">
                    {selectedRecipe.steps?.map((step, idx) => (
                      <li key={idx} className="flex gap-3 text-xs leading-relaxed text-zinc-400">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800 font-bold font-mono text-[10px] flex items-center justify-center mt-0.5">
                          {idx + 1}
                        </span>
                        <p>{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-zinc-600 italic">
                Pilih resep dari katalog untuk melihat tutorial masak hemat.
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
