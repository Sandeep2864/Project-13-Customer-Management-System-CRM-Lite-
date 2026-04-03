import React from "react";

type AuthSceneProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

const AuthScene: React.FC<AuthSceneProps> = ({ title, subtitle, children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(160deg,#061510_0%,#0d2b20_34%,#102b43_100%)] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(103,232,191,0.28),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(96,165,250,0.24),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.16),transparent_26%)]" />
      <div className="mesh-grid absolute inset-0 opacity-[0.08]" />
      <div className="auth-light-ray absolute inset-0" />
      <div className="absolute left-[-8%] top-[10%] h-[320px] w-[320px] rounded-full bg-emerald-300/20 blur-[110px]" />
      <div className="absolute right-[-6%] top-[18%] h-[280px] w-[280px] rounded-full bg-sky-300/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[18%] h-[300px] w-[300px] rounded-full bg-amber-200/10 blur-[140px]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,10,8,0.12)_0%,rgba(4,12,10,0.24)_45%,rgba(2,8,7,0.54)_100%)]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
        <div className="auth-glass-card relative w-full max-w-[540px] rounded-[36px] border border-white/15 bg-white/8 p-6 shadow-[0_32px_80px_rgba(0,0,0,0.42)] backdrop-blur-[22px] sm:p-8">
          <div className="pointer-events-none absolute inset-0 rounded-[36px] border border-white/10" />
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
          <div className="relative">
            <div className="auth-badge mb-8 inline-flex items-center rounded-full border border-white/10 bg-black/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/65">
              CRM Secure Access
            </div>
            <h1 className="auth-title font-display text-4xl font-bold tracking-tight text-white sm:text-[42px]">
              {title}
            </h1>
            <p className="auth-copy mt-3 max-w-md text-sm leading-7 text-white/65 sm:text-base">
              {subtitle}
            </p>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScene;
