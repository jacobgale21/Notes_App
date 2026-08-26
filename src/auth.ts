// src/auth.ts
type AuthStatus = "loading" | "authenticated" | "anonymous";

let accessToken: string | null = null;
let status: AuthStatus = "loading";
const listeners = new Set<() => void>();

export function getAccessToken() {
  return accessToken;
}
export function getAuthStatus() {
  return status;
}

export function setAccessToken(token: string | null) {
  accessToken = token;
  status = token ? "authenticated" : "anonymous";
  listeners.forEach((l) => l());
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
