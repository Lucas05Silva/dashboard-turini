"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getMonthlyWithSaldo } from "@/lib/indicators";
import { pct } from "@/lib/format";
import { CHART_COLORS, axisProps, gridProps, legendProps, tooltipProps, brlAxis, brlTooltip } from "@/lib/chartTheme";
import { useReducedMotion } from "@/lib/useReducedMotion";

export default function RevenueVsCostChart() {
  const reduced = useReducedMotion();
  const data = getMonthlyWithSaldo();

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }} barGap={3} barCategoryGap="22%">
        <CartesianGrid {...gridProps} vertical={false} />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} axisLine={false} tickFormatter={brlAxis} width={48} />
        <Tooltip
          {...tooltipProps}
          labelFormatter={(label, payload) => {
            const m = payload?.[0]?.payload as { margem?: number } | undefined;
            return m?.margem !== undefined ? `${label} · margem bruta ${pct(m.margem)}` : String(label);
          }}
          formatter={(value, name) => [brlTooltip(value as number), name]}
        />
        <Legend {...legendProps} />
        <Bar isAnimationActive={!reduced} dataKey="faturamento" name="Faturamento" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} maxBarSize={22} />
        <Bar isAnimationActive={!reduced} dataKey="cmv" name="CMV" fill={CHART_COLORS.secondary} radius={[4, 4, 0, 0]} maxBarSize={22} />
        <Bar isAnimationActive={!reduced} dataKey="despesasFixas" name="Despesas fixas" fill={CHART_COLORS.secondaryLight} radius={[4, 4, 0, 0]} maxBarSize={22} />
      </BarChart>
    </ResponsiveContainer>
  );
}
