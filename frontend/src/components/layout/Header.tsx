import { Link } from "react-router-dom";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>

        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/history">
              <History className="h-4 w-4" />
              History
            </Link>
          </Button>
          {/* </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
            <Button variant="secondary" size="sm" asChild>
              <Link to="/login">
                <User className="mr-2 h-4 w-4" />
                Sign in
              </Link>
            </Button> */}
        </nav>
      </div>
    </header>
  );
}
