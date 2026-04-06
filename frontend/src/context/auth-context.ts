import { createContext } from "react";
import type { AuthUser } from "../types";

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
    options?: { remember?: boolean },
  ) => Promise<AuthUser>;
  logout: () => Promise<void>;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
