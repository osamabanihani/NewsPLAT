import api from "./axios";

/**
 * Upload image with progress callback
 * @param {File} file
 * @param {(percent:number)=>void} onProgress
 */
export async function uploadImage(file, onProgress) {
  const form = new FormData();
  form.append("file", file);

  const res = await api.post("/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (evt) => {
      if (!evt.total) return;
      const percent = Math.round((evt.loaded * 100) / evt.total);
      onProgress?.(percent);
    },
  });

  return res.data; // { url, filename }
}
