import api from "./api";

export const login = (email, mot_de_passe) =>
    api.post('/login', { email, mot_de_passe });

export const register = (registerData) =>
    api.post('/register', { ...registerData });

