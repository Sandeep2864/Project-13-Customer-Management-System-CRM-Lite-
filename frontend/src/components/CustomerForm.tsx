import React from "react";
import type { CustomerInput } from "../types";

interface CustomerFormProps {
  title: string;
  description: string;
  submitLabel: string;
  values: CustomerInput;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  secondaryAction?: React.ReactNode;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const inputClassName =
  "w-full rounded-2xl border border-[var(--crm-line)] bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-emerald-200 focus:shadow-[0_0_0_4px_rgba(70,198,153,0.08)]";

const CustomerForm: React.FC<CustomerFormProps> = ({
  title,
  description,
  submitLabel,
  values,
  isSubmitting = false,
  errorMessage,
  secondaryAction,
  onChange,
  onSubmit,
}) => {
  return (
    <section className="flex flex-col gap-6">
      <div className="reveal-card">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--crm-accent-dark)]">
          Customer Workspace
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
          {description}
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="reveal-card dashboard-panel rounded-[32px] border border-white/80 bg-white/82 p-6 shadow-[0_22px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl"
      >
        {errorMessage ? (
          <div className="mb-5 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-600">
              Customer Name
            </span>
            <input
              name="name"
              value={values.name}
              onChange={onChange}
              type="text"
              placeholder="Alicia Stone"
              className={inputClassName}
              required
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-600">Company</span>
            <input
              name="company"
              value={values.company}
              onChange={onChange}
              type="text"
              placeholder="Vertex Studio"
              className={inputClassName}
              required
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-600">Email</span>
            <input
              name="email"
              value={values.email}
              onChange={onChange}
              type="email"
              placeholder="client@company.com"
              className={inputClassName}
              required
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-600">Phone</span>
            <input
              name="phone"
              value={values.phone}
              onChange={onChange}
              type="tel"
              placeholder="+91 98765 43210"
              className={inputClassName}
              required
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-600">City</span>
            <input
              name="city"
              value={values.city}
              onChange={onChange}
              type="text"
              placeholder="Bengaluru"
              className={inputClassName}
              required
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-600">Status</span>
            <select
              name="status"
              value={values.status}
              onChange={onChange}
              className={inputClassName}
            >
              <option value="Lead">Lead</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>
        </div>

        <label className="mt-5 block space-y-2">
          <span className="text-sm font-semibold text-slate-600">Notes</span>
          <textarea
            name="notes"
            value={values.notes ?? ""}
            onChange={onChange}
            rows={5}
            placeholder="Add context about this customer, recent conversations, or next steps."
            className="w-full rounded-[24px] border border-[var(--crm-line)] bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-emerald-200 focus:shadow-[0_0_0_4px_rgba(70,198,153,0.08)]"
          />
        </label>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="crm-cta rounded-full px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(70,198,153,0.22)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </button>
          {secondaryAction}
        </div>
      </form>
    </section>
  );
};

export default CustomerForm;
