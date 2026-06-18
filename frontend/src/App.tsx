import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { Header } from "@/components/layout/Header";
import { useAuth } from "@/hooks/useAuth";
import { usePlanStore } from "@/store/planStore";

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const hydrate = usePlanStore((state) => state.hydrate);
  const clearPlans = usePlanStore((state) => state.clearPlans);

  useEffect(() => {
    if (authLoading) return;

    if (user) {
      void hydrate();
    } else {
      clearPlans();
    }
  }, [user, authLoading, hydrate, clearPlans]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Outlet />
    </div>
  );
}
