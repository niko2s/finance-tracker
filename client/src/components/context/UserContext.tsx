import { createContext, useState, FC, useContext } from "react";
import { User, UserContextProps, UserProviderProps } from "../../types";

export const UserContext = createContext<UserContextProps | undefined>(
  undefined
);

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
