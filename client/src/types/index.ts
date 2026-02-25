import { ReactNode } from "react";

export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
}

export interface InfoMessage {
  message: string;
  color: "red" | "default";
}

export interface ExpenseOverview {
  user_id: number;
  category_id: number;
  name: string;
  total: number;
  expense_sum: GoSqlNullFloat64 | null;
}

export interface Expense {
  id: number;
  title?: string | null;
  value: number;
  category: number;
}

export interface LoginResponse {
  id: number;
  error: string;
}

export interface UserContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthLoading: boolean;
  balance: number;
  updateBalance: boolean;
  setUpdateBalance: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface UserProviderProps {
  children: ReactNode;
}

export type CustomFetchFunction = (
  url: string,
  options: RequestInit
) => Promise<Response>;

export interface AddFormProps {
  title: string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  status: string;
  children: React.ReactNode;
}

export interface ExpenseCardProps {
  category_id: number;
  name: string;
  total: number;
  expense_sum: GoSqlNullFloat64 | null;
}

export interface GoSqlNullFloat64 {
  Float64: number;
  Valid?: boolean;
  valid?: boolean;
}

export interface ModalProps {
  id: string;
  onClose: () => void;
  children: React.ReactNode;
}
