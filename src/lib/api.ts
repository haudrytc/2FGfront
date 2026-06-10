import axios from "axios";

// En prod, définir VITE_API_URL (ex: https://2fg-api.onrender.com).
// En dev, on laisse vide → le proxy Vite redirige /api vers le backend.
const baseURL = import.meta.env.VITE_API_URL || "";

export const api = axios.create({ baseURL });

const TOKEN_KEY = "2fg_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

// Ajoute le token aux requêtes
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Déconnecte si le token a expiré
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401 && getToken()) {
      setToken(null);
      if (!window.location.pathname.startsWith("/admin/login")) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);
