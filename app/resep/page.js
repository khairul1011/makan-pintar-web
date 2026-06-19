"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import BottomNav from "@/components/layout/BottomNav";
import GlassCard from "@/components/ui/GlassCard";
import FilterRow from "@/components/resep/FilterRow";
import RecipeCard from "@/components/resep/RecipeCard";
import RecipeSheet from "@/components/resep/RecipeSheet";
import { RECIPES } from "@/lib/constants";
import { useApp } from "@/lib/store";
import { formatRupiah, getDailyBudget } from "@/lib/utils";

export default function ResepPage() {
  const { state } = useApp();
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const budgetHarian = getDailyBudget(state.saldoMakan, state.hariKeKiriman);

  // Filter logic
  const filteredRecipes = RECIPES.filter((recipe) => {
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

          <FilterRow activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

          <section className="recipe-list" aria-label="Daftar resep survival">
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
