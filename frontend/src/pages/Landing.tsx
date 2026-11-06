import { Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ExampleChips } from "@/components/landing/ExampleChips";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";

const steps = [
  {
    title: "Product",
    body: "Turns the idea into a product brief: the problem, who it is for, and what to build first.",
  },
  {
    title: "Market",
    body: "Looks at the audience, the alternatives they use today, and how the product could reach them.",
  },
  {
    title: "Tech",
    body: "Turns that brief into a technical plan: architecture, stack, and the first build steps.",
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  // const startAnalysis = useAnalysisStore((state) => state.startAnalysis);

  const [idea, setIdea] = useState("");

  const handleSubmit = () => {
    const trimmed = idea.trim();
    if (!trimmed || authLoading) return;

    if (!user) {
      navigate("/login", { state: { from: "/processing", idea: trimmed } });
      return;
    }

    // startAnalysis(trimmed, context.trim(), goal);
    navigate("/processing", { state: { idea: trimmed } });
  };

  const handleExampleSelect = (example: string) => {
    setIdea(example);
  };

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col px-4 py-16">
      <div className="w-full space-y-8 text-center">
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
            aria-label="Product idea"
            className="min-h-[160px] text-lg"
          />
          {/* 
              <button
                type="button"
                onClick={() => setShowContext(!showContext)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {showContext ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                Additional context (optional)
              </button> */}

          {/* {showContext && (
                <Textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Add any constraints, preferences, or background information..."
                  className="min-h-[100px]"
                />
              )} */}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 ">
            {/* <Select value={goal} onValueChange={(v) => setGoal(v as GoalType)}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Select goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Plan</SelectItem>
                    <SelectItem value="product">Product Only</SelectItem>
                    <SelectItem value="market">Market Only</SelectItem>
                    <SelectItem value="tech">Tech Only</SelectItem>
                  </SelectContent>
                </Select> */}

            <Button
              variant="gradient"
              size="lg"
              className="flex-1 "
              onClick={handleSubmit}
              disabled={!idea.trim() || authLoading}
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Run Analysis
            </Button>
          </div>
        </div>

        <ExampleChips onSelect={handleExampleSelect} className="pt-4" />
      </div>

      <section aria-labelledby="plan-steps" className="mt-16 w-full space-y-4 text-left">
        <div className="space-y-2 text-center">
          <h2 id="plan-steps" className="text-lg font-medium tracking-tight text-foreground">
            Product, market, and technical analysis
          </h2>
          <p className="text-sm text-muted-foreground">
            Three agents work in order. Each one uses the previous result, so the plan stays
            consistent.
          </p>
        </div>
        <ol className="grid gap-3 sm:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="rounded-[var(--radius-lg)] border border-border bg-surface p-4"
            >
              <p className="text-xs font-medium text-accent">{index + 1}</p>
              <h3 className="mt-1 text-sm font-medium text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
