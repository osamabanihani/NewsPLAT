import { useEffect, useState } from "react";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import { approveNews, deletePendingNews, fetchPendingNews } from "../../api/admin.api";

export default function AdminDashboard() {
  const [tab, setTab] = useState("pending"); // pending | users
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [err, setErr] = useState(null);

  async function loadPending() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetchPendingNews();
      setItems(res.items || []);
    } catch (e) {
      setErr(e?.response?.data?.message || e?.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (tab === "pending") loadPending();
  }, [tab]);

  async function onApprove(id) {
    try {
      await approveNews(id);
      setItems((prev) => prev.filter((x) => x.id !== id)); // شيله من pending
    } catch (e) {
      alert(e?.response?.data?.message || e?.message || "Approve failed");
    }
  }

  async function onDelete(id) {
    try {
      await deletePendingNews(id);
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || e?.message || "Delete failed");
    }
  }

  if (loading) return <Loader label="Loading..." />;
  if (err) return <div className="card">{err}</div>;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div className="card">
        <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
        <small>Moderate news & manage users.</small>

        <div className="row" style={{ gap: 8, marginTop: 10 }}>
          <Button type="button" variant={tab === "pending" ? "primary" : "secondary"} onClick={() => setTab("pending")}>
            Pending News
          </Button>
          <Button type="button" variant={tab === "users" ? "primary" : "secondary"} onClick={() => setTab("users")}>
            Users
          </Button>
        </div>
      </div>

      {tab === "pending" && (
        items.length === 0 ? (
          <div className="card">No pending news.</div>
        ) : (
          items.map((it) => (
            <div className="card" key={it.id}>
              <h3 style={{ margin: "0 0 6px" }}>{it.title}</h3>
              <small className="badge">{it.status}</small>
              <small style={{ marginLeft: 8, color: "#94a3b8" }}>by {it.author_name}</small>

              <div className="row" style={{ gap: 8, marginTop: 10 }}>
                <Button type="button" onClick={() => onApprove(it.id)}>
                  Approve
                </Button>
                <Button type="button" variant="danger" onClick={() => onDelete(it.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))
        )
      )}
    </div>
  );
}
