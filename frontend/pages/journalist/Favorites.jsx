import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listFavorites, removeFavorite } from "../../api/favorites.api";

export default function Favorites() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await listFavorites(); // expected: { items: [] }
      setItems(res?.items || []);
    } catch (e) {
      setErr(e?.response?.data?.message || e?.message || "Failed to load favorites");
    } finally {
      setLoading(false);
    }
  }

  async function onRemove(id) {
    try {
      await removeFavorite(id);
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || e?.message || "Remove failed");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div className="card">
        <h1 style={{ margin: 0 }}>Favorites</h1>
        <p style={{ marginTop: 6, color: "#666" }}>
          Your saved news will appear here.
        </p>
      </div>

      {loading && <div className="card">Loading...</div>}
      {err && <div className="card" style={{ borderColor: "#ffccd5" }}>{err}</div>}

      {!loading && !err && items.length === 0 && (
        <div className="card">No favorites yet.</div>
      )}

      {!loading && !err && items.map((n) => (
        <div key={n.id} className="card" style={{ display: "grid", gap: 6 }}>
          {/* ✅ clickable title */}
          <h3 style={{ margin: 0 }}>
            <Link
              to={`/news/${n.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {n.title}
            </Link>
          </h3>

          <p style={{ margin: 0, color: "#666" }}>{n.summary}</p>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRemove(n.id);
              }}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
