import axiosInstance from "./axiosInstance";
import type { AuthUser, LoginResponse } from "../types";

export const loginUser = async (email: string, password: string) => {
  const response = await axiosInstance.post<LoginResponse>("/api/auth/login", {
    email,
    password,
  });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axiosInstance.get<AuthUser>("/api/auth/me");
  return response.data;
};

export const logoutUser = async () => {
  await axiosInstance.post("/api/auth/logout");
};

export const requestPasswordReset = async (email: string) => {
  const response = await axiosInstance.post("/api/auth/forgot-password", { email });
  return response.data;
};
