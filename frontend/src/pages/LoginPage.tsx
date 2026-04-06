import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

const footerLinks = [
  "CRM Workspace",
  "Dashboard",
  "Customers",
  "Secure Access",
  "Privacy Policy",
  "Support Desk",
];

const footerIcons = [
  {
    label: "Workspace",
    icon: (
      <path
        d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    ),
  },
  {
    label: "Customers",
    icon: (
      <>
        <path
          d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M3.5 19a5.5 5.5 0 0 1 11 0"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
        <path
          d="M16.5 11a2.5 2.5 0 1 0 0-5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
        <path
          d="M15 14.5A4.5 4.5 0 0 1 20.5 19"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      </>
    ),
  },
  {
    label: "Security",
    icon: (
      <>
        <path
          d="M12 3 5.5 6v5.5c0 4 2.7 7 6.5 9 3.8-2 6.5-5 6.5-9V6L12 3Z"
          fill="none"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path
          d="m9.5 12 1.7 1.7 3.3-3.7"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </>
    ),
  },
  {
    label: "Reports",
    icon: (
      <>
        <path
          d="M5 19V9"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
        <path
          d="M12 19V5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
        <path
          d="M19 19v-7"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      </>
    ),
  },
  {
    label: "Support",
    icon: (
      <>
        <path
          d="M6 10a6 6 0 1 1 12 0v4"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
        <rect
          x="4"
          y="13"
          width="3.5"
          height="5"
          rx="1.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <rect
          x="16.5"
          y="13"
          width="3.5"
          height="5"
          rx="1.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M10 18h4"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      </>
    ),
  },
];

const FooterIcon = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div
    aria-label={label}
    className="flex h-11 w-11 items-center justify-center rounded-full text-slate-400 transition duration-200 hover:bg-white/6 hover:text-slate-200"
    role="img"
  >
    <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24">
      {children}
    </svg>
  </div>
);

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const { showToast } = useToast();
  const currentYear = new Date().getFullYear();
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

      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <section className="reveal-card relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[var(--crm-accent-dark)] shadow-[0_14px_30px_rgba(15,23,42,0.05)] backdrop-blur">
              CRM Workspace
            </div>
            <h1 className="mt-6 font-display text-5xl font-bold leading-tight text-slate-900 sm:text-6xl">
              Welcome back to your CRM workspace{" "}
              <span className="animate-wave inline-block origin-[40%_40%]">
                {"\u{1F44B}"}
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-500">
              A modern CRM platform for teams that want faster growth.
            </p>
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
                  <span className="text-sm font-semibold text-slate-600">
                    Email
                  </span>
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

        <footer className="bg-[#0f1a2e] px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
            <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-[15px] text-slate-300 sm:gap-x-12">
              {footerLinks.map((item) => (
                <span key={item} className="transition hover:text-white">
                  {item}
                </span>
              ))}
            </nav>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-7">
              {footerIcons.map((item) => (
                <FooterIcon key={item.label} label={item.label}>
                  {item.icon}
                </FooterIcon>
              ))}
            </div>

            <p className="mt-10 text-sm text-slate-400">
              &copy; {currentYear} CRM Lite. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;
