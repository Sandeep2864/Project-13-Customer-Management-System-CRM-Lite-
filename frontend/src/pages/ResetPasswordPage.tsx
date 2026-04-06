import { isAxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { verifyResetToken, resetPassword } from "../api/authApi";
import AuthScene from "../components/AuthScene";

const LockIcon = () => (
  <svg
    aria-hidden="true"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
  >
    <rect x="4" y="10" width="16" height="10" rx="2.5" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);

const ResetPasswordPage: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token") || "";

  const [status, setStatus] = useState<"loading" | "valid" | "invalid">("loading");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }

    verifyResetToken(token)
      .then((res) => setStatus(res ? "valid" : "invalid"))
      .catch(() => setStatus("invalid"));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await resetPassword(token, password);
      navigate("/");
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to reset password");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Loading UI (match theme)
  if (status === "loading") {
    return (
      <AuthScene title="Checking Link" subtitle="Validating reset link...">
        <div className="text-center text-white/60 text-sm">
          Please wait...
        </div>
      </AuthScene>
    );
  }

  // ❌ Invalid token UI
  if (status === "invalid") {
    return (
      <AuthScene title="Link Expired" subtitle="Invalid or expired reset link">
        <div className="text-center text-white/70 text-sm">
          <Link
            to="/forgot-password"
            className="font-semibold text-white hover:text-emerald-200"
          >
            Request new link
          </Link>
        </div>
      </AuthScene>
    );
  }

  // ✅ MAIN UI
  return (
    <AuthScene
      title="Reset Password"
      subtitle="Enter your new password below"
    >
      {/* Error */}
      {error && (
        <div className="mb-5 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block">
          <span className="sr-only">New password</span>

          <div className="flex items-center gap-3 rounded-[20px] border border-white/18 bg-black/10 px-4 py-4 text-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition focus-within:border-white/35 focus-within:bg-black/14">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              className="w-full bg-transparent text-base text-white placeholder:text-white/38 focus:outline-none"
              required
            />
            <LockIcon />
          </div>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-[20px] bg-[linear-gradient(90deg,#a8b117_0%,#0d6d40_100%)] px-6 py-4 text-lg font-semibold text-white shadow-[0_22px_50px_rgba(0,0,0,0.28)] transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Saving..." : "Reset Password"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-white/70">
        Back to{" "}
        <Link
          to="/"
          className="font-semibold text-white hover:text-emerald-200"
        >
          login
        </Link>
      </div>
    </AuthScene>
  );
};

export default ResetPasswordPage;
