import React, { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { getCurrentUser, loginUser, logoutUser } from "../api/authApi";
import type { AuthUser, LoginOptions } from "../types";
import {
  clearStoredSession,
  persistSession,
  readStoredSession,
} from "../utils/authStorage";
import { AuthContext } from "./auth-context";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedSession = readStoredSession();

    if (storedSession.token) {
      setToken(storedSession.token);
    }

    if (storedSession.user) {
      setUser(storedSession.user);
    }

    if (!storedSession.token) {
      setLoading(false);
      return;
    }

    let ignore = false;

    const bootstrapAuth = async () => {
      try {
        const currentUser = await getCurrentUser();

        if (!ignore) {
          persistSession(
            storedSession.token,
            currentUser,
            storedSession.remember
          );
          setUser(currentUser);
        }
      } catch {
        if (!ignore) {
          clearStoredSession();
          setToken(null);
          setUser(null);
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

  const applySession = (
    nextToken: string,
    nextUser: AuthUser,
    remember: boolean
  ) => {
    persistSession(nextToken, nextUser, remember);
    setToken(nextToken);
    setUser(nextUser);
  };

  const login = async (
    email: string,
    password: string,
    options?: LoginOptions
  ) => {
    setLoading(true);

    try {
      const payload = await loginUser(email, password);
      applySession(payload.token, payload.user, options?.remember ?? true);
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
    clearStoredSession();
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
