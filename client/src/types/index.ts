import { ReactNode } from "react";

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  balance: number;
}

export interface ExpenseCategory {
  id: number;
  name: string;
  total: number;
  userId: number;
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

export interface AddFormProps {
  title: string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  status: string;
  children: React.ReactNode;
  onClose?: () => void;
}

export interface ExpenseCardProps {
  id: number;
  name: string;
  total: number;
}

export interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
}
