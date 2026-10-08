import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { loginAdmin, logoutAdmin } from "../api/authApi";

const AUTH_STORAGE_KEY = "newket-admin-name";

interface AuthContextValue {
  adminName: string | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [adminName, setAdminName] = useState<string | null>(() =>
    localStorage.getItem(AUTH_STORAGE_KEY),
  );

  const clearAuth = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAdminName(null);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const name = await loginAdmin({ username, password });
    localStorage.setItem(AUTH_STORAGE_KEY, name);
    setAdminName(name);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutAdmin();
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  const value = useMemo(
    () => ({
      adminName,
      isLoggedIn: Boolean(adminName),
      login,
      logout,
    }),
    [adminName, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth는 AuthProvider 안에서만 사용할 수 있습니다.");
  }

  return context;
}
