import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ConfirModal from "../components/ConfirModal";
import StatusBadge from "../components/StatusBadge";
import { useCRM } from "../hooks/useCRM";
import { useToast } from "../hooks/useToast";
import type { Customer, CustomerStatus } from "../types";

type FilterKey = "All" | CustomerStatus;
type SortKey = "Newest" | "Oldest" | "Name";

const filters: FilterKey[] = ["All", "Lead", "Active", "Inactive"];

const SearchIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

const getTone = (status: CustomerStatus) => {
  if (status === "Active") {
    return "active";
  }

  if (status === "Lead") {
    return "lead";
  }

  return "inactive";
};

const sortCustomers = (customers: Customer[], sortKey: SortKey) => {
  const nextCustomers = [...customers];

  if (sortKey === "Name") {
    return nextCustomers.sort((left, right) => left.name.localeCompare(right.name));
  }

  return nextCustomers.sort((left, right) => {
    const leftTime = new Date(left.createdAt).getTime();
    const rightTime = new Date(right.createdAt).getTime();

    return sortKey === "Newest" ? rightTime - leftTime : leftTime - rightTime;
  });
};

const CustomerTablePage: React.FC = () => {
  const {
    customers,
    customersLoading,
    customerError,
    deleteCustomer,
    clearCustomerError,
  } = useCRM();
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("All");
  const [sortBy, setSortBy] = useState<SortKey>("Newest");
  const [customerIdToDelete, setCustomerIdToDelete] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const filteredCustomers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const matchingCustomers = customers.filter((customer) => {
      const matchesFilter =
        activeFilter === "All" || customer.status === activeFilter;

      const matchesSearch =
        normalizedSearch.length === 0 ||
        [customer.name, customer.company, customer.email, customer.city].some(
          (value) => value.toLowerCase().includes(normalizedSearch)
        );

      return matchesFilter && matchesSearch;
    });

    return sortCustomers(matchingCustomers, sortBy);
  }, [activeFilter, customers, search, sortBy]);

  return (
    <section className="flex flex-col gap-6">
      <div className="reveal-card flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--crm-accent-dark)]">
            Customer Directory
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-slate-900">
            Search, sort, and manage customers
          </h1>
        </div>

        <Link
          to="/customers/new"
          className="crm-cta inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(70,198,153,0.22)]"
        >
          Add Customer
        </Link>
      </div>

      {customerError ? (
        <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
          {customerError}
        </div>
      ) : null}

      <div className="reveal-card dashboard-panel flex flex-col gap-4 rounded-[30px] border border-white/80 bg-white/82 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2 rounded-[22px] bg-[linear-gradient(180deg,#f8fbf9,#eef5f1)] p-2 shadow-[inset_0_1px_2px_rgba(15,23,42,0.05)]">
            {filters.map((filter) => {
              const isActive = filter === activeFilter;

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-2xl px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] transition ${
                    isActive
                      ? "bg-white text-[var(--crm-accent-dark)] shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
                      : "text-slate-500 hover:-translate-y-0.5 hover:text-slate-700"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="group flex min-w-0 items-center gap-3 rounded-[22px] border border-white/90 bg-white px-4 py-3 text-slate-400 shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition focus-within:-translate-y-0.5 focus-within:border-emerald-200 focus-within:shadow-[0_18px_40px_rgba(70,198,153,0.12)]">
              <div className="transition group-focus-within:text-[var(--crm-accent-dark)]">
                <SearchIcon />
              </div>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search customers..."
                className="w-full min-w-[220px] bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
              />
            </label>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortKey)}
              className="rounded-[22px] border border-white/90 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.05)] outline-none"
            >
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
              <option value="Name">Name</option>
            </select>
          </div>
        </div>
      </div>

      <section className="reveal-card overflow-hidden rounded-[32px] border border-white/80 bg-white/85 shadow-[0_22px_60px_rgba(15,23,42,0.07)] backdrop-blur-xl">
        <div className="grid grid-cols-[1.2fr_1fr_1.1fr_0.8fr_1.1fr] gap-4 border-b border-[var(--crm-line)] px-6 py-5 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400 max-lg:hidden">
          <span>Name</span>
          <span>Company</span>
          <span>Email</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        <div className="divide-y divide-[var(--crm-line)]">
          {customersLoading ? (
            <div className="px-6 py-16 text-center">
              <p className="font-display text-3xl font-bold text-slate-900">
                Loading customers...
              </p>
            </div>
          ) : null}

          {!customersLoading &&
            filteredCustomers.map((customer) => (
              <div
                key={customer._id}
                className="grid gap-4 px-6 py-5 text-sm text-slate-600 transition hover:bg-emerald-50/30 max-lg:grid-cols-1 lg:grid-cols-[1.2fr_1fr_1.1fr_0.8fr_1.1fr] lg:items-center"
              >
                <div>
                  <p className="font-semibold text-slate-900">{customer.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">
                    {customer.city}
                  </p>
                </div>
                <p>{customer.company}</p>
                <p>{customer.email}</p>
                <StatusBadge
                  label={customer.status}
                  tone={getTone(customer.status)}
                />
                <div className="flex flex-wrap gap-3">
                  <Link
                    to={`/customers/${customer._id}`}
                    className="rounded-full border border-[var(--crm-line)] bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    View
                  </Link>
                  <Link
                    to={`/customers/${customer._id}/edit`}
                    className="rounded-full border border-[var(--crm-line)] bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => setCustomerIdToDelete(customer._id)}
                    className="rounded-full border border-rose-100 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

          {!customersLoading && filteredCustomers.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="font-display text-3xl font-bold text-slate-900">
                No customers found
              </p>
              <p className="mt-3 text-sm text-slate-500">
                There are no customer records matching the current filters yet.
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <ConfirModal
        open={Boolean(customerIdToDelete)}
        title="Delete this customer?"
        message="This will permanently remove the customer record from your CRM workspace."
        confirmLabel={submitting ? "Deleting..." : "Delete"}
        onCancel={() => {
          if (!submitting) {
            setCustomerIdToDelete(null);
          }
        }}
        onConfirm={() => {
          if (!customerIdToDelete) {
            return;
          }

          setSubmitting(true);
          clearCustomerError();
          const customerName =
            customers.find((customer) => customer._id === customerIdToDelete)?.name ??
            "Customer";
          void deleteCustomer(customerIdToDelete)
            .then(() => {
              showToast({
                tone: "success",
                title: "Customer deleted.",
                description: `${customerName} has been removed from the workspace.`,
              });
              setCustomerIdToDelete(null);
            })
            .catch((deleteError) => {
              showToast({
                tone: "error",
                title: "Delete failed.",
                description:
                  deleteError instanceof Error
                    ? deleteError.message
                    : "Customer could not be deleted right now.",
              });
            })
            .finally(() => {
              setSubmitting(false);
            });
        }}
      />
    </section>
  );
};

export default CustomerTablePage;
