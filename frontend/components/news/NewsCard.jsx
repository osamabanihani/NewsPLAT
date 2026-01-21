import { Link } from "react-router-dom";

export default function NewsCard({ item, isFav, onFavorite, onUnfavorite }) {
  return (
    <div className="card" style={{ display: "grid", gap: 8 }}>
      <h3 style={{ margin: 0 }}>
        <Link
          to={`/news/${item.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {item.title}
        </Link>
      </h3>

      {item.summary && <p style={{ margin: 0, color: "#666" }}>{item.summary}</p>}

      {isFav !== undefined && (
        <div style={{ display: "flex", gap: 8 }}>
          {isFav ? (
            <button onClick={() => onUnfavorite?.(item.id)}>Unfavorite</button>
          ) : (
            <button onClick={() => onFavorite?.(item.id)}>Favorite</button>
          )}
        </div>
      )}
    </div>
  );
}
