import React, { useEffect, useState } from "react";
import { loginUser, getCurrentUser, logoutUser } from "../api/authApi";
import type { AuthUser } from "../types";
import { AuthContext } from "./auth-context";

type LoginOptions = {
  remember?: boolean;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Load session on start
  useEffect(() => {
    const stored = localStorage.getItem("crm_session");

    if (!stored) {
      setLoading(false);
      return;
    }

    const { token, user } = JSON.parse(stored);

    if (token) setToken(token);
    if (user) setUser(user);

    const bootstrap = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        localStorage.removeItem("crm_session");
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const applySession = (token: string, user: AuthUser, remember: boolean) => {
    if (remember) {
      localStorage.setItem(
        "crm_session",
        JSON.stringify({ token, user })
      );
    }
    setToken(token);
    setUser(user);
  };

 const login = async (
    email: string,
    password: string,
    options?: LoginOptions
  ) => {
    setLoading(true);
    try {
      const data = await loginUser(email, password);

      applySession(
        data.token,
        data.user,
        options?.remember ?? true
      );

      return data.user;
    } catch (error: any) {
      // ✅ Re-throw error so the handleSubmit in LoginPage can catch it
      throw error;
    } finally {
      // ✅ Stop loading so the button becomes clickable again
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {}

    localStorage.removeItem("crm_session");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token),
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
