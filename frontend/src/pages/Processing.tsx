import { AgentStepper } from "@/components/processing/AgentStepper";
import { PlanError } from "@/components/processing/PlanError";
import { PlanSuccess } from "@/components/processing/PlanSuccess";
import { Button } from "@/components/ui/button";

import { createPlan } from "@/lib/api/plan";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

export function Processing() {
  const navigate = useNavigate();
  const { idea } = (useLocation().state as { idea?: string }) ?? {};

  const { isError, isSuccess, error, refetch } = useQuery({
    queryKey: ["plan", idea],
    queryFn: ({ signal }) => createPlan({ idea: idea as string }, signal),
    enabled: !!idea,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  if (!idea) {
    return <Navigate to="/" replace />;
  }

  const handleCancel = () => {
    navigate("/");
  };

  const handleRetry = () => {
    refetch();
  };

  const statusMessage = isError
    ? "Analysis failed"
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
          {isError ? (
            <PlanError message={error?.message} onRetry={handleRetry} />
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
