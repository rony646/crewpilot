import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { Header } from "@/components/layout/Header";
import { usePlanStore } from "@/store/planStore";

export default function App() {
  const hydrate = usePlanStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Outlet />
    </div>
  );
}
