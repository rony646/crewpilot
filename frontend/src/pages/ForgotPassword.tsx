import { useState } from "react";
import { Link } from "react-router-dom";

import { AuthBackdrop } from "@/components/auth/AuthBackdrop";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

export function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast({
          title: "Recovery link sent",
          description: "If an account exists for that email, we sent a reset link.",
          variant: "success",
        });
      })
      .catch((error: Error) => {
        toast({
          title: "Failed to send recovery link",
          description: error?.message || "An unknown error occurred",
          variant: "error",
        });
      });
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

          <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-medium tracking-tight mb-2">Forgot your password?</h1>
              <p className="text-muted-foreground text-sm">
                Enter your email and we&apos;ll send you a recovery link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="recovery-email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  id="recovery-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" variant="gradient" size="lg" className="w-full">
                Send recovery link
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              <Link
                to="/login"
                className="text-accent hover:text-primary-hover transition-colors font-medium"
              >
                Back to sign in
              </Link>
            </p>
          </div>
        </div>
      </AuthBackdrop>
      <Toaster />
    </>
  );
}
