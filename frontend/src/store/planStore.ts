import { create } from "zustand";

import { fetchPlansForCurrentUser, insertPlanForCurrentUser } from "@/lib/plans";
import type { PlanResponse, StoredPlan } from "@/types";

function toPlanMap(plans: StoredPlan[]): Record<string, StoredPlan> {
  return Object.fromEntries(plans.map((plan) => [plan.id, plan]));
}

interface PlanState {
  plans: Record<string, StoredPlan>;
  loading: boolean;
  hydrated: boolean;
  error: string | null;
  hydrate: () => Promise<void>;
  addPlan: (input: { idea: string; results: PlanResponse }) => Promise<StoredPlan>;
  clearPlans: () => void;
}

export const usePlanStore = create<PlanState>((set) => ({
  plans: {},
  loading: false,
  hydrated: false,
  error: null,

  hydrate: async () => {
    set({ loading: true, error: null });

    try {
      const plans = await fetchPlansForCurrentUser();
      set({ plans: toPlanMap(plans), loading: false, hydrated: true });
    } catch (err) {
      set({
        plans: {},
        loading: false,
        hydrated: true,
        error: err instanceof Error ? err.message : "Failed to load plans.",
      });
    }
  },

  addPlan: async ({ idea, results }) => {
    const stored = await insertPlanForCurrentUser(idea, results);
    set((state) => ({ plans: { ...state.plans, [stored.id]: stored } }));
    return stored;
  },

  clearPlans: () => {
    set({ plans: {}, loading: false, hydrated: false, error: null });
  },
}));
