import { ReactNode, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverable?: boolean;
}

export function Card({ children, hoverable = false, className = "", ...props }: CardProps) {
  const hoverStyles = hoverable
    ? "hover:bg-elevated hover:border-border-subtle transition-all duration-200 cursor-pointer"
    : "";

  return (
    <div
      className={`bg-surface border border-border rounded-[var(--radius-lg)] p-6 ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
