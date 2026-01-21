import api from "./axios";

export async function listFavorites() {
  const { data } = await api.get("/favorites");
  return data; // expected: { items: [] }
}

export async function addFavorite(newsId) {
  const { data } = await api.post(`/favorites/${newsId}`);
  return data;
}

export async function removeFavorite(newsId) {
  const { data } = await api.delete(`/favorites/${newsId}`);
  return data;
}
