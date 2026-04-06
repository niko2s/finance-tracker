const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const API_VERSION = "/api/v1";

const apiPaths = {
  register: `${API_BASE_URL}${API_VERSION}/register`,
  login: `${API_BASE_URL}${API_VERSION}/login`,
  refreshToken: `${API_BASE_URL}${API_VERSION}/refresh`,
  logout: `${API_BASE_URL}${API_VERSION}/logout`,
  currentUser: `${API_BASE_URL}${API_VERSION}/users/me`,
  categories: `${API_BASE_URL}${API_VERSION}/users/me/categories`,
  deposit: `${API_BASE_URL}${API_VERSION}/users/me/deposit`,
  depositSum: `${API_BASE_URL}${API_VERSION}/users/me/deposit/sum`,
  balance: `${API_BASE_URL}${API_VERSION}/users/me/balance`,

  categoryById: (categoryId: string | number) =>
    `${API_BASE_URL}${API_VERSION}/users/me/categories/${categoryId}`,
  expensesByCategory: (categoryId: string | number) =>
    `${API_BASE_URL}${API_VERSION}/users/me/categories/${categoryId}/expenses`,
  expenseByCategoryAndId: (categoryId: string | number, expenseId: string | number) =>
    `${API_BASE_URL}${API_VERSION}/users/me/categories/${categoryId}/expenses/${expenseId}`,
  depositById: (depositId: string | number) =>
    `${API_BASE_URL}${API_VERSION}/users/me/deposit/${depositId}`,
};

export default apiPaths;
