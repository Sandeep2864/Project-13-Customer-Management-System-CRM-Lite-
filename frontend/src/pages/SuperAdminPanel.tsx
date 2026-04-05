import React, { useState, useMemo } from "react";
import ConfirModal from "../components/ConfirModal";
import StatusBadge from "../components/StatusBadge";
import { useCRM } from "../hooks/useCRM";
import { useToast } from "../hooks/useToast";
import type { AdminUserInput } from "../types";

const emptyAdminForm: AdminUserInput = {
  name: "",
  email: "",
  password: "",
  role: "admin",
};

const SuperAdminPanel: React.FC = () => {
  const {
    admins,
    adminsLoading,
    adminError,
    createAdmin,
    toggleAdminStatus,
    deleteAdmin,
    clearAdminError,
  } = useCRM();

  const { showToast } = useToast();
  const [formValues, setFormValues] = useState<AdminUserInput>(emptyAdminForm);
  const [submitting, setSubmitting] = useState(false);
  const [adminIdToDelete, setAdminIdToDelete] = useState<string | null>(null);

  // Stats logic synced with Sequelize "is_active" boolean
  const stats = useMemo(
    () => ({
      total: admins.length,
      active: admins.filter((a) => a.is_active).length,
      inactive: admins.filter((a) => !a.is_active).length,
    }),
    [admins],
  );

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateAdmin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    clearAdminError();

    try {
      const nextAdmin = await createAdmin(formValues);
      showToast({
        tone: "success",
        title: "Admin created.",
        description: `${nextAdmin.name} can now access the CRM workspace.`,
      });
      setFormValues(emptyAdminForm);
    } catch (err) {
      // Error handled by CRMContext/Provider
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="reveal-card">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--crm-accent-dark)]">
          SuperAdmin Panel
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-slate-900">
          Manage System Access
        </h1>
      </div>

      {adminError && (
        <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
          {adminError}
        </div>
      )}

      {/* Stats Section */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Total Admins", stats.total],
          ["Active Seats", stats.active],
          ["Deactivated", stats.inactive],
        ].map(([label, value], index) => (
          <div
            key={String(label)}
            className="reveal-card rounded-[28px] border border-white/80 bg-white/85 p-5 shadow-sm"
            style={{ ["--delay" as string]: `${0.08 * index}s` }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
              {label}
            </p>
            <p className="mt-4 font-display text-4xl font-bold text-slate-900">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Creation Form */}
      <section className="reveal-card rounded-[32px] border border-white/80 bg-white/85 p-6 shadow-sm backdrop-blur-xl">
        <h2 className="font-display text-2xl font-bold text-slate-900">
          Create Admin
        </h2>
        <form
          onSubmit={handleCreateAdmin}
          className="mt-5 grid gap-4 lg:grid-cols-4"
        >
          <input
            name="name"
            value={formValues.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400"
            required
          />
          <input
            name="email"
            type="email"
            value={formValues.email}
            onChange={handleChange}
            placeholder="email@company.com"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400"
            required
          />
          <input
            name="password"
            type="password"
            value={formValues.password}
            onChange={handleChange}
            placeholder="Password"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="crm-cta rounded-2xl font-semibold text-white shadow-lg disabled:opacity-50"
          >
            {submitting ? "Processing..." : "Create Admin"}
          </button>
        </form>
      </section>

      {/* Admins Table */}
      <section className="reveal-card overflow-hidden rounded-[32px] border border-white/80 bg-white/85 shadow-sm">
        <div className="grid grid-cols-[1.2fr_1fr_0.8fr_0.8fr_1fr] gap-4 border-b border-slate-100 px-6 py-5 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400 max-lg:hidden">
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        <div className="divide-y divide-slate-50">
          {adminsLoading ? (
            <div className="px-6 py-16 text-center text-slate-500 font-display text-xl">
              Loading accounts...
            </div>
          ) : (
            admins.map((admin) => (
              <div
                key={admin.id}
                className="grid gap-4 px-6 py-5 text-sm text-slate-600 hover:bg-slate-50/50 lg:grid-cols-[1.2fr_1fr_0.8fr_0.8fr_1fr] lg:items-center"
              >
                <div>
                  <p className="font-semibold text-slate-900">{admin.name}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-widest text-slate-400">
                    ID: {admin.id} • Joined{" "}
                    {new Date(admin.created_at).toLocaleDateString()}
                  </p>
                </div>
                <p className="truncate">{admin.email}</p>
                <StatusBadge
                  label={admin.role}
                  tone={admin.role === "superadmin" ? "info" : "neutral"}
                />

                <StatusBadge
                  label={admin.is_active ? "Active" : "Inactive"}
                  tone={admin.is_active ? "active" : "inactive"}
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      clearAdminError();
                      toggleAdminStatus(admin.id).then((res) => {
                        // res now contains 'name' from the updated backend
                        if (res) {
                          showToast({
                            tone: "success",
                            title: "Status Updated",
                            description: `${res.name} is now ${res.is_active ? "active" : "deactivated"}.`,
                          });
                        }
                      });
                    }}
                    className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold hover:bg-white transition-colors"
                  >
                    Toggle Status
                  </button>
                  {admin.role !== "superadmin" && (
                    <button
                      onClick={() => setAdminIdToDelete(admin.id)}
                      className="rounded-full bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
          {!adminsLoading && admins.length === 0 && (
            <div className="py-20 text-center text-slate-400">
              No administrators found.
            </div>
          )}
        </div>
      </section>

      <ConfirModal
        open={Boolean(adminIdToDelete)}
        title="Remove Admin Access?"
        message="This will permanently delete this admin account. This action cannot be undone."
        onCancel={() => setAdminIdToDelete(null)}
        onConfirm={async () => {
          if (adminIdToDelete === null) return;
          try {
            await deleteAdmin(adminIdToDelete);
            showToast({ tone: "success", title: "Admin Removed" });
            setAdminIdToDelete(null);
          } catch (e) {
            /* Error handled by context */
          }
        }}
      />
    </section>
  );
};

export default SuperAdminPanel;
