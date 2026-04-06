import axiosInstance from "./axiosInstance";
import type { AdminUser, AdminUserInput } from "../types";

export const getAdmins = async () => {
  const response = await axiosInstance.get<AdminUser[]>("/api/users");
  return response.data;
};

export const createAdmin = async (input: AdminUserInput) => {
  const response = await axiosInstance.post<AdminUser>("/api/users", input);
  return response.data;
};

// Updated to accept string or number for Sequelize IDs
export const toggleAdmin = async (adminId: string | number) => {
  const response = await axiosInstance.patch<AdminUser>(
    `/api/users/${adminId}/toggle`
  );
  return response.data;
};

export const removeAdmin = async (adminId: string | number) => {
  await axiosInstance.delete(`/api/users/${adminId}`);
};