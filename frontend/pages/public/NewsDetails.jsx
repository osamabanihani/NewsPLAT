import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getNewsById } from "../../api/news.api";

// نفس الدومين اللي عليه الباكند (عدّلها لو باكندك على بورت ثاني)
const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || "http://localhost:8000";

function toAbsUrl(url) {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  // if url like "/uploads/xxx.jpg"
  return `${API_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
}

export default function NewsDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getNewsById(id);
        const news = data?.item || data;
        if (mounted) setItem(news);
      } catch (e) {
        if (mounted) setErr(e?.response?.data?.message || e?.message || "Failed");
      }
    })();
    return () => (mounted = false);
  }, [id]);

  if (err) return <div className="card">{err}</div>;
  if (!item) return <div className="card">Loading...</div>;

  // ✅ أهم سطر: خذ image_url (أو imageUrl لو عندك قديم) وحوله لرابط كامل
  const imgSrc = toAbsUrl(item.image_url || item.imageUrl);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div className="card">
        <h1 style={{ margin: 0 }}>{item.title}</h1>
        {item.created_at && <small style={{ color: "#666" }}>{item.created_at}</small>}
      </div>

      {/* ✅ عرض الصورة */}
     {imgSrc && (
  <div
    className="card image-card"
    style={{
      padding: 0,
      overflow: "hidden",
      borderRadius: 16,
      border: "1px solid #eee",
    }}
  >
    <div image-wrapper className="card"
      style={{
        width: "100%",
        height: "clamp(220px, 38vw, 420px)", // ✅ max-height + responsive
        background: "#f6f6f6",
      }}
    >
      <img
        src={imgSrc}
        alt={item.title || "news image"}
       
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",      // ✅ cover
          objectPosition: "center", // ✅ center
          display: "block",
        }}
        loading="lazy"
        className="image-zoom"
        
      />
    </div>
  </div>
)}


      <div className="card">
        <p style={{ whiteSpace: "pre-wrap" }}>
          {item.content || item.body || item.description}
        </p>
      </div>

      <Link to="/" style={{ width: "fit-content" }}>
        ← Back
      </Link>
    </div>
  );
}
