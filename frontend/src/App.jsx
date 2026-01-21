import { Outlet, Link } from "react-router-dom";
import { useAuth } from "/context/AuthProvider";

export default function App() {
  const { isAuthed, user, logout } = useAuth();

  return (
    <>
      <div className="nav">
        <div className="nav-inner">
          <Link to="/" style={{ fontWeight: 800, letterSpacing: 0.2 }}>
            News<span style={{ color: "#60a5fa" }}>PLAT</span>
          </Link>

          <div className="nav-links">
            <Link className="nav-link" to="/">Home</Link>

            {isAuthed && (
              <Link className="nav-link" to="/favorites">Favorites</Link>
            )}

            {/* ✅ Admin فقط */}
            {isAuthed && user?.role === "admin" && (
              <Link className="nav-link" to="/admin">Admin</Link>
            )}

            {/* ✅ Journalist + Admin */}
             {isAuthed && user?.role === "journalist" && (
              <Link className="nav-link" to="/journalist">Journalist</Link>
            )}



            {!isAuthed ? (
              <>
                <Link className="nav-link" to="/login">Login</Link>
                <Link className="nav-link" to="/register">Register</Link>
              </>
            ) : (
              <button className="btn" onClick={logout}>
                Logout
              </button>
            )}
          </div>
        </div>
      </div>

      <main className="container">
        <Outlet />
        <div className="footer">© {new Date().getFullYear()} NewsPLAT</div>
      </main>
    </>
  );
}
