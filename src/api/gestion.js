
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