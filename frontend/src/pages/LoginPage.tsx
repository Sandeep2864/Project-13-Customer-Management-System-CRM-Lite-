import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (loginError) {
      const message =
        loginError instanceof Error ? loginError.message : "Login failed";
      setError(message);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f7fffb_0%,#eef7ff_100%)]">
      <div className="floating-orb absolute left-[-120px] top-[-100px] h-[340px] w-[340px] rounded-full bg-[radial-gradient(circle,_rgba(70,198,153,0.24)_0%,_rgba(70,198,153,0)_70%)]" />
      <div className="floating-orb-delayed absolute right-[-80px] top-[10%] h-[280px] w-[280px] rounded-full bg-[radial-gradient(circle,_rgba(56,189,248,0.18)_0%,_rgba(56,189,248,0)_70%)]" />
      <div className="mesh-grid absolute inset-0 opacity-40" />

      <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <section className="reveal-card relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[var(--crm-accent-dark)] shadow-[0_14px_30px_rgba(15,23,42,0.05)] backdrop-blur">
            CRM Lite Workspace
          </div>
          <h1 className="mt-6 font-display text-5xl font-bold leading-tight text-slate-900 sm:text-6xl">
            Connect your backend and start with a clean CRM workspace.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-slate-500">
            This frontend now loads with empty customer and admin data. Point the
            login request to your backend URL and the app is ready for real API
            integration.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ["00", "Customers loaded"],
              ["00", "Admins loaded"],
              ["API", "Backend ready"],
            ].map(([value, label], index) => (
              <div
                key={label}
                className="reveal-card rounded-[28px] border border-white/80 bg-white/80 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur"
                style={{ ["--delay" as string]: `${0.08 * index}s` }}
              >
                <p className="font-display text-4xl font-bold text-slate-900">
                  {value}
                </p>
                <p className="mt-2 text-sm text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="reveal-card relative z-10">
          <div className="rounded-[36px] border border-white/80 bg-white/85 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.09)] backdrop-blur-xl sm:p-10">
            <div className="flex items-center gap-3">
              <div className="crm-logo-glow flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--crm-accent),var(--crm-accent-dark))] text-lg font-bold text-white">
                C
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-slate-900">
                  Sign in
                </p>
                <p className="text-sm text-slate-500">
                  Use credentials from your backend
                </p>
              </div>
            </div>

            {error ? (
              <div className="mt-6 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {error}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-600">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-[var(--crm-line)] bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-emerald-200 focus:shadow-[0_0_0_4px_rgba(70,198,153,0.08)]"
                  required
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-600">
                  Password
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-[var(--crm-line)] bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-emerald-200 focus:shadow-[0_0_0_4px_rgba(70,198,153,0.08)]"
                  required
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="crm-cta w-full rounded-2xl px-6 py-3.5 text-sm font-semibold text-white shadow-[0_20px_45px_rgba(70,198,153,0.24)] transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Logging in..." : "Open Dashboard"}
              </button>
            </form>

            <div className="mt-6 rounded-[24px] border border-[var(--crm-line)] bg-[linear-gradient(180deg,#fcfffd,#f5fbf8)] p-5 text-sm leading-7 text-slate-600">
              <p className="font-semibold text-slate-900">Backend note</p>
              <p className="mt-2">
                Set `VITE_API_BASE_URL` to your backend URL and return a token
                plus user object from `/api/auth/login`.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
