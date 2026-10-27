
import api from "./api";

export const getMe = () =>
    api.get("/utilisateurs/me");

export const updatePassword = (mot_de_passe_actuel, nouveau_mot_de_passe) =>
    api.put("/utilisateurs/me/password", { mot_de_passe_actuel, nouveau_mot_de_passe });

export const deleteMyAccount = () =>
    api.delete("/utilisateurs/me");
