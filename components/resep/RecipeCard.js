"use client";

import GlassCard from "../ui/GlassCard";

export default function RecipeCard({ recipe, onSelect }) {
  return (
    <GlassCard className="recipe-card">
      <div className="recipe-emoji" aria-hidden="true">{recipe.emoji}</div>
      <div>
        <h3 className="recipe-name">{recipe.name}</h3>
        <div className="recipe-meta">{recipe.meta}</div>
        <div className="ingredient-chips">
          {recipe.ingredients.map((item, idx) => (
            <span key={idx} className="chip">{item}</span>
          ))}
        </div>
      </div>
      <span className="ai-badge">✨ AI Generated</span>
      <button 
        className="recipe-action" 
        type="button" 
        onClick={() => onSelect(recipe)}
      >
        Lihat Cara Masak
      </button>
    </GlassCard>
  );
}
