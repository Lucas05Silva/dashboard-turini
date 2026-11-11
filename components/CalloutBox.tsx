import type { ReactNode } from "react";
import { AlertTriangle, ArrowRight, Lightbulb, XCircle, type LucideIcon } from "lucide-react";

type Variant = "insight" | "action" | "warning" | "critical";

const VARIANTS: Record<Variant, { icon: LucideIcon; label: string; box: string; text: string }> = {
  insight: {
    icon: Lightbulb,
    label: "Insight",
    box: "bg-blue-500/10 border-blue-500/20 border-l-blue-400",
    text: "text-blue-300",
  },
  action: {
    icon: ArrowRight,
    label: "Ação sugerida",
    box: "bg-green-500/10 border-green-500/20 border-l-green-400",
    text: "text-green-300",
  },
  warning: {
    icon: AlertTriangle,
    label: "Atenção",
    box: "bg-yellow-500/10 border-yellow-500/20 border-l-yellow-400",
    text: "text-yellow-300",
  },
  critical: {
    icon: XCircle,
    label: "Urgente",
    box: "bg-red-500/10 border-red-500/20 border-l-red-400",
    text: "text-red-300",
  },
};

export default function CalloutBox({ variant, children }: { variant: Variant; children: ReactNode }) {
  const v = VARIANTS[variant];
  const Icon = v.icon;
  return (
    <aside className={`flex gap-3 rounded-lg border border-l-[3px] p-4 ${v.box}`}>
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${v.text}`} aria-hidden />
      <p className="text-sm leading-relaxed text-ink-secondary">
        <span className={`mr-1.5 font-semibold ${v.text}`}>{v.label}:</span>
        {children}
      </p>
    </aside>
  );
}
