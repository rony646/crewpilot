import { useMemo, useState } from "react";

import { Link, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { usePlanStore } from "@/store/planStore";
import { Card } from "@/components/history/Card";
import { Badge } from "@/components/history/Badge";
import { Button } from "@/components/ui/button";

export function History() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const plansMap = usePlanStore((state) => state.plans);
  const loading = usePlanStore((state) => state.loading);
  const hydrated = usePlanStore((state) => state.hydrated);
  const error = usePlanStore((state) => state.error);

  const plans = useMemo(
    () =>
      Object.values(plansMap).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [plansMap]
  );

  const filteredPlans = plans.filter((plan) =>
    plan.idea.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAnalysisClick = (planId: string) => {
    navigate(`/results/${planId}`);
  };

  const formatTimestamp = (iso: string) => {
    const date = new Date(iso);
    const now = new Date();
    const isToday =
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();
    if (isToday) {
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return "just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      return `${diffHours}h ago`;
    }
    return `${date.toLocaleDateString()} · ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-medium mb-2">History</h1>
          <p className="text-text-secondary">View and manage your previous analyses</p>
        </div>

        {plans.length > 0 && (
          <div className="mb-6 flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <Input
                placeholder="Search analyses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}

        {error && (
          <p className="mb-6 text-sm text-error">{error}</p>
        )}

        {loading || !hydrated ? (
          <p className="text-text-secondary">Loading your history…</p>
        ) : filteredPlans.length > 0 ? (
          <div className="space-y-3 ">
            {filteredPlans.map((plan) => (
              <Card
                key={plan.id}
                hoverable
                onClick={() => handleAnalysisClick(plan.id)}
                className="group"
              >
                <div className="flex items-start justify-between gap-4 ">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium mb-2 truncate group-hover:text-accent transition-colors">
                      {plan.idea}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-text-muted">
                      <span>{formatTimestamp(plan.createdAt)}</span>
                    </div>
                  </div>
                  <div className="self-stretch ">
                    <div className="flex items-center gap-3 flex-shrink-0 h-full ">
                      <span className="text-xs px-3 py-1 rounded-full bg-surface border border-border text-text-secondary">
                        Full Plan
                      </span>
                      <Badge variant="done">Completed</Badge>

                      <svg
                        className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-24 h-24 rounded-full bg-surface border border-border flex items-center justify-center mb-6">
              <svg
                className="w-12 h-12 text-text-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-medium mb-2">No analyses yet</h2>
            <p className="text-text-secondary mb-8 text-center max-w-md">
              {searchQuery
                ? "No analyses match your filters. Try adjusting your search or filter criteria."
                : "Start by creating your first plan. Transform your ideas into actionable plans with AI agents."}
            </p>
            <Link to="/">
              <Button variant="default">
                <Plus className="w-4 h-4" />
                New Analysis
              </Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
