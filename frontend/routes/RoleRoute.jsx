import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";



export default function RoleRoute({ allow = [] }) {
  const { role } = useAuth();

  if (!allow.length) return <Outlet />;

  if (!allow.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
