export default function Loader({ label = "Loading..." }) {
  return (
    <div className="card" style={{ display: "grid", gap: 8, placeItems: "center" }}>
      <div style={{ width: 26, height: 26, border: "3px solid #ddd", borderTopColor: "#111", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      <small>{label}</small>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
