import { Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ExampleChips } from "@/components/landing/ExampleChips";

export default function Landing() {
  const navigate = useNavigate();

  const [idea, setIdea] = useState("");

  const handleSubmit = () => {
    if (!idea.trim()) return;
    navigate("/processing", { state: { idea: idea.trim() } });
  };

  const handleExampleSelect = (example: string) => {
    setIdea(example);
  };

  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl space-y-8 text-center">
        {/* Hero text */}
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl text-balance">
            Turn your ideas into actionable plans with AI agents
          </h1>
          <p className="text-lg text-muted-foreground">
            Get structured product, market, and technical analysis in minutes
          </p>
        </div>
        {/* Input section */}
        <div className="space-y-4 text-left">
          <Textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Describe your idea..."
            className="min-h-[160px] text-lg"
          />

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 ">
            <Button
              variant="gradient"
              size="lg"
              className="flex-1 "
              onClick={handleSubmit}
              disabled={!idea.trim()}
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Run Analysis
            </Button>
          </div>
        </div>

        <ExampleChips onSelect={handleExampleSelect} className="pt-4" />
      </div>
    </main>
  );
}
