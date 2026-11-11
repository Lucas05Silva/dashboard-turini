import { UI_COLORS, truncate } from "@/lib/chartTheme";

type Props = {
  x?: number;
  y?: number;
  payload?: { value: string };
  maxChars?: number;
};

/** Tick de categoria em linha única (evita a quebra automática do Recharts), truncado com reticências. */
export default function AxisTick({ x = 0, y = 0, payload, maxChars = 24 }: Props) {
  const value = payload?.value ?? "";
  return (
    <text x={x} y={y} dy={4} textAnchor="end" fill={UI_COLORS.textSecondary} fontSize={12}>
      {value.length > maxChars && <title>{value}</title>}
      {truncate(value, maxChars)}
    </text>
  );
}
