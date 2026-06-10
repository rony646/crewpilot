import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

interface PlanErrorProps {
  message?: string;
  onRetry: () => void;
}

export function PlanError({ message, onRetry }: PlanErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 rounded-lg border border-border bg-surface/50 py-16 text-center">
      <svg
        viewBox="0 0 120 120"
        className="animate-error-pop h-28 w-28 text-error"
        fill="none"
        stroke="currentColor"
        strokeWidth={6}
        strokeLinecap="round"
      >
        <circle cx="60" cy="60" r="54" pathLength={1} className="animate-error-circle" />
        <line
          x1="44"
          y1="44"
          x2="76"
          y2="76"
          pathLength={1}
          className="animate-error-line"
          style={{ animationDelay: "0.45s" }}
        />
        <line
          x1="76"
          y1="44"
          x2="44"
          y2="76"
          pathLength={1}
          className="animate-error-line"
          style={{ animationDelay: "0.65s" }}
        />
      </svg>

      <div className="space-y-1">
        <h2 className="text-lg font-medium text-foreground">Analysis failed</h2>
        <p className="max-w-md text-sm text-muted-foreground">
          {message ?? "Something went wrong while generating your plan."}
        </p>
      </div>

      <Button variant="outline" size="lg" onClick={onRetry}>
        <RotateCcw className="mr-2 h-4 w-4" />
        Retry
      </Button>
    </div>
  );
}
