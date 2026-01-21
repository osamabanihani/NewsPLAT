import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/common/Loader";
import NewsForm from "../../components/news/NewsForm";
import { getNewsById, updateNews } from "../../api/news.api";

export default function EditNews() {
  const { id } = useParams();
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [initial, setInitial] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await getNewsById(id);
        // حسب API عندك: res.item أو res.news
        const item = res.item || res.news || res;
        setInitial(item);
      } catch (e) {
        setErr(e?.response?.data?.message || e?.message || "Failed to load news");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function onSubmit(payload) {
    await updateNews(id, payload);
    nav("/journalist", { replace: true });
  }

  if (loading) return <Loader label="Loading..." />;
  if (err) return <div className="card">{err}</div>;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div className="card">
        <h1 style={{ margin: 0 }}>Edit News</h1>
      </div>

      <NewsForm
        initialValues={{
          title: initial?.title || "",
          body: initial?.body || "",
          image_url: initial?.image_url || "",
          status: initial?.status || "pending",
        }}
        onSubmit={onSubmit}
        submitLabel="Save"
      />
    </div>
  );
}
