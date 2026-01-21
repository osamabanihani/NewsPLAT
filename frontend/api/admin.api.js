import api from "./axios";

export async function fetchPendingNews() {
  const { data } = await api.get("/admin/news/pending");
  return data; // { items }
}

export async function approveNews(id) {
  const { data } = await api.post(`/admin/news/${id}/approve`);
  return data; // { item }
}

export async function deletePendingNews(id) {
  const { data } = await api.delete(`/admin/news/${id}`);
  return data;
}

export async function fetchUsers() {
  const { data } = await api.get("/admin/users");
  return data;
}
