import { cn } from "@/lib/utils";

const examples = [
  "AI-powered code review tool for teams",
  "Subscription box for sustainable products",
  "Mobile app for language learning with AI tutors",
];

interface ExampleChipsProps {
  onSelect: (example: string) => void;
  className?: string;
}

export function ExampleChips({ onSelect, className }: ExampleChipsProps) {
  return (
    <div className={cn("flex flex-wrap justify-center gap-2", className)}>
      <span className="text-sm text-muted-foreground mr-2">Try:</span>
      {examples.map((example) => (
        <button
          key={example}
          onClick={() => onSelect(example)}
          className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-border-strong hover:bg-elevated hover:text-foreground"
        >
          {example}
        </button>
      ))}
    </div>
  );
}
