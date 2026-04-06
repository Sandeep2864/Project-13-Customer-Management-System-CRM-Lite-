import axiosInstance from "./axiosInstance";
import type { Customer, CustomerInput } from "../types";

export const getCustomers = async () => {
  const response = await axiosInstance.get<Customer[]>("/api/customers");
  return response.data;
};

export const getCustomer = async (customerId: string | number) => {
  const response = await axiosInstance.get<Customer>(`/api/customers/${customerId}`);
  return response.data;
};

export const createCustomer = async (input: CustomerInput) => {
  const response = await axiosInstance.post<Customer>("/api/customers", input);
  return response.data;
};

export const updateCustomer = async (customerId: string | number, input: CustomerInput) => {
  const response = await axiosInstance.put<Customer>(
    `/api/customers/${customerId}`,
    input
  );
  return response.data;
};

export const removeCustomer = async (customerId: string | number) => {
  await axiosInstance.delete(`/api/customers/${customerId}`);
};