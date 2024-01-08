import { createContext, useState, FC, useContext, useEffect } from "react";
import { User, UserContextProps, UserProviderProps } from "../types";
import apiPaths from "../api/paths";

export const UserContext = createContext<UserContextProps | undefined>(
  undefined
);

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [updateBalance, setUpdateBalance] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //verify user's authentication status (e.g. on reload)
    const verifyUser = async () => {
      try {
        const response = await fetch(apiPaths.currentUser, {
          method: "GET",
          credentials: "include", // Include cookies
        });

        if (response.status === 401) {
          console.log("User not authenticated")
        }

        if (response.status === 403) {
          console.log("Invalid token")
        }

        if (response.ok) {
          const data = (await response.json()) as User;
          setUser(data);
        }

      } catch (error) {
        console.error("Failed to verify user", error); // network error
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch(apiPaths.balance, {
          method: "GET",
          credentials: "include",
        });

        if (response.status === 401) {
          console.log("User not authenticated")
        }

        if (response.status === 403) {
          console.log("Invalid token")
        }

        if (response.ok) {
          const data = (await response.json()) as number;
          setBalance(data);
        }

      } catch (error) {
        console.error("Failed to fetch balance", error); // network error
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [user, updateBalance]);

  return (
    <UserContext.Provider value={{ user, setUser, balance, updateBalance, setUpdateBalance }}>
      {!loading && children}
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
