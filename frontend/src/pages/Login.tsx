import { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { displayNameMetadata, getDisplayName, validateDisplayName } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

type AuthMode = "sign-in" | "sign-up";

interface AuthCardFaceProps {
  mode: AuthMode;
  className?: string;
  email: string;
  password: string;
  displayName: string;
  loading: boolean;
  error: string | null;
  message: string | null;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onDisplayNameChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  onSwitchMode: () => void;
}

function AuthCardFace({
  mode,
  className = "",
  email,
  password,
  displayName,
  loading,
  error,
  message,
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
        </div>

        {error && (
          <p className="text-sm text-error" role="alert">
            {error}
          </p>
        )}

        {message && (
          <p className="text-sm text-success" role="status">
            {message}
          </p>
        )}

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

function DisplayNameSetupCard({
  displayName,
  loading,
  error,
  onDisplayNameChange,
  onSubmit,
}: {
  displayName: string;
  loading: boolean;
  error: string | null;
  onDisplayNameChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
}) {
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

        {error && (
          <p className="text-sm text-error" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={loading}>
          {loading ? "Saving…" : "Continue"}
        </Button>
      </form>
    </div>
  );
}

export function Login() {
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [needsDisplayName, setNeedsDisplayName] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const redirectAfterAuth = () => {
    const from = (location.state as { from?: string } | null)?.from;
    navigate(from && from !== "/login" ? from : "/", { replace: true });
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setMouse({
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    });
  };

  const handlePointerLeave = () => {
    setMouse({ x: 0.5, y: 0.5 });
  };

  const offset = (strength: number) => ({
    x: (mouse.x - 0.5) * strength,
    y: (mouse.y - 0.5) * strength,
  });

  const primary = offset(280);
  const accent = offset(-180);
  const cursor = offset(120);

  const switchMode = () => {
    setMode((current) => (current === "sign-in" ? "sign-up" : "sign-in"));
    setError(null);
    setMessage(null);
  };

  const requireDisplayNameOrContinue = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!getDisplayName(user)) {
      setNeedsDisplayName(true);
      return;
    }

    redirectAfterAuth();
  };

  const handleCompleteDisplayName = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const validationError = validateDisplayName(displayName);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: displayNameMetadata(displayName),
      });
      if (updateError) throw updateError;

      setNeedsDisplayName(false);
      redirectAfterAuth();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (mode === "sign-in") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        await requireDisplayNameOrContinue();
        return;
      }

      const validationError = validateDisplayName(displayName);
      if (validationError) {
        setError(validationError);
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: displayNameMetadata(displayName),
        },
      });
      if (signUpError) throw signUpError;

      if (data.session) {
        await requireDisplayNameOrContinue();
        return;
      }

      setMessage("Check your email to confirm your account, then sign in.");
      setMode("sign-in");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const faceProps = {
    email,
    password,
    displayName,
    loading,
    error,
    message,
    onEmailChange: setEmail,
    onPasswordChange: setPassword,
    onDisplayNameChange: setDisplayName,
    onSubmit: handleSubmit,
    onSwitchMode: switchMode,
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="min-h-[calc(100vh-3.5rem)] bg-background flex items-center justify-center px-4 relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 left-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl transition-transform duration-500 ease-out will-change-transform"
          style={{
            transform: `translate(calc(-50% + ${primary.x}px), calc(-50% + ${primary.y}px))`,
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl transition-transform duration-700 ease-out will-change-transform"
          style={{ transform: `translate(${accent.x}px, ${accent.y}px)` }}
        />
        <div
          className="absolute w-64 h-64 rounded-full blur-3xl transition-transform duration-300 ease-out will-change-transform"
          style={{
            left: `${mouse.x * 100}%`,
            top: `${mouse.y * 100}%`,
            transform: `translate(calc(-50% + ${cursor.x}px), calc(-50% + ${cursor.y}px))`,
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--color-primary) 18%, transparent) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="inline-flex mb-6">
            <Logo />
          </div>
        </div>

        {needsDisplayName ? (
          <DisplayNameSetupCard
            displayName={displayName}
            loading={loading}
            error={error}
            onDisplayNameChange={setDisplayName}
            onSubmit={handleCompleteDisplayName}
          />
        ) : (
          <div className="auth-flip-perspective">
            <div className={`auth-flip-inner ${mode === "sign-up" ? "is-flipped" : ""}`}>
              <AuthCardFace mode="sign-in" {...faceProps} />
              <AuthCardFace mode="sign-up" {...faceProps} className="auth-flip-face-back" />
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-muted leading-relaxed">
          By continuing, you agree to our{" "}
          <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
            Terms
          </span>{" "}
          and{" "}
          <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
            Privacy Policy
          </span>
          .
        </p>
      </div>
    </div>
  );
}
