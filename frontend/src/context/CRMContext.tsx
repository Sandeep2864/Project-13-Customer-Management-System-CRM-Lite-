import React, { useCallback, useEffect, useState } from "react";
import { isAxiosError } from "axios";
import {
  createAdmin as createAdminRequest,
  getAdmins as getAdminsRequest,
  removeAdmin,
  toggleAdmin,
} from "../api/adminApi";
import {
  createCustomer as createCustomerRequest,
  getCustomers as getCustomersRequest,
  removeCustomer,
  updateCustomer as updateCustomerRequest,
} from "../api/customerApi";
import { useAuth } from "../hooks/useAuth";
import type {
  AdminUser,
  AdminUserInput,
  Customer,
  CustomerInput,
} from "../types";
import { CRMContext } from "./crm-context";

const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (isAxiosError(error)) {
    return error.response?.data?.message ?? fallback;
  }
  return fallback;
};

export const CRMProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [adminsLoading, setAdminsLoading] = useState(false);
  const [customerError, setCustomerError] = useState<string | null>(null);
  const [adminError, setAdminError] = useState<string | null>(null);
  const userRole =
    typeof user === "object" &&
    user !== null &&
    "role" in user &&
    typeof (user as { role?: unknown }).role === "string"
      ? (user as { role: string }).role
      : undefined;

  const fetchCustomers = useCallback(async () => {
    if (!isAuthenticated) {
      setCustomers([]);
      return [];
    }

    setCustomersLoading(true);
    setCustomerError(null);

    try {
      const nextCustomers = await getCustomersRequest();
      setCustomers(nextCustomers);
      return nextCustomers;
    } catch (error) {
      setCustomers([]);
      setCustomerError(
        getApiErrorMessage(error, "Customers could not be loaded."),
      );
      return [];
    } finally {
      setCustomersLoading(false);
    }
  }, [isAuthenticated]);

  const fetchAdmins = useCallback(async () => {
    if (!isAuthenticated || userRole !== "superadmin") {
      setAdmins([]);
      return [];
    }

    setAdminsLoading(true);
    setAdminError(null);

    try {
      const nextAdmins = await getAdminsRequest();
      setAdmins(nextAdmins);
      return nextAdmins;
    } catch (error) {
      setAdmins([]);
      setAdminError(
        getApiErrorMessage(error, "Admin accounts could not be loaded."),
      );
      return [];
    } finally {
      setAdminsLoading(false);
    }
  }, [isAuthenticated, userRole]);

  useEffect(() => {
    if (!isAuthenticated) {
      setCustomers([]);
      setAdmins([]);
      setCustomerError(null);
      setAdminError(null);
      return;
    }

    void fetchCustomers();

    if (userRole === "superadmin") {
      void fetchAdmins();
    } else {
      setAdmins([]);
      setAdminError(null);
    }
  }, [fetchAdmins, fetchCustomers, isAuthenticated, userRole]);

  const addCustomer = async (input: CustomerInput) => {
    try {
      const nextCustomer = await createCustomerRequest(input);
      setCustomers((current) => [nextCustomer, ...current]);
      return nextCustomer;
    } catch (error) {
      setCustomerError(getApiErrorMessage(error, "Failed to create customer."));
      throw error;
    }
  };

  const updateCustomer = async (
    customerId: string | number,
    input: CustomerInput,
  ) => {
    try {
      const updated = await updateCustomerRequest(String(customerId), input);
      setCustomers((current) =>
        current.map((c) => (c.id == customerId ? updated : c)),
      );
      return updated;
    } catch (error) {
      setCustomerError(getApiErrorMessage(error, "Failed to update customer."));
      throw error;
    }
  };

  const deleteCustomer = async (customerId: string | number) => {
    try {
      await removeCustomer(String(customerId));
      setCustomers((current) => current.filter((c) => c.id != customerId));
    } catch (error) {
      setCustomerError(getApiErrorMessage(error, "Failed to delete customer."));
      throw error;
    }
  };

  const createAdmin = async (input: AdminUserInput) => {
    try {
      const nextAdmin = await createAdminRequest(input);
      setAdmins((current) => [nextAdmin, ...current]);
      return nextAdmin;
    } catch (error) {
      setAdminError(getApiErrorMessage(error, "Failed to create admin."));
      throw error;
    }
  };

  const toggleAdminStatus = async (adminId: string | number) => {
    try {
      const updatedAdmin = await toggleAdmin(String(adminId));
      setAdmins((current) =>
        current.map((a) => (a.id == adminId ? updatedAdmin : a)),
      );
      return updatedAdmin;
    } catch (error) {
      setAdminError(
        getApiErrorMessage(error, "Failed to update admin status."),
      );
      throw error;
    }
  };

  const deleteAdmin = async (adminId: string | number) => {
    try {
      await removeAdmin(String(adminId));
      setAdmins((current) => current.filter((a) => a.id != adminId));
    } catch (error) {
      setAdminError(getApiErrorMessage(error, "Failed to delete admin."));
      throw error;
    }
  };

  const getCustomerById = (customerId: string | number) =>
    customers.find((c) => c.id == customerId);

  return (
    <CRMContext.Provider
      value={{
        customers,
        admins,
        customersLoading,
        adminsLoading,
        customerError,
        adminError,
        fetchCustomers,
        fetchAdmins,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        getCustomerById,
        createAdmin,
        toggleAdminStatus,
        deleteAdmin,
        clearCustomerError: () => setCustomerError(null),
        clearAdminError: () => setAdminError(null),
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};
