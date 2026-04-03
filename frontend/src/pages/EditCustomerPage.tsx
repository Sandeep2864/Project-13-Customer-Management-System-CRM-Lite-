import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { isAxiosError } from "axios";
import { getCustomer } from "../api/customerApi";
import CustomerForm from "../components/CustomerForm";
import { useCRM } from "../hooks/useCRM";
import { useToast } from "../hooks/useToast";
import type { Customer, CustomerInput } from "../types";

const mapCustomerToInput = (customer: Customer): CustomerInput => ({
  name: customer.name,
  company: customer.company,
  email: customer.email,
  phone: customer.phone,
  city: customer.city,
  status: customer.status,
  notes: customer.notes ?? "",
});

const EditCustomerPage: React.FC = () => {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const { getCustomerById, updateCustomer, clearCustomerError } = useCRM();
  const { showToast } = useToast();
  const existingCustomer = customerId ? getCustomerById(customerId) : undefined;
  const [customer, setCustomer] = useState<Customer | null>(existingCustomer ?? null);
  const [values, setValues] = useState<CustomerInput | null>(
    existingCustomer ? mapCustomerToInput(existingCustomer) : null
  );
  const [loading, setLoading] = useState(!existingCustomer && Boolean(customerId));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId || existingCustomer) {
      return;
    }

    let ignore = false;

    const loadCustomer = async () => {
      setLoading(true);

      try {
        const response = await getCustomer(customerId);

        if (!ignore) {
          setCustomer(response);
          setValues(mapCustomerToInput(response));
        }
      } catch (loadError) {
        if (!ignore) {
          setError(
            isAxiosError(loadError)
              ? loadError.response?.data?.message ??
                  "Customer could not be loaded from the backend."
              : "Customer could not be loaded from the backend."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void loadCustomer();

    return () => {
      ignore = true;
    };
  }, [customerId, existingCustomer]);

  if (!customerId) {
    return <Navigate to="/customers" replace />;
  }

  if (loading) {
    return (
      <section className="flex min-h-[300px] items-center justify-center">
        <div className="rounded-full border border-[var(--crm-line)] bg-white px-5 py-3 text-sm font-semibold text-slate-500 shadow-sm">
          Loading customer...
        </div>
      </section>
    );
  }

  if (!customer || !values) {
    return (
      <section className="flex flex-col gap-4 rounded-[32px] border border-white/80 bg-white/85 p-8 shadow-[0_22px_60px_rgba(15,23,42,0.07)]">
        <h1 className="font-display text-3xl font-bold text-slate-900">
          Customer not available
        </h1>
        <p className="text-sm leading-7 text-slate-500">
          Connect the backend and load customer data before editing this record.
        </p>
        <button
          type="button"
          onClick={() => navigate("/customers")}
          className="w-fit rounded-full border border-[var(--crm-line)] bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
        >
          Back to Customers
        </button>
      </section>
    );
  }

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setValues((currentValues) =>
      currentValues ? { ...currentValues, [name]: value } : currentValues
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    clearCustomerError();

    try {
      const updatedCustomer = await updateCustomer(customerId, values);

      if (updatedCustomer) {
        showToast({
          tone: "success",
          title: "Customer updated.",
          description: `${updatedCustomer.name} has been updated successfully.`,
        });
        navigate(`/customers/${updatedCustomer._id}`);
      }
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Customer could not be updated right now.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CustomerForm
      title={`Edit ${customer.name}`}
      description="Update customer details, account state, and notes without leaving the shared workspace."
      submitLabel="Update Customer"
      values={values}
      isSubmitting={submitting}
      errorMessage={error}
      secondaryAction={
        <button
          type="button"
          onClick={() => navigate(`/customers/${customer._id}`)}
          className="rounded-full border border-[var(--crm-line)] bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
        >
          Cancel
        </button>
      }
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
};

export default EditCustomerPage;
