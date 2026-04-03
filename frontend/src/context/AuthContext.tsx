import React, { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { getCurrentUser, loginUser, logoutUser } from "../api/authApi";
import { STORAGE_KEYS } from "../data/mockData";
import type { AuthUser } from "../types";
import { AuthContext } from "./auth-context";

const readStoredUser = () => {
  const storedUser = localStorage.getItem(STORAGE_KEYS.user);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.token);
    const storedUser = readStoredUser();

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUser) {
      setUser(storedUser);
    }

    if (!storedToken) {
      setLoading(false);
      return;
    }

    let ignore = false;

    const bootstrapAuth = async () => {
      try {
        const currentUser = await getCurrentUser();

        if (!ignore) {
          localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(currentUser));
          setUser(currentUser);
        }
      } catch {
        if (!ignore && !storedUser) {
          localStorage.removeItem(STORAGE_KEYS.token);
          setToken(null);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void bootstrapAuth();

    return () => {
      ignore = true;
    };
  }, []);

  const persistSession = (nextToken: string, nextUser: AuthUser) => {
    localStorage.setItem(STORAGE_KEYS.token, nextToken);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const login = async (email: string, password: string) => {
    setLoading(true);

    try {
      const payload = await loginUser(email, password);
      persistSession(payload.token, payload.user);
      return payload.user;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ??
            "Login failed. Check your backend URL and credentials."
        );
      }

      throw new Error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    void logoutUser().catch(() => undefined);
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.user);
    setToken(null);
    setUser(null);
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
