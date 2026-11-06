import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DisplayNameSetupCardProps {
  displayName: string;
  loading: boolean;
  onDisplayNameChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
}

export function DisplayNameSetupCard({
  displayName,
  loading,
  onDisplayNameChange,
  onSubmit,
}: DisplayNameSetupCardProps) {
  return (
    <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-medium tracking-tight mb-2">Choose a display name</h1>
        <p className="text-muted-foreground text-sm">
          This is required before you can use CrewPilot.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="setup-display-name" className="text-sm font-medium text-foreground">
            Display name
          </label>
          <Input
            id="setup-display-name"
            type="text"
            autoComplete="nickname"
            placeholder="Alex Johnson"
            value={displayName}
            onChange={(e) => onDisplayNameChange(e.target.value)}
            required
            minLength={2}
            maxLength={50}
            disabled={loading}
            autoFocus
          />
        </div>

        <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={loading}>
          {loading ? "Saving…" : "Continue"}
        </Button>
      </form>
    </div>
  );
}
