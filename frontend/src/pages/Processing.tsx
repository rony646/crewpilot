import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Code, Sparkles, TrendingUp } from "lucide-react";
import { useState } from "react";

interface Agent {
  id: string;
  name: string;
  icon: typeof Sparkles;
  task: string;
  status: "queued" | "running" | "done";
  elapsedTime: number;
}

export function Processing() {
  const navigate = useNavigate();

  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "product",
      name: "Product Agent",
      icon: Sparkles,
      task: "Analyzing product-market fit",
      status: "queued",
      elapsedTime: 0,
    },
    {
      id: "market",
      name: "Market Agent",
      icon: TrendingUp,
      task: "Researching market opportunities",
      status: "queued",
      elapsedTime: 0,
    },
    {
      id: "tech",
      name: "Tech Agent",
      icon: Code,
      task: "Planning technical architecture",
      status: "queued",
      elapsedTime: 0,
    },
  ]);

  const handleCancel = () => {
    navigate("/");
  };
  return (
    <main className="min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-medium mb-2">The ideia goes in here</h1>
              <p className="text-text-secondary">Running analysis...</p>
            </div>
            <Button variant="ghost" size="lg" onClick={handleCancel}>
              Cancel
            </Button>
          </div>

          <div className="relative w-full h-2 bg-surface rounded-full overflow-hidden">
            <div className="animate-pulse-bar h-full w-full bg-gradient-to-r from-primary to-accent" />
            <div className="animate-shimmer-bar absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-5 gap-8"></div>
      </div>
    </main>
  );
}
