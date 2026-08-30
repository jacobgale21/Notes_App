import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAuthStatus, subscribe } from "./auth";
import { useSyncExternalStore } from "react";
import Loading from "./components/UI/loading";

export default function ProtectedRoute() {
  const status = useSyncExternalStore(subscribe, getAuthStatus);
  const location = useLocation();

  if (status === "loading") return <Loading label="Loading..." />;

  if (status !== "authenticated") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
