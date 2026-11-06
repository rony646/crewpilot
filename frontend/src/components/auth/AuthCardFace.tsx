import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type AuthMode = "sign-in" | "sign-up";

interface AuthCardFaceProps {
  mode: AuthMode;
  className?: string;
  email: string;
  password: string;
  displayName: string;
  loading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onDisplayNameChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  onSwitchMode: () => void;
}

export function AuthCardFace({
  mode,
  className = "",
  email,
  password,
  displayName,
  loading,
  onEmailChange,
  onPasswordChange,
  onDisplayNameChange,
  onSubmit,
  onSwitchMode,
}: AuthCardFaceProps) {
  const isSignIn = mode === "sign-in";

  return (
    <div
      className={`bg-surface border border-border rounded-[var(--radius-lg)] p-8 auth-flip-face ${className}`.trim()}
    >
      <div className="text-center mb-8">
        <h1 className="text-2xl font-medium tracking-tight mb-2">
          {isSignIn ? "Welcome back" : "Create an account"}
        </h1>
        <p className="text-muted-foreground text-sm">
          {isSignIn
            ? "Sign in to continue building your plans"
            : "Sign up to save and revisit your plans"}
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {!isSignIn && (
          <div className="space-y-2">
            <label htmlFor={`${mode}-display-name`} className="text-sm font-medium text-foreground">
              Display name
            </label>
            <Input
              id={`${mode}-display-name`}
              type="text"
              autoComplete="nickname"
              placeholder="Alex Johnson"
              value={displayName}
              onChange={(e) => onDisplayNameChange(e.target.value)}
              required
              minLength={2}
              maxLength={50}
              disabled={loading}
            />
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor={`${mode}-email`} className="text-sm font-medium text-foreground">
            Email
          </label>
          <Input
            id={`${mode}-email`}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor={`${mode}-password`} className="text-sm font-medium text-foreground">
            Password
          </label>
          <Input
            id={`${mode}-password`}
            type="password"
            autoComplete={isSignIn ? "current-password" : "new-password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            required
            minLength={6}
            disabled={loading}
          />
          {isSignIn && (
            <Button variant="link" size="sm" className="px-0">
              <Link to="/forgot-password">Forgot your password?</Link>
            </Button>
          )}
        </div>

        <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={loading}>
          {loading
            ? isSignIn
              ? "Signing in…"
              : "Creating account…"
            : isSignIn
              ? "Sign in"
              : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {isSignIn ? (
          <>
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={onSwitchMode}
              className="text-accent hover:text-primary-hover transition-colors font-medium cursor-pointer"
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchMode}
              className="text-accent hover:text-primary-hover transition-colors font-medium cursor-pointer"
            >
              Sign in
            </button>
          </>
        )}
      </p>
    </div>
  );
}
