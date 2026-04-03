import type { CustomerInput } from "../types";

export const STORAGE_KEYS = {
  token: "crm-lite-token",
  user: "crm-lite-user",
} as const;

export const emptyCustomerInput: CustomerInput = {
  name: "",
  company: "",
  email: "",
  phone: "",
  city: "",
  status: "Lead",
  notes: "",
};
