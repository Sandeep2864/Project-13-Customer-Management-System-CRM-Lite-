import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const currentUser = await login(email, password, { remember: rememberMe });
      showToast({
        tone: "success",
        title: `Welcome back, ${currentUser.name}.`,
        description: "You are now signed in to your CRM workspace.",
      });
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
            CRM Workspace
          </div>
          <h1 className="mt-6 font-display text-5xl font-bold leading-tight text-slate-900 sm:text-6xl">
            Welcome back to your CRM workspace <span className="animate-wave inline-block origin-[40%_40%]">👋</span>
          </h1>
          
          <p className="mt-6 max-w-xl text-base leading-8 text-slate-500">
          A modern CRM platform for teams that want faster growth.
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
            <div className="flex items-center gap-4">
              <BrandLogo
                variant="full"
                className="crm-logo-idle w-[88px] shrink-0 object-contain sm:w-[104px]"
              />
              <div>
                <p className="font-display text-2xl font-bold text-slate-900">
                  Sign in
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
                  autoComplete="email"
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
                  autoComplete="current-password"
                  required
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex items-center gap-3 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="h-4 w-4 rounded border-[var(--crm-line)] text-[var(--crm-accent)] focus:ring-2 focus:ring-emerald-200"
                  />
                  <span>Remember me</span>
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-[var(--crm-accent-dark)] transition hover:text-[var(--crm-accent)]"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="crm-cta w-full rounded-2xl px-6 py-3.5 text-sm font-semibold text-white shadow-[0_20px_45px_rgba(70,198,153,0.24)] transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Logging in..." : "Open Dashboard"}
              </button>
            </form>

        
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
