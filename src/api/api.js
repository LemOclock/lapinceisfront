
import axios from "axios";


const api = axios.create({

  baseURL: 'https://projet-la-pince-back-production.up.railway.app/',

});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;