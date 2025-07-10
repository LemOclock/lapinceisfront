
import api from "./api";

export const getUtilisateurById = (id) =>
    api.get(`/utilisateurs/${id}`);