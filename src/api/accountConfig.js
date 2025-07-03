import api from "./api";

export const accountConfig = (data) => 
    api.post('/comptes', data);