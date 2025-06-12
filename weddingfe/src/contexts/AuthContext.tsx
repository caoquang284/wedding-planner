import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { login, getNguoiDung, refreshToken } from "../../Api/nguoiDungApi";

interface User {
  id: number;
  maNhom: number;
  tenNguoiDung: string;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // Thử làm mới token nếu accessToken hết hạn
        const refreshTokenValue = localStorage.getItem("refreshToken") || "";
        if (refreshTokenValue) {
          refreshToken({ refreshToken: refreshTokenValue })
            .then((newTokens) => {
              localStorage.setItem("accessToken", newTokens.accessToken);
              localStorage.setItem("refreshToken", newTokens.refreshToken);
              getNguoiDung().then((userData) => {
                localStorage.setItem("user", JSON.stringify(userData));
                setUser(userData);
              });
            })
            .catch(() => {
              localStorage.clear();
              setUser(null);
            });
        }
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};