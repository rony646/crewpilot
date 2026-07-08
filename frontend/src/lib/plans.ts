import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";
import type { PlanResponse, StoredPlan } from "@/types";

interface PlanDoc {
  userId: string;
  idea: string;
  product: string;
  market: string;
  tech: string;
  createdAt: { toDate: () => Date };
}

function docToStoredPlan(id: string, data: PlanDoc): StoredPlan {
  return {
    id,
    idea: data.idea,
    results: {
      product: data.product,
      market: data.market,
      tech: data.tech,
    },
    createdAt: data.createdAt.toDate().toISOString(),
  };
}

export async function fetchPlansForCurrentUser(): Promise<StoredPlan[]> {
  const user = auth.currentUser;
  if (!user) return [];

  const plansQuery = query(collection(db, "plans"), where("userId", "==", user.uid));

  const snapshot = await getDocs(plansQuery);
  const plans = snapshot.docs.map((doc) => docToStoredPlan(doc.id, doc.data() as PlanDoc));

  return plans.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function insertPlanForCurrentUser(
  idea: string,
  results: PlanResponse
): Promise<StoredPlan> {
  const user = auth.currentUser;
  if (!user) throw new Error("You must be signed in to save a plan.");

  const docRef = await addDoc(collection(db, "plans"), {
    userId: user.uid,
    idea,
    product: results.product,
    market: results.market,
    tech: results.tech,
    createdAt: serverTimestamp(),
  });

  const snapshot = await getDoc(docRef);
  const created = snapshot.data() as PlanDoc | undefined;

  if (created?.createdAt) {
    return docToStoredPlan(docRef.id, created);
  }

  return {
    id: docRef.id,
    idea,
    results,
    createdAt: new Date().toISOString(),
  };
}
