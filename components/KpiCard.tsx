import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Minus,
  Package,
  Receipt,
  RotateCcw,
  ShoppingCart,
  TrendingUp,
  UserCheck,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { Kpi } from "@/lib/indicators";

const ICONS: Record<string, LucideIcon> = {
  DollarSign,
  Package,
  TrendingUp,
  Receipt,
  ShoppingCart,
  Wallet,
  AlertTriangle,
  RotateCcw,
  Users,
  UserCheck,
};

const TONES = {
  positive: { icon: ArrowUpRight, className: "text-[#5fd35f]", label: "favorável" },
  negative: { icon: ArrowDownRight, className: "text-[#f08a6a]", label: "desfavorável" },
  neutral: { icon: Minus, className: "text-ink-muted", label: "neutro" },
} as const;

export default function KpiCard({ kpi }: { kpi: Kpi }) {
  const Icon = ICONS[kpi.icon] ?? DollarSign;
  const tone = TONES[kpi.tone];
  const ToneIcon = tone.icon;

  return (
    <article className="group rounded-2xl border border-white/[0.06] bg-card p-5 transition-all duration-200 hover:border-white/10 hover:bg-[#171716]">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium text-ink-secondary">{kpi.label}</h3>
        <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.06] bg-surface text-gold/80 transition-colors duration-200 group-hover:text-gold">
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
        </span>
      </div>
      <p className="mt-4 text-[26px] font-semibold leading-none tracking-tight text-ink">{kpi.value}</p>
      <p className={`mt-3 flex items-center gap-1 text-xs font-medium ${tone.className}`}>
        <ToneIcon className="h-3.5 w-3.5" aria-label={tone.label} />
        {kpi.delta}
      </p>
    </article>
  );
}
