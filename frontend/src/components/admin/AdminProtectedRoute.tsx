import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getAdminToken } from "../../lib/adminAuth";
import { AdminLayout } from "./AdminLayout";

export function AdminProtectedRoute({ children }: { children: ReactNode }) {
  const token = getAdminToken();
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return <AdminLayout>{children}</AdminLayout>;
}
