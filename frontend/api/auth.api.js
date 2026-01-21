import api from "./axios";

export async function registerApi(payload) {
  const { data } = await api.post("/auth/register", payload);
  return data;
}

export async function loginApi(payload) {
  const { data } = await api.post("/auth/login", payload);
  return data; // expected: { token, user }
}

export async function meApi() {
  const { data } = await api.get("/me");
  return data; // expected: { user }
}
