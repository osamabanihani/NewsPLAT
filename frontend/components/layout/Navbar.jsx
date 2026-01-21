import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import Button from "../common/Button";
<Link to="/journalist/new">New</Link>

export default function Navbar() {
  const { user, role, isAuthed, logout } = useAuth();
  const nav = useNavigate();

  function handleLogout() {
    logout();
    nav("/");
  }

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to="/" style={{ fontWeight: 800 }}>📰 NewsPlatform</Link>

        <nav className="nav-links">
          <Link to="/">Home</Link>

          {isAuthed && <Link to="/favorites">Favorites</Link>}

          {role === "journalist" && (
            <>
              <Link to="/journalist">Journalist</Link>
              <Link to="/journalist/new">New</Link>
            </>
          )}

          {role === "admin" && (
            <>
              <Link to="/admin">Admin</Link>
              <Link to="/admin/review">Review</Link>
              <Link to="/admin/users">Users</Link>
            </>
          )}

          {!isAuthed ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <>
              <span className="badge">{user?.name || "User"} • {role}</span>
              <Button variant="secondary" onClick={handleLogout}>Logout</Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
