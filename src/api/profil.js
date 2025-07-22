
import api from "./api";

export const getUtilisateurById = (id) =>
    api.get(`/utilisateurs/${id}`);

export const deleteUtilisateurAccount = (id) =>
    api.delete(`/utilisateurs/account/${id}`);