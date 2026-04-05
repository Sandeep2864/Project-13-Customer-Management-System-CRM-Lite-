import React, { useState } from "react";
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
  const activeAdmins = admins.filter((admin) => admin.status === "Active").length;
  const pendingAdmins = admins.filter((admin) => admin.status === "Pending").length;

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormValues((currentValues) => ({ ...currentValues, [name]: value }));
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
    } catch {
      // The provider already stores the message in adminError.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="reveal-card flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--crm-accent-dark)]">
            SuperAdmin Panel
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-slate-900">
            Create and manage admin accounts
          </h1>
        </div>
      </div>

      {adminError ? (
        <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
          {adminError}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Total Admins", admins.length],
          ["Active Seats", activeAdmins],
          ["Pending Invites", pendingAdmins],
        ].map(([label, value], index) => (
          <div
            key={String(label)}
            className="reveal-card rounded-[28px] border border-white/80 bg-white/85 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)]"
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

      <section className="reveal-card rounded-[32px] border border-white/80 bg-white/85 p-6 shadow-[0_22px_60px_rgba(15,23,42,0.07)] backdrop-blur-xl">
        <h2 className="font-display text-2xl font-bold text-slate-900">
          Create Admin
        </h2>
        <form onSubmit={handleCreateAdmin} className="mt-5 grid gap-4 lg:grid-cols-4">
          <input
            name="name"
            value={formValues.name}
            onChange={handleChange}
            placeholder="Admin name"
            className="rounded-2xl border border-[var(--crm-line)] bg-white px-4 py-3 text-sm text-slate-700 outline-none"
            required
          />
          <input
            name="email"
            type="email"
            value={formValues.email}
            onChange={handleChange}
            placeholder="admin@company.com"
            className="rounded-2xl border border-[var(--crm-line)] bg-white px-4 py-3 text-sm text-slate-700 outline-none"
            required
          />
          <input
            name="password"
            type="password"
            value={formValues.password}
            onChange={handleChange}
            placeholder="Temporary password"
            className="rounded-2xl border border-[var(--crm-line)] bg-white px-4 py-3 text-sm text-slate-700 outline-none"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="crm-cta rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(70,198,153,0.22)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Creating 🚀..." : "Create Admin"}
          </button>
        </form>
      </section>

      <section className="reveal-card overflow-hidden rounded-[32px] border border-white/80 bg-white/85 shadow-[0_22px_60px_rgba(15,23,42,0.07)] backdrop-blur-xl">
        <div className="grid grid-cols-[1.1fr_1fr_0.8fr_0.8fr_1fr] gap-4 border-b border-[var(--crm-line)] px-6 py-5 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400 max-lg:hidden">
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        <div className="divide-y divide-[var(--crm-line)]">
          {adminsLoading ? (
            <div className="px-6 py-16 text-center">
              <p className="font-display text-3xl font-bold text-slate-900">
                Loading admins...
              </p>
            </div>
          ) : null}

          {!adminsLoading &&
            admins.map((admin) => (
              <div
                key={admin._id}
                className="grid gap-4 px-6 py-5 text-sm text-slate-600 transition hover:bg-emerald-50/30 max-lg:grid-cols-1 lg:grid-cols-[1.1fr_1fr_0.8fr_0.8fr_1fr] lg:items-center"
              >
                <div>
                  <p className="font-semibold text-slate-900">{admin.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">
                    Joined {new Date(admin.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p>{admin.email}</p>
                <StatusBadge
                  label={admin.role === "superadmin" ? "Super Admin" : "Admin"}
                  tone={admin.role === "superadmin" ? "info" : "neutral"}
                />
                <StatusBadge
                  label={admin.status}
                  tone={
                    admin.status === "Active"
                      ? "active"
                      : admin.status === "Pending"
                        ? "warning"
                        : "inactive"
                  }
                />
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      clearAdminError();
                      void toggleAdminStatus(admin._id)
                        .then((updatedAdmin) => {
                          if (!updatedAdmin) {
                            return;
                          }

                          showToast({
                            tone: "success",
                            title: "Admin status updated.",
                            description: `${updatedAdmin.name} is now ${updatedAdmin.status.toLowerCase()}.`,
                          });
                        })
                        .catch((toggleError) => {
                          showToast({
                            tone: "error",
                            title: "Status update failed.",
                            description:
                              toggleError instanceof Error
                                ? toggleError.message
                                : "Admin status could not be updated right now.",
                          });
                        });
                    }}
                    className="rounded-full border border-[var(--crm-line)] bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    Toggle Active
                  </button>
                  {admin.role !== "superadmin" ? (
                    <button
                      type="button"
                      onClick={() => setAdminIdToDelete(admin._id)}
                      className="rounded-full border border-rose-100 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
                    >
                      Delete
                    </button>
                  ) : null}
                </div>
              </div>
            ))}

          {!adminsLoading && admins.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="font-display text-3xl font-bold text-slate-900">
                No admin accounts loaded
              </p>
              <p className="mt-3 text-sm text-slate-500">
                No admin accounts are available yet.
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <ConfirModal
        open={Boolean(adminIdToDelete)}
        title="Delete this admin?"
        message="This action will send a delete request to your backend. SuperAdmin records remain protected."
        onCancel={() => setAdminIdToDelete(null)}
        onConfirm={() => {
          if (!adminIdToDelete) {
            return;
          }

          clearAdminError();
          const adminName =
            admins.find((admin) => admin._id === adminIdToDelete)?.name ?? "Admin";
          void deleteAdmin(adminIdToDelete)
            .then(() => {
              showToast({
                tone: "success",
                title: "Admin deleted.",
                description: `${adminName} has been removed successfully.`,
              });
              setAdminIdToDelete(null);
            })
            .catch((deleteError) => {
              showToast({
                tone: "error",
                title: "Delete failed.",
                description:
                  deleteError instanceof Error
                    ? deleteError.message
                    : "Admin account could not be deleted right now.",
              });
            });
        }}
      />
    </section>
  );
};

export default SuperAdminPanel;
