export type AuthRedirectState = {
  from?: string;
  idea?: string;
};

export function resolveAuthRedirect(state: unknown): {
  to: string;
  state?: { idea: string };
} {
  const redirect = (state ?? null) as AuthRedirectState | null;
  const from = redirect?.from;
  const to = from && from !== "/login" && from !== "/forgot-password" ? from : "/";

  return {
    to,
    state: redirect?.idea ? { idea: redirect.idea } : undefined,
  };
}
