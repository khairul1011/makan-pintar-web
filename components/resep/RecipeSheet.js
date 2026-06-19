"use client";

import FeatureSheet from "../ui/FeatureSheet";

export default function RecipeSheet({ recipe, isOpen, onClose }) {
  if (!recipe) return null;

  return (
    <FeatureSheet
      isOpen={isOpen}
      onClose={onClose}
      title={recipe.name}
    >
      <ol className="step-list">
        {recipe.steps.map(([text, time], index) => (
          <li key={index} className="step-row">
            <span className="step-number">{index + 1}</span>
            <span>{text}</span>
            <span className="step-time">{time}</span>
          </li>
        ))}
      </ol>
    </FeatureSheet>
  );
}
