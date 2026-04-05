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
        getApiErrorMessage(
          error,
          "Customers could not be loaded right now."
        )
      );
      return [];
    } finally {
      setCustomersLoading(false);
    }
  }, [isAuthenticated]);

  const fetchAdmins = useCallback(async () => {
    if (!isAuthenticated || user?.role !== "superadmin") {
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
        getApiErrorMessage(
          error,
          "Admin accounts could not be loaded right now."
        )
      );
      return [];
    } finally {
      setAdminsLoading(false);
    }
  }, [isAuthenticated, user?.role]);

  useEffect(() => {
    if (!isAuthenticated) {
      setCustomers([]);
      setAdmins([]);
      setCustomerError(null);
      setAdminError(null);
      return;
    }

    void fetchCustomers();

    if (user?.role === "superadmin") {
      void fetchAdmins();
    } else {
      setAdmins([]);
      setAdminError(null);
    }
  }, [fetchAdmins, fetchCustomers, isAuthenticated, user?.role]);

  const addCustomer = async (input: CustomerInput) => {
    try {
      const nextCustomer = await createCustomerRequest(input);
      setCustomers((currentCustomers) => [nextCustomer, ...currentCustomers]);
      return nextCustomer;
    } catch (error) {
      setCustomerError(
        getApiErrorMessage(error, "Customer could not be created right now.")
      );
      throw error;
    }
  };

  const updateCustomer = async (customerId: string, input: CustomerInput) => {
    try {
      const updatedCustomer = await updateCustomerRequest(customerId, input);
      setCustomers((currentCustomers) =>
        currentCustomers.map((customer) =>
          customer._id === customerId ? updatedCustomer : customer
        )
      );
      return updatedCustomer;
    } catch (error) {
      setCustomerError(
        getApiErrorMessage(error, "Customer could not be updated right now.")
      );
      throw error;
    }
  };

  const deleteCustomer = async (customerId: string) => {
    try {
      await removeCustomer(customerId);
      setCustomers((currentCustomers) =>
        currentCustomers.filter((customer) => customer._id !== customerId)
      );
    } catch (error) {
      setCustomerError(
        getApiErrorMessage(error, "Customer could not be deleted right now.")
      );
      throw error;
    }
  };

  const createAdmin = async (input: AdminUserInput) => {
    try {
      const nextAdmin = await createAdminRequest(input);
      setAdmins((currentAdmins) => [nextAdmin, ...currentAdmins]);
      return nextAdmin;
    } catch (error) {
      setAdminError(
        getApiErrorMessage(error, "Admin account could not be created right now.")
      );
      throw error;
    }
  };

  const toggleAdminStatus = async (adminId: string) => {
    try {
      const updatedAdmin = await toggleAdmin(adminId);
      setAdmins((currentAdmins) =>
        currentAdmins.map((admin) =>
          admin._id === adminId ? updatedAdmin : admin
        )
      );
      return updatedAdmin;
    } catch (error) {
      setAdminError(
        getApiErrorMessage(error, "Admin status could not be updated right now.")
      );
      throw error;
    }
  };

  const deleteAdmin = async (adminId: string) => {
    try {
      await removeAdmin(adminId);
      setAdmins((currentAdmins) =>
        currentAdmins.filter((admin) => admin._id !== adminId)
      );
    } catch (error) {
      setAdminError(
        getApiErrorMessage(error, "Admin account could not be deleted right now.")
      );
      throw error;
    }
  };

  const getCustomerById = (customerId: string) =>
    customers.find((customer) => customer._id === customerId);

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
