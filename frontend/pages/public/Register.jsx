import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../../components/common/Button";
import { registerApi } from "../../api/auth.api";

export default function Register() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);

  async function handleSubmit(e) {
  e.preventDefault();
  setErr(null);

  // ✅ ADD VALIDATION HERE (BEFORE API CALL)

  // min length
  if (password.length < 8) {
    setErr("Password must be at least 8 characters");
    return;
  }

  // bcrypt 72-byte limit (important)
  const byteLength = new TextEncoder().encode(password).length;
  if (byteLength > 72) {
    setErr("Password must be at most 72 characters");
    return;
  }

  try {
    await registerApi({ name, email, password });
    nav("/login", { replace: true });
  } catch (e2) {
    setErr(e2?.response?.data?.message || e2?.message || "Register failed");
  }
}


  return (
    <div className="card" style={{ maxWidth: 520, margin: "0 auto" }}>
      <h1>Register</h1>
      {err && <div className="card" style={{ borderColor: "#ffccd5" }}>{err}</div>}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
        <label>
          <small>Name</small>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>

        <label>
          <small>Email</small>
          <input value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>

        <label>
          <small>Password</small>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>

        <Button type="submit">Create account</Button>
      </form>

      <hr />
      <small>
        Already have an account? <Link to="/login">Login</Link>
      </small>
    </div>
  );
}
