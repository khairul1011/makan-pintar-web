"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import BottomNav from "@/components/layout/BottomNav";
import GlassCard from "@/components/ui/GlassCard";
import FilterRow from "@/components/resep/FilterRow";
import RecipeCard from "@/components/resep/RecipeCard";
import RecipeSheet from "@/components/resep/RecipeSheet";
import { useApp } from "@/lib/store";
import { formatRupiah, getDailyBudget } from "@/lib/utils";

export default function ResepPage() {
  const { state, fetchWithAuth } = useApp();
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const budgetHarian = getDailyBudget(state.saldoMakan, state.hariKeKiriman);

  useEffect(() => {
    const fetchRecipes = async () => {
      // Cek cache dulu
      const CACHE_KEY = `mp_recipes_cache_${budgetHarian}`;
      const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 jam
      
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_EXPIRY) {
            setRecipes(data);
            setIsLoading(false);
            return;
          }
        } catch(e) {
          // ignore cache error
        }
      }

      // Kalau tidak ada cache atau expired, ambil dari AI
      try {
        const res = await fetchWithAuth(`/api/recipes/generate?budget=${budgetHarian}`);
        if (res.ok) {
          const json = await res.json();
          setRecipes(json.recipes);
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
  }, [budgetHarian]);

  // Ekstrak tag dinamis dari resep-resep AI
  const dynamicTags = Array.from(new Set(recipes.flatMap(r => r.tags))).map(tag => {
    return tag.charAt(0).toUpperCase() + tag.slice(1);
  });

  // Filter logic
  const filteredRecipes = recipes.filter((recipe) => {
    if (activeFilter === "Semua") return true;
    if (activeFilter === "< Rp 10rb") return recipe.price < 10000;
    if (activeFilter === "< Rp 20rb") return recipe.price < 20000;
    if (activeFilter === "< Rp 30rb") return recipe.price < 30000;
    
    // Tag matching (case insensitive)
    const filterTag = activeFilter.toLowerCase();
    return recipe.tags.some(tag => tag.toLowerCase() === filterTag);
  });

  return (
    <>
      <AppShell>
        <main className="app-page active">
          <header className="page-header">
            <div>
              <h2 className="page-title">Resep Survival</h2>
              <span className="page-subtitle">AI generate based on your budget</span>
            </div>
          </header>

          <GlassCard className="card-pad recipe-context">
            <p>Budget kamu <strong>{formatRupiah(budgetHarian)}/hari</strong> — ini resep yang cocok:</p>
          </GlassCard>

          <FilterRow 
            activeFilter={activeFilter} 
            setActiveFilter={setActiveFilter} 
            dynamicTags={dynamicTags} 
          />

          <section className="recipe-list" aria-label="Daftar resep survival">
            {isLoading ? (
              <>
                <div className="skeleton-card" style={{ height: "140px", borderRadius: "18px", background: "rgba(255,255,255,0.06)", animation: "pulse 1.5s infinite" }} />
                <div className="skeleton-card" style={{ height: "140px", borderRadius: "18px", background: "rgba(255,255,255,0.06)", animation: "pulse 1.5s infinite", animationDelay: "0.2s" }} />
                <div className="skeleton-card" style={{ height: "140px", borderRadius: "18px", background: "rgba(255,255,255,0.06)", animation: "pulse 1.5s infinite", animationDelay: "0.4s" }} />
              </>
            ) : (
              <>
                {filteredRecipes.map((recipe, idx) => (
                  <RecipeCard 
                    key={idx} 
                    recipe={recipe} 
                    onSelect={setSelectedRecipe} 
                  />
                ))}
                
                {filteredRecipes.length === 0 && (
                  <div className="empty-state" style={{ display: "block" }}>
                    Belum ada resep untuk filter ini
                  </div>
                )}
              </>
            )}
          </section>
        </main>
      </AppShell>
      <BottomNav />

      <RecipeSheet 
        recipe={selectedRecipe} 
        isOpen={!!selectedRecipe} 
        onClose={() => setSelectedRecipe(null)} 
      />
    </>
  );
}
