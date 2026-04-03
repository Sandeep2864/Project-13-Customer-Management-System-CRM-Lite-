import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const navItems = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Customers", to: "/customers" },
  { label: "Add Customer", to: "/customers/new" },
  { label: "Manage Admins", to: "/admins", role: "superadmin" as const },
];

const MenuIcon = ({ open }: { open: boolean }) => (
  <svg
    aria-hidden="true"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    {open ? (
      <>
        <path d="m6 6 12 12" />
        <path d="M18 6 6 18" />
      </>
    ) : (
      <>
        <path d="M4 7h16" />
        <path d="M4 12h16" />
        <path d="M4 17h16" />
      </>
    )}
  </svg>
);

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const visibleNavItems = navItems.filter(
    (item) => !item.role || item.role === user?.role
  );

  const initial = user?.name?.charAt(0).toUpperCase() ?? "S";
  const sectionLabel =
    visibleNavItems.find((item) => {
      if (item.to === "/customers") {
        return (
          location.pathname === "/customers" ||
          location.pathname.startsWith("/customers/")
        );
      }

      return location.pathname === item.to;
    })?.label ?? "Workspace";

  const isItemActive = (target: string) => {
    if (target === "/dashboard") {
      return location.pathname === "/dashboard";
    }

    if (target === "/customers") {
      return location.pathname === "/customers";
    }

    if (target === "/customers/new") {
      return location.pathname === "/customers/new";
    }

    if (target === "/admins") {
      return location.pathname.startsWith("/admins");
    }

    return false;
  };

  const handleNavigate = (target: string) => {
    navigate(target);
    setIsOpen(false);
  };

  return (
    <header className="relative z-20 border-b border-[var(--crm-line)] bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => handleNavigate("/dashboard")}
            className="flex items-center gap-3 text-left"
          >
            <div className="crm-logo-glow flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--crm-accent),var(--crm-accent-dark))] text-lg font-bold text-white">
              C
            </div>
            <div>
              <p className="font-display text-2xl font-bold tracking-tight text-slate-800">
                CRMLite
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                {sectionLabel}
              </p>
            </div>
          </button>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 rounded-full border border-white/80 bg-white/80 px-3 py-2 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:flex">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f1f5f9,#ffffff)] text-sm font-bold uppercase text-slate-500 shadow-sm">
                {initial}
              </div>
              <div className="leading-tight">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--crm-accent)]">
                  {user?.role === "superadmin" ? "Super Admin" : "Admin"}
                </p>
                <p className="text-sm font-semibold text-slate-700">
                  {user?.name ?? "Workspace User"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="hidden rounded-full border border-[var(--crm-line)] bg-white/90 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:text-slate-900 sm:inline-flex"
            >
              Logout
            </button>

            <button
              type="button"
              onClick={() => setIsOpen((currentState) => !currentState)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--crm-line)] bg-white text-slate-600 shadow-sm transition hover:text-slate-900 sm:hidden"
            >
              <MenuIcon open={isOpen} />
            </button>
          </div>
        </div>

        <nav
          className={`${
            isOpen ? "flex" : "hidden"
          } flex-col gap-2 rounded-[28px] border border-white/70 bg-white/80 p-3 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:flex sm:flex-row sm:flex-wrap sm:items-center sm:gap-2 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none`}
        >
          {visibleNavItems.map((item) => (
            <button
              key={item.to}
              type="button"
              onClick={() => handleNavigate(item.to)}
              className={`rounded-full px-4 py-2 text-left text-sm font-semibold transition sm:text-center ${
                isItemActive(item.to)
                  ? "bg-emerald-50 text-[var(--crm-accent-dark)] shadow-[inset_0_0_0_1px_rgba(70,198,153,0.18)]"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              }`}
            >
              {item.label}
            </button>
          ))}

          <button
            type="button"
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="rounded-full px-4 py-2 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-50 sm:hidden"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
