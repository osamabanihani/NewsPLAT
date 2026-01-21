import { useEffect, useState } from "react";
import { listUsers, updateUserRole } from "../../api/admin.api";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";

export default function ManageUsers() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [err, setErr] = useState(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await listUsers();
      setItems(res.items || []);
    } catch (e) {
      setErr(e?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function setRole(id, role) {
    await updateUserRole(id, role);
    setItems((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
  }

  if (loading) return <Loader label="Loading users..." />;
  if (err) return <div className="card">{err}</div>;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div className="card">
        <h1 style={{ margin: 0 }}>Manage Users</h1>
        <small>Change user roles.</small>
      </div>

      {items.map((u) => (
        <div key={u.id} className="card">
          <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ marginBottom: 6 }}>{u.name}</h3>
              <small>{u.email}</small>
              <div style={{ marginTop: 8 }} className="badge">{u.role}</div>
            </div>

            <div className="row">
              <Button variant="secondary" onClick={() => setRole(u.id, "user")}>user</Button>
              <Button variant="secondary" onClick={() => setRole(u.id, "journalist")}>journalist</Button>
              <Button onClick={() => setRole(u.id, "admin")}>admin</Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
