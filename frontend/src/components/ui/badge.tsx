import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary/20 text-primary",
        secondary: "bg-surface text-muted-foreground border border-border",
        success: "bg-success/20 text-success",
        warning: "bg-warning/20 text-warning",
        error: "bg-error/20 text-error",
        info: "bg-info/20 text-info",
        running: "bg-primary/20 text-primary",
        queued: "bg-surface text-muted border border-border",
        idle: "bg-surface text-muted border border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
