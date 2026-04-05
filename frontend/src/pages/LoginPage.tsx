import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

const loginHighlights = [
  ["MySQL", "Database connected"],
  ["JWT", "Token auth ready"],
  ["5000", "API on localhost"],
] as const;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  // Casting useAuth to include the proper types from your AuthProvider
  const { login, loading } = useAuth() as any;
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, []);

  const handleInputFocus = () => {
    if (error) setError("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // ✅ STOP REFRESH
    setError("");

    try {
      const currentUser = await login(email, password, {
        remember: rememberMe,
      });

      showToast({
        tone: "success",
        title: `Welcome back, ${currentUser.name}.`,
        description: "You are now signed in.",
      });

      navigate("/dashboard");
    } catch (err: any) {
      // ✅ EXTRACT BACKEND MESSAGE (401/403)
      const message = err.response?.data?.message || err.message || "Login failed";
      setError(message);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f7fffb_0%,#eef7ff_100%)]">
      <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        
        {/* Left Side: Info */}
        <section className="reveal-card relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700 shadow-sm backdrop-blur">
            CRM Workspace
          </div>
          <h1 className="mt-6 font-display text-5xl font-bold leading-tight text-slate-900 sm:text-6xl">
            Welcome back to your CRM workspace <span className="animate-wave inline-block">👋</span>
          </h1>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {loginHighlights.map(([value, label], index) => (
              <div key={label} className="rounded-[28px] border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur">
                <p className="font-display text-4xl font-bold text-slate-900">{value}</p>
                <p className="mt-2 text-sm text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Right Side: Login Form */}
        <section className="reveal-card relative z-10">
          <div className="rounded-[36px] border border-white/80 bg-white/85 p-8 shadow-xl backdrop-blur-xl sm:p-10">
            <div className="flex items-center gap-4 mb-8">
              <BrandLogo variant="full" className="w-[100px] shrink-0" />
              <p className="font-display text-2xl font-bold text-slate-900">Sign in</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <span className="text-sm font-semibold text-slate-600">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={handleInputFocus}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-50 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <span className="text-sm font-semibold text-slate-600">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={handleInputFocus}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-50 transition-all"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm font-bold text-emerald-600 hover:text-emerald-700">
                  Forgot password?
                </Link>
              </div>

              {/* ERROR MESSAGE: Between input and button */}
              {error && (
                <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 animate-in fade-in slide-in-from-top-2 duration-300">
                   ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="crm-cta w-full rounded-2xl px-6 py-4 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-1 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Open Dashboard"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;