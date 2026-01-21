import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthProvider";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr(null);
    try {
      await login(email, password);
      nav("/", { replace: true });
    } catch (e2) {
      setErr(e2?.response?.data?.message || e2?.message || "Login failed");
    }
  }

  return (
    <div className="card" style={{ maxWidth: 520, margin: "0 auto" }}>
      <h1>Login</h1>
      {err && <div className="card" style={{ borderColor: "#ffccd5" }}>{err}</div>}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
        <label>
          <small>Email</small>
          <input value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>

        <label>
          <small>Password</small>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>

        <Button type="submit">Login</Button>
      </form>

      <hr />
      <small>
        No account? <Link to="/register">Register</Link>
      </small>
    </div>
  );
}
