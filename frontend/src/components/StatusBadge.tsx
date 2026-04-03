import React from "react";

type StatusTone =
  | "active"
  | "lead"
  | "inactive"
  | "info"
  | "warning"
  | "neutral";

const toneClasses: Record<StatusTone, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  lead: "bg-amber-50 text-amber-700 ring-amber-200",
  inactive: "bg-slate-100 text-slate-600 ring-slate-200",
  info: "bg-sky-50 text-sky-700 ring-sky-200",
  warning: "bg-orange-50 text-orange-700 ring-orange-200",
  neutral: "bg-slate-100 text-slate-700 ring-slate-200",
};

interface StatusBadgeProps {
  label: string;
  tone?: StatusTone;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ label, tone = "neutral" }) => {
  return (
    <span
      className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ring-1 ${toneClasses[tone]}`}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
