import { createClient } from "./supabase";

/**
 * Fetch wrapper yang otomatis menyertakan token auth
 * Bisa dipakai di web app dan nanti di mobile app
 */
async function apiFetch(endpoint, options = {}) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `API Error: ${res.status}`);
  }

  return data;
}

// ========== PROFILE ==========

export async function fetchProfile() {
  return apiFetch("/api/profile");
}

export async function updateProfile(updates) {
  return apiFetch("/api/profile", {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

// ========== FOOD ENTRIES ==========

export async function fetchFoodEntries({ date, limit = 20, offset = 0 } = {}) {
  const params = new URLSearchParams();
  if (date) params.set("date", date);
  params.set("limit", limit.toString());
  params.set("offset", offset.toString());

  return apiFetch(`/api/food-entries?${params}`);
}

export async function fetchTodayEntries() {
  const today = new Date().toISOString().split("T")[0];
  return fetchFoodEntries({ date: today, limit: 50 });
}

export async function addFoodEntry(entry) {
  return apiFetch("/api/food-entries", {
    method: "POST",
    body: JSON.stringify(entry),
  });
}

export async function deleteFoodEntry(id) {
  return apiFetch(`/api/food-entries?id=${id}`, {
    method: "DELETE",
  });
}

// ========== STATS ==========

export async function fetchWeeklyStats() {
  return apiFetch("/api/stats/weekly");
}

// ========== RECIPES ==========

export async function fetchRecipes({ maxPrice, tag } = {}) {
  const params = new URLSearchParams();
  if (maxPrice) params.set("maxPrice", maxPrice.toString());
  if (tag) params.set("tag", tag);

  return apiFetch(`/api/recipes?${params}`);
}
