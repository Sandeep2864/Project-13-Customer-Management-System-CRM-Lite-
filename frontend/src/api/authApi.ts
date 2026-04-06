import axiosInstance from "./axiosInstance";
import type { AuthUser, LoginResponse } from "../types";

// Auth Basics
export const loginUser = async (email: string, password: string) => {
  const response = await axiosInstance.post<LoginResponse>("api/auth/login", {
    email,
    password,
  });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axiosInstance.get<AuthUser>("api/auth/me");
  return response.data;
};

export const logoutUser = async () => {
  await axiosInstance.post("api/auth/logout");
};
export const forgotPassword = async (email: string) => {
  const res = await axiosInstance.post("api/auth/forgot-password", { email });
  return res.data;
};

export const verifyResetToken = async (token: string) => {
  const res = await axiosInstance.get(
    `api/auth/verify-reset-token?token=${token}`,
  );
  return res.data.valid;
};

export const resetPassword = async (token: string, password: string) => {
  const res = await axiosInstance.post("api/auth/reset-password", {
    token,
    password,
  });
  return res.data;
};
