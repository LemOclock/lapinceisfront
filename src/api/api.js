//  On peut se créer une instance d'axios dans un fichier api.js par exemple
// ---- Fichier api.js
// Axios = Package pour faire des requêtes HTTP
// On l'utilise pour faire des requêtes à notre API
import axios from "axios";


const api = axios.create({

  baseURL: 'https://projet-la-pince-back-production.up.railway.app/',

});

// A chaque requête API on ajoute le token dans le header
// Il faut que ce token ait été stocké dans le localstorage au moment du login
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
