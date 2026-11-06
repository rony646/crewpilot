import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { AuthBackdrop } from "@/components/auth/AuthBackdrop";
import { AuthCardFace, type AuthMode } from "@/components/auth/AuthCardFace";
import { DisplayNameSetupCard } from "@/components/auth/DisplayNameSetupCard";
import { Logo } from "@/components/Logo";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { getDisplayName, validateDisplayName } from "@/lib/auth";
import { resolveAuthRedirect } from "@/lib/authRedirect";
import { auth } from "@/lib/firebase";

function showError(title: string, description: string) {
  toast({ title, description, variant: "error" });
}

export function Login() {
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [needsDisplayName, setNeedsDisplayName] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const redirectAfterAuth = () => {
    const redirect = resolveAuthRedirect(location.state);
    navigate(redirect.to, { replace: true, state: redirect.state });
  };

  const switchMode = () => {
    setMode((current) => (current === "sign-in" ? "sign-up" : "sign-in"));
  };

  const requireDisplayNameOrContinue = () => {
    if (!getDisplayName(auth.currentUser)) {
      setNeedsDisplayName(true);
      return;
    }

    redirectAfterAuth();
  };

  const handleCompleteDisplayName = async (event: React.FormEvent) => {
    event.preventDefault();

    const validationError = validateDisplayName(displayName);
    if (validationError) {
      showError("Check your display name", validationError);
      return;
    }

    setLoading(true);

    try {
      if (!auth.currentUser) {
        throw new Error("You must be signed in to set a display name.");
      }

      await updateProfile(auth.currentUser, {
        displayName: displayName.trim(),
      });

      setNeedsDisplayName(false);
      redirectAfterAuth();
    } catch (err) {
      showError(
        "Couldn't save display name",
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (mode === "sign-in") {
        await signInWithEmailAndPassword(auth, email, password);
        requireDisplayNameOrContinue();
        return;
      }

      const validationError = validateDisplayName(displayName);
      if (validationError) {
        showError("Check your display name", validationError);
        return;
      }

      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: displayName.trim() });
      requireDisplayNameOrContinue();
    } catch (err) {
      showError(
        mode === "sign-in" ? "Couldn't sign in" : "Couldn't create account",
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const faceProps = {
    email,
    password,
    displayName,
    loading,
    onEmailChange: setEmail,
    onPasswordChange: setPassword,
    onDisplayNameChange: setDisplayName,
    onSubmit: handleSubmit,
    onSwitchMode: switchMode,
  };

  return (
    <>
      <AuthBackdrop>
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

          {/* <p className="mt-6 text-center text-xs text-muted leading-relaxed">
          By continuing, you agree to our{" "}
          <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
            Terms
          </span>{" "}
          and{" "}
          <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
            Privacy Policy
          </span>
          .
        </p> */}
        </div>
      </AuthBackdrop>
      <Toaster />
    </>
  );
}
