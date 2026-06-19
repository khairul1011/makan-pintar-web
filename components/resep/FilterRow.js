"use client";

export default function FilterRow({ activeFilter, setActiveFilter }) {
  const filters = [
    "Semua",
    "< Rp 10rb",
    "< Rp 20rb",
    "< Rp 30rb",
    "Telur",
    "Nasi",
    "Indomie"
  ];

  return (
    <div className="filter-row" aria-label="Filter resep">
      {filters.map((filter) => (
        <button
          key={filter}
          className={`filter-pill ${activeFilter === filter ? "active" : ""}`}
          type="button"
          onClick={() => setActiveFilter(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
