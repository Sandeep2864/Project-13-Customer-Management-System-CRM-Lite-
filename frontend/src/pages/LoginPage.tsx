import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import {
  FaFacebookF,
  FaInstagram,
  FaGithub,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
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
    event.preventDefault();
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
      const message =
        err.response?.status === 401
          ? "wrong credentials"
          : err.response?.data?.message || err.message || "Login failed";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7fffb_0%,#eef7ff_100%)] flex flex-col">
      {/* Main Content */}
      <div className="flex-1">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          {/* Left Side */}
          <section className="reveal-card relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700 shadow-sm backdrop-blur">
              CRM Workspace
            </div>

            <h1 className="mt-6 font-display text-5xl font-bold leading-tight text-slate-900 sm:text-6xl">
              Welcome back to your CRM workspace{" "}
              <span className="animate-wave inline-block">👋</span>
            </h1>
          </section>

          {/* Right Side */}
          <section className="reveal-card relative z-10">
            <div className="rounded-[36px] border border-white/80 bg-white/85 p-8 shadow-xl backdrop-blur-xl sm:p-10">
              <div className="mb-8 flex items-center gap-4">
                <BrandLogo variant="full" className="w-[100px] shrink-0" />
                <p className="font-display text-2xl font-bold text-slate-900">
                  Sign in
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <span className="text-sm font-semibold text-slate-600">
                    Email
                  </span>
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
                  <span className="text-sm font-semibold text-slate-600">
                    Password
                  </span>
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
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
                    />
                    <span>Remember me</span>
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-sm font-bold text-emerald-600 hover:text-emerald-700"
                  >
                    Forgot password?
                  </Link>
                </div>

                {error && (
                  <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
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

      {/* Footer */}
      <footer className="bg-[#04130ce8] text-gray-300 py-7">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-10 text-sm md:text-base">
            <a href="#" className="hover:text-white transition">Dashboard</a>
            <a href="#" className="hover:text-white transition">Customers</a>
            <a href="#" className="hover:text-white transition">Leads</a>
            <a href="#" className="hover:text-white transition">Reports</a>
            <a href="#" className="hover:text-white transition">Settings</a>
            <a href="#" className="hover:text-white transition">Support</a>
          </div>

          <div className="flex justify-center gap-8 mt-8 text-xl">
            <FaFacebookF />
            <FaInstagram />
            <FaXTwitter />
            <FaGithub />
            <FaYoutube />
          </div>

          <div className="text-center mt-8 text-sm text-gray-400">
            © 2026 CRM Pro. Manage customers smarter, grow faster.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
