import api from "./api";

// Budgets
export const getUserBudgets = () => api.get("/budgets/user");
export const createBudget = (budgetData) => api.post("/budgets", budgetData);
export const updateBudget = (budgetId, budgetData) =>
  api.put(`/budgets/${budgetId}`, budgetData);
export const deleteBudget = (budgetId) => api.delete(`/budgets/${budgetId}`);

// Opérations (dépenses) rattachées à un budget
export const getOperations = (filters) =>
  api.get("/operations/budget", { params: filters });
