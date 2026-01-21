import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteNews, fetchMyNews } from "../../api/news.api";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";

export default function JournalistDashboard() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [err, setErr] = useState(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetchMyNews();
      setItems(res.items || []);
    } catch (e) {
      setErr(e?.message || "Failed to load your news");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onDelete(id) {
    await deleteNews(id);
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  if (loading) return <Loader label="Loading your news..." />;
  if (err) return <div className="card">{err}</div>;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* ===== Header Card ===== */}
      <div
        className="card"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Journalist Dashboard</h1>
          <small style={{ color: "var(--muted)" }}>
            Manage your news posts.
          </small>
        </div>

        <Link to="/journalist/new">
          <Button variant="primary">➕ Create News</Button>
        </Link>
      </div>

      {/* ===== News List ===== */}
      {items.length === 0 ? (
        <div className="card">No items.</div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {items.map((it) => (
            <div
              key={it.id}
              className="card"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 14,
              }}
            >
              {/* Left */}
              <div style={{ minWidth: 0 }}>
                <h3 style={{ margin: "0 0 6px 0" }}>{it.title}</h3>

                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <span className="badge">{it.status}</span>

                  {it.created_at && (
                    <small style={{ color: "var(--muted)" }}>
                      {new Date(it.created_at).toLocaleString()}
                    </small>
                  )}
                </div>

                {/* ✅ show review_note if rejected */}
                {it.status === "rejected" && it.review_note && (
                  <div
                    className="card"
                    style={{
                      marginTop: 10,
                      padding: 10,
                      borderColor: "rgba(239, 68, 68, 0.35)",
                      background: "rgba(239, 68, 68, 0.08)",
                      boxShadow: "none",
                    }}
                  >
                    <small style={{ color: "#fecaca", fontWeight: 700 }}>
                      Rejection reason:
                    </small>
                    <div style={{ marginTop: 4, color: "var(--text)", whiteSpace: "pre-wrap" }}>
                      {it.review_note}
                    </div>
                  </div>
                )}
              </div>

              {/* Right actions */}
              <div style={{ display: "flex", gap: 8 }}>
                <Link to={`/journalist/edit/${it.id}`}>
                  <Button variant="secondary" className="btn-sm">
                    ✏️ Edit
                  </Button>
                </Link>

                <Button
                  variant="danger"
                  className="btn-sm"
                  onClick={() => onDelete(it.id)}
                >
                  🗑 Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
