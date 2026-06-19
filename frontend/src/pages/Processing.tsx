import { AgentStepper } from "@/components/processing/AgentStepper";
import { PlanError } from "@/components/processing/PlanError";
import { PlanSuccess } from "@/components/processing/PlanSuccess";
import { Button } from "@/components/ui/button";

import { createPlan } from "@/lib/api/plan";
import { usePlanStore } from "@/store/planStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const REDIRECT_DELAY_MS = 1500;

export function Processing() {
  const navigate = useNavigate();
  const { idea } = (useLocation().state as { idea?: string }) ?? {};
  const addPlan = usePlanStore((state) => state.addPlan);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveAttempt, setSaveAttempt] = useState(0);

  const { data, isError, isSuccess, error, refetch } = useQuery({
    queryKey: ["plan", idea],
    queryFn: ({ signal }) => createPlan({ idea: idea as string }, signal),
    enabled: !!idea,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (!isSuccess || !data || !idea) return;

    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout>;

    void (async () => {
      try {
        setSaveError(null);
        const plan = await addPlan({ idea, results: data });
        if (cancelled) return;

        timeout = setTimeout(() => {
          navigate(`/results/${plan.id}`, { replace: true });
        }, REDIRECT_DELAY_MS);
      } catch (err) {
        if (cancelled) return;
        setSaveError(err instanceof Error ? err.message : "Failed to save plan.");
      }
    })();

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [isSuccess, data, idea, addPlan, navigate, saveAttempt]);

  if (!idea) {
    return <Navigate to="/" replace />;
  }

  const handleCancel = () => {
    navigate("/");
  };

  const handleRetry = () => {
    refetch();
  };

  const handleRetrySave = () => {
    setSaveError(null);
    setSaveAttempt((attempt) => attempt + 1);
  };

  const statusMessage = isError
    ? "Analysis failed"
    : saveError
      ? "Failed to save plan"
      : isSuccess
        ? "Analysis complete"
        : "Running analysis...";

  return (
    <main className="min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-medium mb-2">{idea.substring(0, 100)}...</h1>
              <p className="text-text-secondary">{statusMessage}</p>
            </div>
            <Button variant="ghost" size="lg" onClick={handleCancel}>
              Cancel
            </Button>
          </div>

          {!isError && !isSuccess && (
            <div className="relative w-full h-2 bg-surface rounded-full overflow-hidden">
              <div className="animate-pulse-bar h-full w-full bg-gradient-to-r from-primary to-accent" />
              <div className="animate-shimmer-bar absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-[100%_1fr]">
          {isError || saveError ? (
            <PlanError
              message={saveError ?? error?.message}
              onRetry={saveError ? handleRetrySave : handleRetry}
            />
          ) : isSuccess ? (
            <PlanSuccess />
          ) : (
            <AgentStepper />
          )}
        </div>
      </div>
    </main>
  );
}
