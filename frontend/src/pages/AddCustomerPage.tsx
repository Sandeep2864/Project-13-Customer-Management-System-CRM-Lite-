import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerForm from "../components/CustomerForm";
import { emptyCustomerInput } from "../data/mockData";
import { useCRM } from "../hooks/useCRM";
import type { CustomerInput } from "../types";

const AddCustomerPage: React.FC = () => {
  const navigate = useNavigate();
  const { addCustomer, clearCustomerError } = useCRM();
  const [values, setValues] = useState<CustomerInput>(emptyCustomerInput);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    clearCustomerError();

    try {
      const nextCustomer = await addCustomer(values);
      navigate(`/customers/${nextCustomer._id}`);
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Customer could not be created right now.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CustomerForm
      title="Add a new customer"
      description="Create a fresh customer record and keep your sales pipeline organized from the start."
      submitLabel="Save Customer"
      values={values}
      isSubmitting={submitting}
      errorMessage={error}
      secondaryAction={
        <button
          type="button"
          onClick={() => navigate("/customers")}
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

export default AddCustomerPage;
