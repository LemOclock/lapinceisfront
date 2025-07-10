import api from "./api";

// Budgets
export const getUserBudgets = () => api.get("/budgets/user");
export const createBudget = (budgetData) => api.post("/budgets", budgetData);
export const updateBudget = (budgetId, budgetData) =>
  api.put(`/budgets/${budgetId}`, budgetData);
export const deleteBudget = (budgetId) => api.delete(`/budgets/${budgetId}`);

// Opérations
export const getOperations = (filters) =>
  api.get("/operations/budget", { params: filters });
// export const searchOperations = (searchQuery, budgetId) =>
//   api.get("/operations/budget/search", {
//     params: {
//       search: searchQuery,
//       budget_id: budgetId,
//     },
//   });

export const searchOperations = (month, year) =>
  api.get(`/operations/account/month?month=${month}&year=${year}`);
