import { Navigate } from "react-router";
import type { ReactNode } from "react";
import { useAuth } from "../context/useAuth";

type PublicOnlyRouteProps = {
  children: ReactNode;
};

function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default PublicOnlyRoute;