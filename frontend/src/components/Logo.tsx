import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>

        <path
          d="M8 10L14 6L20 10"
          stroke="url(#logoGradient)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path d="M8 10L14 18" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" />
        <path d="M20 10L14 18" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" />

        <circle cx="14" cy="6" r="3" fill="url(#logoGradient)" />
        <circle cx="8" cy="10" r="3" fill="url(#logoGradient)" />
        <circle cx="20" cy="10" r="3" fill="url(#logoGradient)" />
        <circle cx="14" cy="18" r="4" fill="url(#logoGradient)" />
      </svg>
      {showText && <span className="text-lg font-semibold text-foreground">CrewPilot</span>}
    </div>
  );
}
