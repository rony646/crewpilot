import type { User } from "@supabase/supabase-js";

const DISPLAY_NAME_KEY = "display_name";
const MIN_DISPLAY_NAME_LENGTH = 2;
const MAX_DISPLAY_NAME_LENGTH = 50;

export function getDisplayName(user: User | null | undefined): string {
  const value = user?.user_metadata?.[DISPLAY_NAME_KEY];
  return typeof value === "string" ? value.trim() : "";
}

export function validateDisplayName(value: string): string | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return "Display name is required.";
  }

  if (trimmed.length < MIN_DISPLAY_NAME_LENGTH) {
    return `Display name must be at least ${MIN_DISPLAY_NAME_LENGTH} characters.`;
  }

  if (trimmed.length > MAX_DISPLAY_NAME_LENGTH) {
    return `Display name must be at most ${MAX_DISPLAY_NAME_LENGTH} characters.`;
  }

  return null;
}

export function displayNameMetadata(value: string) {
  return { [DISPLAY_NAME_KEY]: value.trim() };
}

/** Derive 1–2 letter initials from display name, then email, then fallback. */
export function getUserInitials(user: User | null | undefined): string {
  const displayName = getDisplayName(user);
  if (displayName) {
    const parts = displayName.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return displayName.slice(0, 2).toUpperCase();
  }

  const email = user?.email?.trim();
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }

  return "?";
}
