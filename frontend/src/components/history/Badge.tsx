import { ReactNode } from "react";

interface BadgeProps {
  variant: "queued" | "running" | "done" | "error";
  children: ReactNode;
  pulse?: boolean;
}

export function Badge({ variant, children, pulse = false }: BadgeProps) {
  const variants = {
    queued: "bg-queued/10 text-queued border-queued/20",
    running: "bg-running/10 text-running border-running/20",
    done: "bg-success/10 text-success border-success/20",
    error: "bg-error/10 text-error border-error/20",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs font-medium ${variants[variant]}`}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${variant === "running" ? "bg-running" : ""}`}
          ></span>
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${variant === "running" ? "bg-running" : ""}`}
          ></span>
        </span>
      )}
      {children}
    </span>
  );
}
