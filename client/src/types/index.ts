import { ReactNode } from "react";

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  balance: number;
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
