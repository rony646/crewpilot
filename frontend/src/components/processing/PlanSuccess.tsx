interface PlanSuccessProps {
  message?: string;
}

export function PlanSuccess({ message }: PlanSuccessProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 rounded-lg border border-border bg-surface/50 py-16 text-center">
      <svg
        viewBox="0 0 120 120"
        className="animate-error-pop h-28 w-28 text-success"
        fill="none"
        stroke="currentColor"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="60" cy="60" r="54" pathLength={1} className="animate-error-circle" />
        <path
          d="M 38 62 L 52 76 L 82 44"
          pathLength={1}
          className="animate-error-line"
          style={{ animationDelay: "0.45s" }}
        />
      </svg>

      <div className="space-y-1">
        <h2 className="text-lg font-medium text-foreground">Analysis complete</h2>
        <p className="max-w-md text-sm text-muted-foreground">
          {message ?? "Your product, market, and tech plan is ready."}
        </p>
      </div>
    </div>
  );
}
