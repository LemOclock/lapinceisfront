
import api from "./api";


export const getAllCategories = () =>
    api.get('/categories');

export const sendForm = (data) =>
    api.post("/operations/account", data);

export const findCompteId = () =>
    api.get("/comptes/getcomptebyuserid")

// export const getOperationByDate = () =>
//     api.get("/operations/getoperationbydate");



export const getOperationByDate = (date) =>
    api.get(`/operations/account/getoperationbydate?date_operation=${date}`);

export const updateOperationAccount = (operationId, data) =>
    api.put(`/operations/account/${operationId}`, data);

export const deleteOperationAccount = (operationId) =>
    api.delete(`/operations/account/${operationId}`);

export const getOperationsByMonth = (month, year) =>
    api.get(`/operations/account/month?month=${month}&year=${year}`);

export const getOperationsByIdAccount = (compteId) =>
    api.get(`/operations/account/${compteId}`);