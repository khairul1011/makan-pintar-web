"use client";

import { createContext, useContext, useReducer, useEffect, useCallback, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { INITIAL_STATE } from "./constants";
import { createClient } from "./supabase";
import { calculateDaysRemaining } from "./utils";

const AppContext = createContext(null);

function appReducer(state, action) {
  switch (action.type) {
    case "UPDATE_SALDO":
      return { ...state, saldoMakan: action.payload };
    case "ADD_FOOD_ENTRY":
      return {
        ...state,
        todayEntries: [...state.todayEntries, action.payload],
        todaySpent: state.todaySpent + action.payload.price,
      };
    case "REPLACE_FOOD_ENTRY":
      return {
        ...state,
        todayEntries: state.todayEntries.map((entry) => 
          entry.id === action.payload.tempId ? action.payload.dbEntry : entry
        ),
      };
    case "REMOVE_FOOD_ENTRY":
      const entryToRemove = state.todayEntries.find((e) => e.id === action.payload);
      return {
        ...state,
        todayEntries: state.todayEntries.filter((e) => e.id !== action.payload),
        todaySpent: state.todaySpent - (entryToRemove?.price || 0),
      };
    case "SET_NOTIFICATIONS":
      return {
        ...state,
        notifications: { ...state.notifications, ...action.payload },
      };
    case "UPDATE_SETTING":
      const updatedState = { ...state, [action.payload.key]: action.payload.value };
      if (action.payload.key === "tanggalKiriman") {
        updatedState.hariKeKiriman = calculateDaysRemaining(action.payload.value);
      }
      return updatedState;
    case "HYDRATE":
      return { 
        ...state, 
        ...action.payload,
        hariKeKiriman: calculateDaysRemaining(action.payload.tanggalKiriman || state.tanggalKiriman)
      };
    default:
      return state;
  }
}
const SESSION_MAX_AGE_MS  = 24 * 60 * 60 * 1000; // 24 jam
const INACTIVITY_MAX_MS   =  2 * 60 * 60 * 1000; // 2 jam
const LS_LOGIN_TIME       = "mp_login_at";
const LS_LAST_ACTIVE      = "mp_last_active";

function isSessionValid() {
  if (typeof window === "undefined") return true; // Server-side selalu valid sementara

  const loginAt    = parseInt(localStorage.getItem(LS_LOGIN_TIME) || "0");
  const lastActive = parseInt(localStorage.getItem(LS_LAST_ACTIVE) || "0");
  const now        = Date.now();

  if (!loginAt) return false;

  const exceedMaxAge    = now - loginAt    > SESSION_MAX_AGE_MS;
  const exceedInactive  = now - lastActive > INACTIVITY_MAX_MS;

  return !exceedMaxAge && !exceedInactive;
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, INITIAL_STATE);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const [supabase] = useState(() => createClient());

  const fetchWithAuth = useCallback(async (url, options = {}) => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  }, [supabase]);

  const loadData = useCallback(async () => {
    try {
      const [profileRes, statsRes, entriesRes] = await Promise.all([
        fetchWithAuth("/api/profile"),
        fetchWithAuth("/api/stats/weekly"),
        fetchWithAuth("/api/food-entries")
      ]);

      if (profileRes.ok && statsRes.ok && entriesRes.ok) {
        const { profile } = await profileRes.json();
        const stats = await statsRes.json();
        const { entries } = await entriesRes.json();

        // Format dates correctly in local timezone
        const todayStr = new Date().toLocaleDateString('en-CA');

        dispatch({
          type: "HYDRATE",
          payload: {
            avatarUrl: profile.avatar_url,
            saldoMakan: profile.saldo_makan,
            hariKeKiriman: profile.hari_ke_kiriman,
            targetCalories: profile.target_calories,
            targetProtein: profile.target_protein,
            totalKiriman: profile.total_kiriman,
            tanggalKiriman: profile.tanggal_kiriman,
            notifications: profile.notifications || INITIAL_STATE.notifications,
            todaySpent: stats.todaySpent || 0,
            weeklySpending: stats.weeklySpending || INITIAL_STATE.weeklySpending,
            weeklyCalories: stats.weeklyCalories || INITIAL_STATE.weeklyCalories,
            historyEntries: entries.map(e => ({
               id: e.id,
               rawDate: e.entry_date,
               date: new Date(e.entry_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' }),
               emoji: e.emoji,
               name: e.name,
               meal: e.meal,
               price: e.price,
               calories: e.calories
            })),
            todayEntries: entries.filter(e => e.entry_date === todayStr).map(e => ({
               id: e.id,
               emoji: e.emoji,
               name: e.name,
               meal: e.meal,
               price: e.price,
               calories: e.calories
            })),
          }
        });
      }
    } catch (error) {
      console.error("Failed to load initial data", error);
    } finally {
      setAuthLoading(false);
    }
  }, [fetchWithAuth]);

  // Check auth state
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user ?? null;
      
      if (event === "SIGNED_IN" && typeof window !== "undefined") {
        const now = Date.now().toString();
        localStorage.setItem(LS_LOGIN_TIME, now);
        localStorage.setItem(LS_LAST_ACTIVE, now);
      }

      setUser(currentUser);
      if (currentUser) {
        loadData();
      } else {
        setAuthLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, loadData]);

  // Handle session timeout and navigation
  useEffect(() => {
    if (!user || typeof window === "undefined") return;

    localStorage.setItem(LS_LAST_ACTIVE, Date.now().toString());

    if (!isSessionValid()) {
      localStorage.removeItem(LS_LOGIN_TIME);
      localStorage.removeItem(LS_LAST_ACTIVE);
      supabase.auth.signOut();
      router.replace("/login");
    }
  }, [pathname, user, supabase, router]);

  // Redirect based on auth
  useEffect(() => {
    if (authLoading) return;

    if (!user && pathname !== "/login") {
      router.replace("/login");
    } else if (user && pathname === "/login") {
      router.replace("/");
    }
  }, [user, authLoading, pathname, router]);

  const updateSaldo = useCallback(async (saldo) => {
    dispatch({ type: "UPDATE_SALDO", payload: saldo });
    try {
      await fetchWithAuth("/api/profile", {
        method: "PUT",
        body: JSON.stringify({ saldo_makan: saldo }),
      });
    } catch (err) {
      console.error(err);
    }
  }, [fetchWithAuth]);

  const addFoodEntry = useCallback(async (entry) => {
    const tempId = `temp_${Date.now()}`;

    // Optimistic UI update
    dispatch({ type: "ADD_FOOD_ENTRY", payload: {
      id: tempId,
      emoji: entry.emoji,
      name: entry.name,
      meal: entry.meal,
      price: entry.price,
      calories: entry.calories || 0,
    } });

    try {
      const res = await fetchWithAuth("/api/food-entries", {
        method: "POST",
        body: JSON.stringify({
          emoji: entry.emoji,
          name: entry.name,
          meal: entry.meal,
          calories: entry.calories || 0,
          price: entry.price,
          entry_date: new Date().toLocaleDateString('en-CA')
        }),
      });
      if (res.ok) {
        const { entry: dbEntry } = await res.json();
        dispatch({ type: "REPLACE_FOOD_ENTRY", payload: { tempId, dbEntry } });

        // Poll sekali setelah 6 detik untuk mengambil estimasi kalori dari AI
        // (AI di-update di background oleh server, kita perlu refresh entry-nya)
        setTimeout(async () => {
          try {
            const pollRes = await fetchWithAuth(`/api/food-entries?date=${new Date().toLocaleDateString('en-CA')}`);
            if (pollRes.ok) {
              const { entries } = await pollRes.json();
              const updatedEntry = entries?.find((e) => e.id === dbEntry.id);
              if (updatedEntry && updatedEntry.calories > 0) {
                dispatch({ type: "REPLACE_FOOD_ENTRY", payload: { tempId: dbEntry.id, dbEntry: updatedEntry } });
              }
            }
          } catch (err) {
            // Tidak apa-apa jika poll gagal, data tetap tampil
          }
        }, 6000);
      } else {
        // Rollback
        dispatch({ type: "REMOVE_FOOD_ENTRY", payload: tempId });
      }
    } catch (err) {
      console.error(err);
      dispatch({ type: "REMOVE_FOOD_ENTRY", payload: tempId });
    }
  }, [fetchWithAuth]);

  const updateSetting = useCallback(async (key, value) => {
    dispatch({ type: "UPDATE_SETTING", payload: { key, value } });
    
    const snakeMap = {
      avatarUrl: "avatar_url",
      saldoMakan: "saldo_makan",
      hariKeKiriman: "hari_ke_kiriman",
      targetCalories: "target_calories",
      targetProtein: "target_protein",
      totalKiriman: "total_kiriman",
      tanggalKiriman: "tanggal_kiriman"
    };
    
    const dbKey = snakeMap[key];
    if (dbKey) {
      try {
        await fetchWithAuth("/api/profile", {
          method: "PUT",
          body: JSON.stringify({ [dbKey]: value }),
        });
      } catch (err) {
        console.error(err);
      }
    }
  }, [fetchWithAuth]);

  const toggleNotification = useCallback(async (key) => {
    const newStatus = !state.notifications[key];
    dispatch({
      type: "SET_NOTIFICATIONS",
      payload: { [key]: newStatus },
    });
    
    try {
      await fetchWithAuth("/api/profile", {
        method: "PUT",
        body: JSON.stringify({ notifications: { ...state.notifications, [key]: newStatus } }),
      });
    } catch (err) {
      console.error(err);
    }
  }, [state.notifications, fetchWithAuth]);

  const signOut = useCallback(async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(LS_LOGIN_TIME);
      localStorage.removeItem(LS_LAST_ACTIVE);
    }
    await supabase.auth.signOut();
    router.replace("/login");
  }, [supabase, router]);

  // Show nothing while checking auth (prevents flash)
  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.5)", fontWeight: 700 }}>⏳ Memuat...</p>
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        user,
        updateSaldo,
        addFoodEntry,
        updateSetting,
        toggleNotification,
        signOut,
        fetchWithAuth,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
