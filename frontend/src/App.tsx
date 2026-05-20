import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function App() {
  return (
    <main className="min-h-dvh flex items-center justify-center px-6">
      <div className="max-w-xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 text-muted-foreground text-sm">
          <Sparkles className="size-4" />
          CrewPilot
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Turn an idea into a Product, Market, and Tech plan.
        </h1>
        <p className="text-muted-foreground">
          Skeleton ready. The UI will be built up from here.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button>Get started</Button>
          <Button variant="outline">Learn more</Button>
        </div>
      </div>
    </main>
  );
}
