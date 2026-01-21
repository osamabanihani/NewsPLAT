import { useNavigate } from "react-router-dom";
import { createNews } from "../../api/news.api";
import NewsForm from "../../components/news/NewsForm";
import { useState, useMemo } from "react";
import api from "../../api/axios"; // نفس axios instance

function toAbsoluteUrl(path) {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = api?.defaults?.baseURL || "";
  return `${base}${path}`;
}

export default function CreateNews() {
  const nav = useNavigate();

  // ✅ نخزن المسار اللي بيرجع من الباك (لازم يضل /uploads/..)
  const [imagePath, setImagePath] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // ✅ هذا فقط للعرض (Preview)
  const previewUrl = useMemo(() => toAbsoluteUrl(imagePath), [imagePath]);

  async function onFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setProgress(0);

      const form = new FormData();
      form.append("file", file);

      const { data } = await api.post("/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (ev) => {
          const total = ev.total || 0;
          if (!total) return;
          setProgress(Math.round((ev.loaded * 100) / total));
        },
      });

      // backend يرجع: { url: "/uploads/xxx.jpg" }
      setImagePath(data?.url || null); // ✅ خليه relative
    } catch (err) {
      alert(err?.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function onRemoveImage() {
    setImagePath(null);
    setProgress(0);
  }

  async function onSubmit(payload) {
    // ✅ ابعث snake_case للباك + ابعث المسار النسبي
    await createNews({
      ...payload,
      image_url: imagePath, // ✅ لازم /uploads/xxx.jpg
    });

    nav("/journalist");
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div className="card">
        <h1 style={{ margin: 0 }}>Create News</h1>
      </div>

      <NewsForm
        onSubmit={onSubmit}
        submitLabel="Submit for review"
        imageUrl={previewUrl}        
        uploading={uploading}
        progress={progress}
        onFileChange={onFileChange}
        onRemoveImage={onRemoveImage}
      />
    </div>
  );
}
