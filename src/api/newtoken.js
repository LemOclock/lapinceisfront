import api from "./api";

export const newToken = () =>
    api.get('/reconnect');
