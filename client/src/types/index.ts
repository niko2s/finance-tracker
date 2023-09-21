import { MouseEventHandler } from "react";


export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  balance: number;
}
export interface UserProfileProps {
  id: number;
  username: string;
  email: string;
  balance: number;
}
export interface LoginProps {
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}

export interface LoginResponse {
  id: number;
  error: string;
}
