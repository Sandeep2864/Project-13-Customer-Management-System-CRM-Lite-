import { Navigate } from "react-router-dom";
import React from "react";
import { useAuth } from "../hooks/useAuth";
import type { UserRole } from "../types";

const ProtectedRoute = ({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: UserRole;
}) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--crm-bg)]">
        <div className="rounded-full border border-[var(--crm-line)] bg-white px-5 py-3 text-sm font-semibold text-slate-500 shadow-sm">
          Loading workspace...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
