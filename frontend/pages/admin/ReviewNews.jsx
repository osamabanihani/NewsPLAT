import { useEffect, useState } from "react";
import { approveNews, listPendingNews, rejectNews } from "../../api/admin.api";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";

export default function ReviewNews() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [err, setErr] = useState(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await listPendingNews();
      setItems(res.items || []);
    } catch (e) {
      setErr(e?.message || "Failed to load pending news");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onApprove(id) {
    await approveNews(id);
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  async function onReject(id) {
    await rejectNews(id);
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  if (loading) return <Loader label="Loading pending news..." />;
  if (err) return <div className="card">{err}</div>;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div className="card">
        <h1 style={{ margin: 0 }}>Review News</h1>
        <small>Approve or reject pending news.</small>
      </div>

      {items.length === 0 ? (
        <div className="card">No pending news.</div>
      ) : (
        items.map((it) => (
          <div key={it.id} className="card">
            <h3 style={{ marginBottom: 6 }}>{it.title}</h3>
            <small>Author: {it.author_name || it.author_id}</small>
            <hr />
            <p>{(it.content || "").slice(0, 220)}{(it.content || "").length > 220 ? "..." : ""}</p>
            <div className="row">
              <Button onClick={() => onApprove(it.id)}>Approve</Button>
              <Button variant="danger" onClick={() => onReject(it.id)}>Reject</Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
