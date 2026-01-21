import api from "./axios";

// ===== Public =====
export async function fetchPublishedNews(params = {}) {
  const { data } = await api.get("/news", { params });
  return data; // { items: [] }
}

export async function getNewsById(id) {
  const { data } = await api.get(`/news/${id}`);
  return data; // { item }
}

// ===== Journalist =====
export async function fetchMyNews() {
  const { data } = await api.get("/journalist/news");
  return data; // { items: [] }
}

export async function createNews(payload) {
  const { data } = await api.post("/journalist/news", payload);
  return data; // { item }
}

export async function updateNews(id, payload) {
  const { data } = await api.put(`/journalist/news/${id}`, payload);
  return data; // { item }
}

export async function deleteNews(id) {
  const { data } = await api.delete(`/journalist/news/${id}`);
  return data; // { deleted: true }
}
