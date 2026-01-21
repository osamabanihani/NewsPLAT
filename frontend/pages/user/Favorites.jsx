import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listFavorites, removeFavorite } from "../../api/favorites.api";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";

export default function Favorites() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [err, setErr] = useState(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await listFavorites();
      setItems(res.items || []);
    } catch (e) {
      setErr(e?.message || "Failed to load favorites");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onUnfavorite(id) {
    await removeFavorite(id);
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  if (loading) return <Loader label="Loading favorites..." />;
  if (err) return <div className="card">{err}</div>;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div className="card">
        <h1 style={{ margin: 0 }}>Favorites</h1>
        <small>Your saved news.</small>
      </div>

      {!items.length ? (
        <div className="card">No favorites yet.</div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {items.map((item) => (
            <div key={item.id} className="card" style={{ display: "grid", gap: 10 }}>
              {/* Title clickable */}
              <h3 style={{ margin: 0 }}>
                <Link
                  to={`/news/${item.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {item.title}
                </Link>
              </h3>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onUnfavorite(item.id);
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
