import { createContext, useState, FC, useContext, useEffect } from "react";
import { User, UserContextProps, UserProviderProps } from "../../types";

export const UserContext = createContext<UserContextProps | undefined>(
  undefined
);

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //verify user's authentication status (e.g. on reload)
    const verifyUser = async () => {
      try {
        const response = await fetch("http://localhost:8080/user", {
          method: "GET",
          credentials: "include", // Include cookies
        });

        if (response.ok) {
          const data = (await response.json()) as User;
          setUser(data);
        }
      } catch (error) {
        console.error("Failed to verify user", error);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
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
