import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const AppShell: React.FC = () => {
  return (
    <div className="crm-dashboard min-h-screen overflow-hidden bg-[var(--crm-bg)] text-[var(--crm-text)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] overflow-hidden">
        <div className="floating-orb absolute left-[-100px] top-[-140px] h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,_rgba(70,198,153,0.24)_0%,_rgba(70,198,153,0)_68%)]" />
        <div className="floating-orb-delayed absolute right-[-80px] top-12 h-[280px] w-[280px] rounded-full bg-[radial-gradient(circle,_rgba(56,189,248,0.18)_0%,_rgba(56,189,248,0)_70%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
      </div>

      <Navbar />

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-81px)] w-full max-w-7xl flex-col px-4 pb-10 pt-8 sm:px-6 lg:px-8">
        <Outlet />

        <footer className="mt-auto flex flex-col gap-4 border-t border-[var(--crm-line)] pt-8 text-xs font-semibold text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 uppercase tracking-[0.16em]">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--crm-accent)] shadow-[0_0_20px_rgba(70,198,153,0.6)]" />
            CRM Workspace - Professional Edition v1.0
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <button type="button" className="transition hover:text-slate-600">
              Privacy Policy
            </button>
            <button type="button" className="transition hover:text-slate-600">
              Terms of Service
            </button>
            <span>Copyright 2026</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default AppShell;
