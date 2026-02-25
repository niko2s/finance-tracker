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
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    // Verify user's authentication status (e.g. on reload).
    const verifyUser = async () => {
      try {
        const response = await fetch(apiPaths.currentUser, {
          method: "GET",
          credentials: "include",
        });

        if (response.status === 401) {
          setUser(null);
        }

        if (response.status === 403) {
          setUser(null);
        }

        if (response.ok) {
          const data = (await response.json()) as User;
          if (!isCancelled) {
            setUser(data);
          }
        }
      } catch (error) {
        console.error("Failed to verify user", error);
      } finally {
        if (!isCancelled) {
          setIsAuthLoading(false);
        }
      }
    };

    void verifyUser();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const fetchBalance = async () => {
      if (!user) {
        setBalance(0);
        return;
      }

      try {
        const response = await fetch(apiPaths.balance, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = (await response.json()) as number;
          if (!isCancelled) {
            setBalance(data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch balance", error);
      }
    };

    void fetchBalance();

    return () => {
      isCancelled = true;
    };
  }, [user, updateBalance]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAuthLoading,
        balance,
        updateBalance,
        setUpdateBalance,
      }}
    >
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
