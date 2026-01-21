import { useEffect, useState } from "react";
import { fetchPublishedNews } from "../../api/news.api";
import { addFavorite, removeFavorite, listFavorites } from "../../api/favorites.api";
import { useAuth } from "../../context/AuthProvider";
import Loader from "../../components/common/Loader";
import NewsList from "../../components/news/NewsList";

export default function Home() {
  const { isAuthed } = useAuth();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [favIds, setFavIds] = useState(new Set());
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchPublishedNews({ status: "published" });
      setItems(res.items || []);

      if (isAuthed) {
        const fav = await listFavorites();
        setFavIds(new Set((fav.items || []).map((x) => x.id)));
      } else {
        setFavIds(new Set());
      }
    } catch (e) {
      setError(e?.message || "Failed to load news");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthed]);

  async function onFavorite(id) {
    try {
      await addFavorite(id);
      setFavIds((prev) => new Set(prev).add(id));
    } catch {}
  }

  async function onUnfavorite(id) {
    try {
      await removeFavorite(id);
      setFavIds((prev) => {
        const s = new Set(prev);
        s.delete(id);
        return s;
      });
    } catch {}
  }

  if (loading) return <Loader label="Loading news..." />;
  if (error) return <div className="card">{error}</div>;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div className="card">
        <h1 style={{ margin: 0 }}>Latest News</h1>
        <small>Browse published news. Login to favorite.</small>
      </div>

      <NewsList
        items={items}
        favIds={favIds}
        showFavButton={isAuthed}
        onFavorite={isAuthed ? onFavorite : undefined}
        onUnfavorite={isAuthed ? onUnfavorite : undefined}
      />
    </div>
  );
}
