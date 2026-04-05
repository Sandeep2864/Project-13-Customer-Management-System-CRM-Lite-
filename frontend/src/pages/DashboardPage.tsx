import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCRM } from "../hooks/useCRM";

const SparklesIcon = () => (
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
    <path d="m12 3 1.8 4.8L18 9.6l-4.2 1.8L12 16.2l-1.8-4.8L6 9.6l4.2-1.8L12 3Z" />
    <path d="M5 17.5 6 20l2.5 1-2.5 1L5 24l-1-2 2.5-1-2.5-1L5 17.5Z" />
    <path d="M19 13.5 20 16l2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5Z" />
  </svg>
);

const showcaseSlides = [
  {
    eyebrow: "Unified workspace",
    title: "Bring leads, contacts, and follow-ups into one calm CRM flow.",
    description:
      "Keep every customer touchpoint visible so your team always knows what moves next.",
    badge: "Live pipeline",
    accent:
      "from-[rgba(70,198,153,0.22)] via-[rgba(255,255,255,0.92)] to-[rgba(226,244,255,0.88)]",
    ring:
      "bg-[radial-gradient(circle_at_top,rgba(70,198,153,0.26),transparent_62%)]",
  },
  {
    eyebrow: "Faster teamwork",
    title: "Track customer status changes without losing the story behind each deal.",
    description:
      "Notes, ownership, and progress stay organized so follow-ups feel simple and fast.",
    badge: "Shared context",
    accent:
      "from-[rgba(56,189,248,0.2)] via-[rgba(255,255,255,0.94)] to-[rgba(226,255,245,0.86)]",
    ring:
      "bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.24),transparent_62%)]",
  },
  {
    eyebrow: "Clear decisions",
    title: "See what matters at a glance and move from lead to active customer faster.",
    description:
      "A focused dashboard helps admins spot momentum, unblock work, and keep the pipeline moving.",
    badge: "Simple insights",
    accent:
      "from-[rgba(244,183,64,0.2)] via-[rgba(255,255,255,0.94)] to-[rgba(232,244,255,0.88)]",
    ring:
      "bg-[radial-gradient(circle_at_top,rgba(244,183,64,0.22),transparent_62%)]",
  },
] as const;

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { customers, customerError } = useCRM();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % showcaseSlides.length);
    }, 4200);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const stats = [
    {
      label: "Pipeline Total",
      value: customers.length,
      tone:
        "from-[rgba(74,222,128,0.16)] via-[rgba(255,255,255,0.92)] to-white",
    },
    {
      label: "Active Customers",
      value: customers.filter((customer) => customer.status === "Active").length,
      tone:
        "from-[rgba(56,189,248,0.16)] via-[rgba(255,255,255,0.92)] to-white",
    },
    {
      label: "Warm Leads",
      value: customers.filter((customer) => customer.status === "Lead").length,
      tone:
        "from-[rgba(251,191,36,0.18)] via-[rgba(255,255,255,0.92)] to-white",
    },
  ];

  return (
    <section className="flex flex-col gap-6">
      <div
        className="reveal-card flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
        style={{ ["--delay" as string]: "0s" }}
      >
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/75 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--crm-accent-dark)] shadow-[0_14px_30px_rgba(15,23,42,0.05)] backdrop-blur">
            <SparklesIcon />
            Sales command center
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Hello, {user?.name ?? "Admin"} welcome back.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            Track every customer state, move faster through leads, and keep your
            admin workflow calm and readable.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/customers/new")}
          className="crm-cta inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-semibold text-white shadow-[0_20px_45px_rgba(70,198,153,0.28)] transition hover:-translate-y-1"
        >
          Add Customer
        </button>
        {user?.role === "superadmin" ? (
          <button
            type="button"
            onClick={() => navigate("/superadmins")}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--crm-line)] bg-white px-6 py-4 text-sm font-semibold text-slate-700 shadow-[0_14px_34px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:border-emerald-200 hover:text-emerald-700"
          >
            Open SuperAdmin Panel
          </button>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <article
            key={stat.label}
            className={`reveal-card overflow-hidden rounded-[28px] border border-white/80 bg-gradient-to-br ${stat.tone} p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur`}
            style={{ ["--delay" as string]: `${0.08 * (index + 1)}s` }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                  {stat.label}
                </p>
                <p className="mt-4 font-display text-4xl font-bold text-slate-900">
                  {stat.value}
                </p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]" />
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/80">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,var(--crm-accent),#7dd3fc)]"
                style={{
                  width: `${stat.value === 0 ? 12 : Math.min(stat.value * 18, 100)}%`,
                }}
              />
            </div>
          </article>
        ))}
      </div>

      {customerError ? (
        <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
          {customerError}
        </div>
      ) : null}

      <section
        className="reveal-card overflow-hidden rounded-[34px] border border-white/80 bg-white/82 shadow-[0_22px_60px_rgba(15,23,42,0.07)] backdrop-blur-xl"
        style={{ ["--delay" as string]: "0.28s" }}
      >
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${activeSlide * 100}%)` }}
        >
          {showcaseSlides.map((slide) => (
            <article
              key={slide.title}
              className={`min-w-full bg-gradient-to-br ${slide.accent}`}
            >
              <div className="grid items-center gap-10 px-6 py-8 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-10">
                <div className="max-w-2xl">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--crm-accent-dark)]">
                    {slide.eyebrow}
                  </p>
                  <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
                    {slide.title}
                  </h2>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                    {slide.description}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-white/85 bg-white/85 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-600 shadow-[0_12px_24px_rgba(15,23,42,0.05)]">
                      {slide.badge}
                    </span>
                    <button
                      type="button"
                      onClick={() => navigate("/customers")}
                      className="rounded-full border border-[var(--crm-line)] bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700"
                    >
                      Open Customers
                    </button>
                  </div>
                </div>

                <div className="relative mx-auto flex w-full max-w-md items-center justify-center">
                  <div className={`absolute inset-0 rounded-[32px] ${slide.ring}`} />
                  <div className="relative w-full overflow-hidden rounded-[30px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(245,250,247,0.92))] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.1)]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                          CRM Story
                        </p>
                        <p className="mt-2 font-display text-2xl font-bold text-slate-900">
                          Smarter customer flow
                        </p>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Ready
                      </span>
                    </div>

                    <div className="mt-6 rounded-[28px] bg-[linear-gradient(180deg,#f5fff9,#eef6ff)] p-6">
                      <img
                        src="/crm-logo.svg"
                        alt="CRM illustration"
                        className="mx-auto h-40 w-auto object-contain drop-shadow-[0_18px_30px_rgba(115,184,92,0.22)]"
                      />
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      {["Leads", "Follow-ups", "Insights"].map((item) => (
                        <div
                          key={item}
                          className="rounded-2xl border border-[var(--crm-line)] bg-white px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-slate-500"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-[var(--crm-line)] bg-white/70 px-6 py-4 sm:px-8">
          <div className="flex items-center gap-2">
            {showcaseSlides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => setActiveSlide(index)}
                className={`h-2.5 rounded-full transition-all ${
                  activeSlide === index
                    ? "w-10 bg-[var(--crm-accent-dark)]"
                    : "w-2.5 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setActiveSlide(
                  (currentSlide) =>
                    (currentSlide - 1 + showcaseSlides.length) %
                    showcaseSlides.length
                )
              }
              className="rounded-full border border-[var(--crm-line)] bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-emerald-200 hover:text-emerald-700"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() =>
                setActiveSlide(
                  (currentSlide) => (currentSlide + 1) % showcaseSlides.length
                )
              }
              className="rounded-full border border-[var(--crm-line)] bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-emerald-200 hover:text-emerald-700"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </section>
  );
};

export default DashboardPage;
