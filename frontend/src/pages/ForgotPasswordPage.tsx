import { isAxiosError } from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../api/authApi";
import AuthScene from "../components/AuthScene";

const MailIcon = () => (
  <svg
    aria-hidden="true"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
  >
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await requestPasswordReset(email);
      setSuccess(
        "If this email exists in your account system, reset instructions have been sent."
      );
    } catch (requestError) {
      if (isAxiosError(requestError)) {
        setError(
          requestError.response?.data?.message ??
            "Password reset is not available yet. Connect `/api/auth/forgot-password` in the backend to activate this page."
        );
      } else {
        setError("Password reset could not be requested right now.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScene
      title="Forgot Password"
      subtitle="Enter your email address and we will help you start the password reset flow for your CRM account."
    >
      {success ? (
        <div className="mb-5 rounded-2xl border border-emerald-300/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-100">
          {success}
        </div>
      ) : null}

      {error ? (
        <div className="mb-5 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-100">
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block">
          <span className="sr-only">Email address</span>
          <div className="flex items-center gap-3 rounded-[20px] border border-white/18 bg-black/10 px-4 py-4 text-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition focus-within:border-white/35 focus-within:bg-black/14">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              className="w-full bg-transparent text-base text-white placeholder:text-white/38 focus:outline-none"
              autoComplete="email"
              required
            />
            <MailIcon />
          </div>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-[20px] bg-[linear-gradient(90deg,#a8b117_0%,#0d6d40_100%)] px-6 py-4 text-lg font-semibold text-white shadow-[0_22px_50px_rgba(0,0,0,0.28)] transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-white/70">
        Remembered your password?{" "}
        <Link to="/" className="font-semibold text-white transition hover:text-emerald-200">
          Back to login
        </Link>
      </div>

      <div className="mt-8 rounded-[24px] border border-white/12 bg-black/10 px-4 py-4 text-sm leading-7 text-white/60">
        This page is ready for your backend reset endpoint and will show API
        feedback automatically.
      </div>
    </AuthScene>
  );
};

export default ForgotPasswordPage;
