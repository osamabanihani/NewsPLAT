import { useState } from "react";
import Button from "../common/Button";

export default function NewsForm({
  initial = {},
  onSubmit,
  submitLabel = "Save",

  // image upload props (from CreateNews/EditNews page)
  imageUrl = null,
  uploading = false,
  progress = 0,
  onFileChange,
  onRemoveImage,
}) {
  const [title, setTitle] = useState(initial.title || "");
  const [content, setContent] = useState(initial.content || "");
  const [status, setStatus] = useState(initial.status || "pending");

  async function handleSubmit(e) {
    e.preventDefault();

    // ✅ IMPORTANT: send as image_url for backend/db
    await onSubmit?.({
      title,
      content,
      status,
      image_url: imageUrl || null,
    });
  }

  return (
    <form
      className="card"
      onSubmit={handleSubmit}
      style={{ display: "grid", gap: 12 }}
    >
      <h2 style={{ margin: 0 }}>News</h2>

      {/* ===== Title ===== */}
      <label>
        <small>Title</small>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>

      {/* ===== Content ===== */}
      <label>
        <small>Content</small>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={6}
        />
      </label>

      {/* ===== Status ===== */}
      <label>
        <small>Status</small>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">pending</option> 
          <option value="draft">draft</option>
        </select>
      </label>

      {/* ===== Image Upload ===== */}
      <div style={{ display: "grid", gap: 8 }}>
        <small>Image</small>

        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          disabled={uploading}
        />

        {/* Progress bar */}
        {uploading && (
          <div style={{ display: "grid", gap: 4 }}>
            <progress value={progress} max="100" style={{ width: "100%" }} />
            <small>{progress}%</small>
          </div>
        )}

        {/* Preview */}
        {imageUrl && (
  <div style={{ display: "grid", gap: 6 }}>
    <div
      style={{
        width: "100%",
        maxWidth: 420,
        height: 220,
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid #eee",
        background: "#f6f6f6",
      }}
    >
      <img
        src={imageUrl}
        alt="preview"
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    </div>

    <button type="button" className="btn" onClick={onRemoveImage} disabled={uploading}>
      Remove image
    </button>
  </div>
)}

      </div>

      <Button type="submit" disabled={uploading}>
        {submitLabel}
      </Button>
    </form>
  );
}
