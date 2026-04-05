  import React, { useEffect, useState } from "react";
  import { isAxiosError } from "axios";
  import { Link, Navigate, useParams } from "react-router-dom";
  import { getCustomer } from "../api/customerApi";
  import StatusBadge from "../components/StatusBadge";
  import { useCRM } from "../hooks/useCRM";
  import type { Customer, CustomerStatus } from "../types";

  const getTone = (status: CustomerStatus) => {
    if (status === "Active") {
      return "active";
    }

    if (status === "Lead") {
      return "lead";
    }

    return "inactive";
  };

  const CustomerProfilePage: React.FC = () => {
    const { customerId } = useParams();
    const { getCustomerById } = useCRM();
    const existingCustomer = customerId ? getCustomerById(customerId) : undefined;
    const [customer, setCustomer] = useState<Customer | null>(existingCustomer ?? null);
    const [loading, setLoading] = useState(!existingCustomer && Boolean(customerId));
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
          }
        } catch (loadError) {
          if (!ignore) {
            setError(
              isAxiosError(loadError)
                ? loadError.response?.data?.message ??
                    "Customer profile could not be loaded."
                : "Customer profile could not be loaded."
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
            Loading customer profile...
          </div>
        </section>
      );
    }

    if (!customer) {
      return (
        <section className="flex flex-col gap-4 rounded-[32px] border border-white/80 bg-white/85 p-8 shadow-[0_22px_60px_rgba(15,23,42,0.07)]">
          <h1 className="font-display text-3xl font-bold text-slate-900">
            Customer profile unavailable
          </h1>
          <p className="text-sm leading-7 text-slate-500">
            {error ??
              "This customer record is not available right now."}
          </p>
          <Link
            to="/customers"
            className="w-fit rounded-full border border-[var(--crm-line)] bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
          >
            Back to Customers
          </Link>
        </section>
      );
    }

    return (
      <section className="flex flex-col gap-6">
        <div className="reveal-card flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--crm-accent-dark)]">
              Customer Profile
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-slate-900">
              {customer.name}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              Review full customer details, track notes, and move this account
              through the CRM pipeline.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/customers"
              className="rounded-full border border-[var(--crm-line)] bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
            >
              Back to Customers
            </Link>
            <Link
              to={`/customers/${customer.id}/edit`}
              className="crm-cta rounded-full px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(70,198,153,0.22)]"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <section className="reveal-card rounded-[32px] border border-white/80 bg-white/85 p-6 shadow-[0_22px_60px_rgba(15,23,42,0.07)] backdrop-blur-xl">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-slate-900">
                  Account Summary
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Created on {new Date(customer.created_at).toLocaleDateString()}
                </p>
              </div>
              <StatusBadge
                label={customer.status}
                tone={getTone(customer.status)}
              />
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {[
                ["Primary Contact", customer.name],
                ["Company", customer.company],
                ["Email", customer.email],
                ["Phone", customer.phone],
                ["City", customer.city],
                ["Status", customer.status],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-[24px] border border-[var(--crm-line)] bg-[linear-gradient(180deg,#ffffff,#f9fbfa)] p-4"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                    {label}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-800">{value}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    );
  };

  export default CustomerProfilePage;
