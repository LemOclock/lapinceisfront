import axios from "axios";

// URL de l'API injectée au build par Parcel (fichier .env). Par défaut : /api sur le même domaine.
const api = axios.create({
  baseURL: process.env.API_URL || "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Session expirée ou invalide : on supprime le token et on renvoie vers la connexion
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes("/login");
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Message d'erreur lisible à partir d'une erreur axios
export const getErrorMessage = (error, fallback = "Une erreur est survenue.") => {
  const data = error?.response?.data;
  if (!data) return error?.response ? fallback : "Impossible de joindre le serveur.";
  if (typeof data.error === "string") return data.error;
  if (data.errors && typeof data.errors === "object") {
    const first = Object.values(data.errors)[0];
    if (first) return first;
  }
  return data.message || fallback;
};

export default api;
