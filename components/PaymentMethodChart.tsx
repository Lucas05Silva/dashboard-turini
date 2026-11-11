"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { paymentMethods } from "@/lib/data";
import { CHART_COLORS, axisProps, gridProps, legendProps, tooltipProps, brlAxis, brlTooltip } from "@/lib/chartTheme";
import { useReducedMotion } from "@/lib/useReducedMotion";

// PIX (em alta) e Fiado (em queda) recebem as cores mais fortes — são o enredo do gráfico.
const SERIES = [
  { key: "pix", label: "PIX", color: CHART_COLORS.primary },
  { key: "credito", label: "Crédito", color: CHART_COLORS.primaryLight },
  { key: "debito", label: "Débito", color: CHART_COLORS.tertiaryDark },
  { key: "dinheiro", label: "Dinheiro", color: CHART_COLORS.tertiaryLight },
  { key: "fiado", label: "Fiado", color: CHART_COLORS.secondary },
] as const;

export default function PaymentMethodChart() {
  const reduced = useReducedMotion();
  return (
    <ResponsiveContainer width="100%" height={340}>
      <BarChart data={paymentMethods} margin={{ top: 8, right: 8, bottom: 0, left: -8 }} barGap={2} barCategoryGap="18%">
        <CartesianGrid {...gridProps} vertical={false} />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} axisLine={false} tickFormatter={brlAxis} width={48} />
        <Tooltip {...tooltipProps} formatter={(value, name) => [brlTooltip(value as number), name]} />
        <Legend {...legendProps} />
        {SERIES.map((s) => (
          <Bar isAnimationActive={!reduced} key={s.key} dataKey={s.key} name={s.label} fill={s.color} radius={[4, 4, 0, 0]} maxBarSize={20} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
