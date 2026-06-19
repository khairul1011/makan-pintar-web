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
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        loadData();
      } else {
        setAuthLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        loadData();
      } else {
        setAuthLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, loadData]);

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
    // Optimistic logic not fully possible without DB ID, so we wait for DB to return
    try {
      const res = await fetchWithAuth("/api/food-entries", {
        method: "POST",
        body: JSON.stringify({
          emoji: entry.emoji,
          name: entry.name,
          meal: entry.meal,
          calories: entry.calories,
          price: entry.price,
          entry_date: new Date().toLocaleDateString('en-CA')
        }),
      });
      if (res.ok) {
        const { entry: dbEntry } = await res.json();
        dispatch({ type: "ADD_FOOD_ENTRY", payload: {
           id: dbEntry.id,
           emoji: dbEntry.emoji,
           name: dbEntry.name,
           meal: dbEntry.meal,
           price: dbEntry.price,
           calories: dbEntry.calories
        } });
      }
    } catch (err) {
      console.error(err);
    }
  }, [fetchWithAuth]);

  const updateSetting = useCallback(async (key, value) => {
    dispatch({ type: "UPDATE_SETTING", payload: { key, value } });
    
    const snakeMap = {
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
