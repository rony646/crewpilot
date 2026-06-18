import { supabase } from "@/lib/supabase";
import type { PlanResponse, StoredPlan } from "@/types";

interface PlanRow {
  id: string;
  user_id: string;
  idea: string;
  product: string;
  market: string;
  tech: string;
  created_at: string;
}

function rowToStoredPlan(row: PlanRow): StoredPlan {
  return {
    id: row.id,
    idea: row.idea,
    results: {
      product: row.product,
      market: row.market,
      tech: row.tech,
    },
    createdAt: row.created_at,
  };
}

export async function fetchPlansForCurrentUser(): Promise<StoredPlan[]> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) return [];

  const { data, error } = await supabase
    .from("plans")
    .select("id, user_id, idea, product, market, tech, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as PlanRow[]).map(rowToStoredPlan);
}

export async function insertPlanForCurrentUser(
  idea: string,
  results: PlanResponse
): Promise<StoredPlan> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) throw new Error("You must be signed in to save a plan.");

  const { data, error } = await supabase
    .from("plans")
    .insert({
      user_id: user.id,
      idea,
      product: results.product,
      market: results.market,
      tech: results.tech,
    })
    .select("id, user_id, idea, product, market, tech, created_at")
    .single();

  if (error) throw error;
  return rowToStoredPlan(data as PlanRow);
}
