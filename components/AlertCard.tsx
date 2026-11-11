import {
  AlertTriangle,
  Clock,
  Info,
  Mail,
  Package,
  PackageX,
  RotateCcw,
  UserMinus,
  UserX,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { Alert } from "@/lib/indicators";
import { STATUS_COLORS } from "@/lib/chartTheme";

const ICONS: Record<string, LucideIcon> = {
  AlertTriangle,
  Clock,
  Mail,
  Package,
  PackageX,
  RotateCcw,
  UserMinus,
  UserX,
  Zap,
};

const SEVERITY = {
  critical: { label: "Crítico", color: STATUS_COLORS.critico },
  warning: { label: "Aviso", color: STATUS_COLORS.atencao },
  info: { label: "Operacional", color: "#6aabe8" },
} as const;

export default function AlertCard({ alert }: { alert: Alert }) {
  const Icon = ICONS[alert.icon] ?? Info;
  const sev = SEVERITY[alert.severity];
  return (
    <li
      className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-surface/70 p-4 transition-all duration-200 hover:border-white/10 hover:bg-surface"
      style={{ boxShadow: `inset 3px 0 0 ${sev.color}` }}
    >
      <span
        className="grid h-9 w-9 shrink-0 place-items-center rounded-lg"
        style={{ backgroundColor: `${sev.color}1f`, color: sev.color }}
      >
        <Icon className="h-[18px] w-[18px]" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: sev.color }} />
          {sev.label}
        </p>
        <p className="mt-1 text-sm leading-snug text-ink">{alert.message}</p>
      </div>
    </li>
  );
}
