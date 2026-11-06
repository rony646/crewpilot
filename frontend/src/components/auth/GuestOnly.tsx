import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import { resolveAuthRedirect } from "@/lib/authRedirect";

export function GuestOnly({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (user) {
    const redirect = resolveAuthRedirect(location.state);
    return <Navigate to={redirect.to} replace state={redirect.state} />;
  }

  return children;
}
