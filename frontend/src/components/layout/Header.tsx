import { History, LogOut } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { getDisplayName, getUserInitials } from "@/lib/auth";

export function Header() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await signOut();
    setLoggingOut(false);
    navigate("/login", { replace: true });
  };

  const displayName = getDisplayName(user);
  const initials = getUserInitials(user);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>

        <nav className="flex items-center gap-2">
          {user && (
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-medium text-white"
              title={displayName || user.email || undefined}
              aria-label={displayName ? `Signed in as ${displayName}` : "Signed in"}
            >
              {initials}
            </div>
          )}

          {user && (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/history">
                <History className="h-4 w-4" />
                History
              </Link>
            </Button>
          )}

          {user && (
            <div className="flex items-center gap-2 ml-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleLogout}
                disabled={loggingOut}
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
