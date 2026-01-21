import NewsCard from "./NewsCard";

export default function NewsList({
  items = [],
  onFavorite,
  onUnfavorite,
  favIds, // Set of favorite ids
  showFavButton = false, // show favorite/unfavorite buttons
}) {
  if (!items.length) return <div className="card">No news found.</div>;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {items.map((it) => (
        <NewsCard
          key={it.id}
          item={it}
          isFav={showFavButton ? favIds?.has(it.id) : undefined}
          onFavorite={onFavorite}
          onUnfavorite={onUnfavorite}
        />
      ))}
    </div>
  );
}
