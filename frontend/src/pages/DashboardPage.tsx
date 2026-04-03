import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../hooks/useAuth";
import { useCRM } from "../hooks/useCRM";
import type { CustomerStatus } from "../types";

type FilterKey = "All" | CustomerStatus;

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

const SparklesIcon = () => (
  <svg
    aria-hidden="true"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
  >
    <path d="m12 3 1.8 4.8L18 9.6l-4.2 1.8L12 16.2l-1.8-4.8L6 9.6l4.2-1.8L12 3Z" />
    <path d="M5 17.5 6 20l2.5 1-2.5 1L5 24l-1-2 2.5-1-2.5-1L5 17.5Z" />
    <path d="M19 13.5 20 16l2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5Z" />
  </svg>
);

const EmptyStateIcon = () => (
  <svg
    aria-hidden="true"
    className="h-12 w-12"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.6"
    viewBox="0 0 24 24"
  >
    <rect x="3" y="4" width="18" height="14" rx="3" />
    <path d="M7 8h6" />
    <path d="M7 12h10" />
    <path d="M9 20h6" />
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

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { customers, customersLoading, customerError } = useCRM();
  const [activeFilter, setActiveFilter] = useState<FilterKey>("All");
  const [search, setSearch] = useState("");

  const filteredCustomers = customers.filter((customer) => {
    const normalizedSearch = search.trim().toLowerCase();
    const matchesFilter =
      activeFilter === "All" || customer.status === activeFilter;
    const matchesSearch =
      normalizedSearch.length === 0 ||
      [
        customer.name,
        customer.company,
        customer.email,
        customer.phone,
        customer.city,
      ].some((value) => value.toLowerCase().includes(normalizedSearch));

    return matchesFilter && matchesSearch;
  });

  const stats = [
    {
      label: "Pipeline Total",
      value: customers.length,
      tone:
        "from-[rgba(74,222,128,0.16)] via-[rgba(255,255,255,0.92)] to-white",
    },
    {
      label: "Active Customers",
      value: customers.filter((customer) => customer.status === "Active").length,
      tone:
        "from-[rgba(56,189,248,0.16)] via-[rgba(255,255,255,0.92)] to-white",
    },
    {
      label: "Warm Leads",
      value: customers.filter((customer) => customer.status === "Lead").length,
      tone:
        "from-[rgba(251,191,36,0.18)] via-[rgba(255,255,255,0.92)] to-white",
    },
  ];

  const newestCustomers = filteredCustomers.slice(0, 5);

  return (
    <section className="flex flex-col gap-6">
      <div
        className="reveal-card flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
        style={{ ["--delay" as string]: "0s" }}
      >
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/75 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--crm-accent-dark)] shadow-[0_14px_30px_rgba(15,23,42,0.05)] backdrop-blur">
            <SparklesIcon />
            Sales command center
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Hello, {user?.name ?? "Admin"} welcome back.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            Track every customer state, move faster through leads, and keep your
            admin workflow calm and readable.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/customers/new")}
          className="crm-cta inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-semibold text-white shadow-[0_20px_45px_rgba(70,198,153,0.28)] transition hover:-translate-y-1"
        >
          Add Customer
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <article
            key={stat.label}
            className={`reveal-card overflow-hidden rounded-[28px] border border-white/80 bg-gradient-to-br ${stat.tone} p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur`}
            style={{ ["--delay" as string]: `${0.08 * (index + 1)}s` }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                  {stat.label}
                </p>
                <p className="mt-4 font-display text-4xl font-bold text-slate-900">
                  {stat.value}
                </p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]" />
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/80">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,var(--crm-accent),#7dd3fc)]"
                style={{
                  width: `${stat.value === 0 ? 12 : Math.min(stat.value * 18, 100)}%`,
                }}
              />
            </div>
          </article>
        ))}
      </div>

      {customerError ? (
        <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
          {customerError}
        </div>
      ) : null}

      <div
        className="reveal-card dashboard-panel flex flex-col gap-4 rounded-[30px] border border-white/80 bg-white/78 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl"
        style={{ ["--delay" as string]: "0.28s" }}
      >
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

          <label className="group flex min-w-0 items-center gap-3 rounded-[22px] border border-white/90 bg-white px-4 py-3 text-slate-400 shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition focus-within:-translate-y-0.5 focus-within:border-emerald-200 focus-within:shadow-[0_18px_40px_rgba(70,198,153,0.12)] xl:w-[340px]">
            <div className="transition group-focus-within:text-[var(--crm-accent-dark)]">
              <SearchIcon />
            </div>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search database..."
              className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
          </label>
        </div>
      </div>

      <section
        className="reveal-card relative overflow-hidden rounded-[32px] border border-white/80 bg-white/82 shadow-[0_22px_60px_rgba(15,23,42,0.07)] backdrop-blur-xl"
        style={{ ["--delay" as string]: "0.38s" }}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
        <div className="grid grid-cols-[1.4fr_1fr_1.2fr_0.8fr_0.8fr] gap-4 border-b border-[var(--crm-line)] px-6 py-5 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400 max-lg:hidden">
          <span>Customer Name</span>
          <span>Company</span>
          <span>Contact Info</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {customersLoading ? (
          <div className="flex min-h-[300px] items-center justify-center px-6 py-16 text-center">
            <p className="font-display text-2xl text-slate-400">
              Loading customer pipeline...
            </p>
          </div>
        ) : newestCustomers.length > 0 ? (
          <div className="divide-y divide-[var(--crm-line)]">
            {newestCustomers.map((customer) => (
              <div
                key={customer._id}
                className="grid gap-4 px-6 py-5 text-sm text-slate-600 transition hover:bg-emerald-50/30 max-lg:grid-cols-1 lg:grid-cols-[1.4fr_1fr_1.2fr_0.8fr_0.8fr] lg:items-center"
              >
                <div>
                  <p className="font-semibold text-slate-900">{customer.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">
                    {customer.city}
                  </p>
                </div>
                <p>{customer.company}</p>
                <div className="space-y-1">
                  <p>{customer.email}</p>
                  <p className="text-slate-400">{customer.phone}</p>
                </div>
                <StatusBadge label={customer.status} tone={getTone(customer.status)} />
                <button
                  type="button"
                  onClick={() => navigate(`/customers/${customer._id}`)}
                  className="w-fit rounded-full border border-[var(--crm-line)] bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative flex min-h-[360px] items-center justify-center px-6 py-16 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(70,198,153,0.08),transparent_48%)]" />
            <div className="relative mx-auto max-w-md">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] bg-[linear-gradient(180deg,#ffffff,#eefcf6)] text-[var(--crm-accent-dark)] shadow-[0_18px_35px_rgba(70,198,153,0.14)]">
                <EmptyStateIcon />
              </div>
              <h2 className="mt-6 font-display text-3xl font-bold text-slate-900">
                No matches found
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                Connect your backend and this dashboard will populate with
                customer records, status changes, and searchable notes.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveFilter("All");
                    setSearch("");
                  }}
                  className="rounded-full border border-[var(--crm-line)] bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700"
                >
                  Reset Filters
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/customers/new")}
                  className="crm-cta rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(70,198,153,0.22)]"
                >
                  Add First Customer
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </section>
  );
};

export default DashboardPage;
