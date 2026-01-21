export default function Button({ children, variant = "primary", ...props }) {
  const base = {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid #ddd",
    cursor: "pointer",
    fontWeight: 600
  };

  const styles =
    variant === "primary"
      ? { ...base, background: "#111", color: "#fff", borderColor: "#111" }
      : variant === "danger"
      ? { ...base, background: "#fff", color: "#b00020", borderColor: "#ffccd5" }
      : { ...base, background: "#fff", color: "#111" };

  return (
    <button style={styles} {...props}>
      {children}
    </button>
  );
}
