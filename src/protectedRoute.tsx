import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAuthStatus, subscribe } from "./auth";
import { useSyncExternalStore } from "react";

export default function ProtectedRoute() {
  const status = useSyncExternalStore(subscribe, getAuthStatus);
  const location = useLocation();

  if (status === "loading") return <div>Loading...</div>; // or a spinner

  if (status !== "authenticated") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
