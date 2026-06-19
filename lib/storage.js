const STORAGE_KEY = "makan-pintar-state";

export function loadState() {
  if (typeof window === "undefined") return null;
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;
    return JSON.parse(serialized);
  } catch {
    return null;
  }
}

export function saveState(state) {
  if (typeof window === "undefined") return;
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    // silently fail
  }
}

export function clearState() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // silently fail
  }
}
