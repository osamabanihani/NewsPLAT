import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import Loader from "../components/common/Loader";

export default function ProtectedRoute() {
  const { loading, isAuthed } = useAuth();

  if (loading) return <Loader label="Checking session..." />;
  if (!isAuthed) return <Navigate to="/login" replace />;
  return <Outlet />;
}
