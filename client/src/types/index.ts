import { ReactNode } from "react";

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  balance: number;
}

export interface ExpenseOverview {
  user_id: number;
  category_id: number;
  name: string;
  total: number;
  expense_sum: goSqlNullFloat64;
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
  onClose?: () => void;
}

export interface ExpenseCardProps {
  category_id: number;
  name: string;
  total: number;
  expense_sum: goSqlNullFloat64;
}

export interface goSqlNullFloat64 {
  Float64: number;
  valid: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
}
