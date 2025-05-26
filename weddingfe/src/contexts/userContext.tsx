// src/contexts/userContext.tsx
import { createContext, useContext, useState } from "react";

type UserType = { role: "admin" | "user" } | null;

interface UserContextType {
  user: UserType;
  toggleRole: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType>(null); 

  const toggleRole = () => {
    setUser((prev) =>
      prev?.role === "admin"
        ? { role: "user" }
        : { role: "admin" } // Giả lập chuyển giữa admin và user
    );
  };

  return (
    <UserContext.Provider value={{ user, toggleRole }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
