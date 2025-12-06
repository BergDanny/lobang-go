import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, initializeAuth } = useAuthStore();

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // If authenticated, redirect to quests page
  if (isAuthenticated) {
    return <Navigate to="/quests" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;

