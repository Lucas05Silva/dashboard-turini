import { STATUS_COLORS } from "@/lib/chartTheme";

export type BadgeStatus = "devendo" | "parcial" | "em dia" | "atrasado" | "ideal" | "atencao" | "baixo";

const MAP: Record<BadgeStatus, { label: string; color: string }> = {
  "em dia": { label: "Em dia", color: STATUS_COLORS.ideal },
  parcial: { label: "Parcial", color: STATUS_COLORS.atencao },
  atrasado: { label: "Atrasado", color: STATUS_COLORS.baixo },
  devendo: { label: "Devendo", color: STATUS_COLORS.critico },
  ideal: { label: "Ideal", color: STATUS_COLORS.ideal },
  atencao: { label: "Atenção", color: STATUS_COLORS.atencao },
  baixo: { label: "Baixo", color: STATUS_COLORS.baixo },
};

/** Badge de status: sempre dot + texto (nunca cor sozinha). */
export default function StatusBadge({ status }: { status: BadgeStatus }) {
  const { label, color } = MAP[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium text-ink"
      style={{ borderColor: `${color}55`, backgroundColor: `${color}1a` }}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
