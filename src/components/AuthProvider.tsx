import { createContext, useContext, useMemo, useState, useCallback, type ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("ai-compass-auth") === "true";
  });

  const logout = useCallback(() => {
    localStorage.removeItem("ai-compass-auth");
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(() => ({ isAuthenticated, logout }), [isAuthenticated, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}