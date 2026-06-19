"use client";

import { useEffect, useState } from "react";

export default function BarChart({ data, maxValue, budgetHarian, isCalories = false }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Timeout to allow animation to run after mount
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bar-grid">
      {data.map((item, idx) => {
        const target = isCalories ? 2000 : budgetHarian;
        const ratio = Math.min((item.amount / maxValue) * 100, 100);
        
        let barClass = "bar-fill";
        if (isCalories) {
          if (item.amount > 2200) barClass += " over";
          else if (item.amount < 2000) barClass += " below";
        } else {
          if (item.amount > budgetHarian) barClass += " over";
        }

        return (
          <div key={idx} className="bar-item">
            <div className="bar-track">
              <div
                className={barClass}
                style={{ height: mounted ? `${ratio}%` : "0%" }}
              />
            </div>
            <span className="bar-label">{item.day}</span>
          </div>
        );
      })}
    </div>
  );
}
