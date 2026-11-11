"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getNewVsReturning } from "@/lib/indicators";
import { num, pct } from "@/lib/format";
import { CHART_COLORS, axisProps, gridProps, legendProps, tooltipProps } from "@/lib/chartTheme";
import { useReducedMotion } from "@/lib/useReducedMotion";

export default function NewVsReturningChart() {
  const reduced = useReducedMotion();
  const data = getNewVsReturning();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} barCategoryGap="28%">
        <CartesianGrid {...gridProps} vertical={false} />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} axisLine={false} width={40} />
        <Tooltip
          {...tooltipProps}
          labelFormatter={(label, payload) => {
            const p = payload?.[0]?.payload as { total?: number; shareRecorrentes?: number } | undefined;
            return p?.total !== undefined
              ? `${label} · ${num(p.total)} clientes · ${pct(p.shareRecorrentes ?? 0, 0)} recorrentes`
              : String(label);
          }}
          formatter={(value, name) => [`${num(value as number)} clientes`, name]}
        />
        <Legend {...legendProps} />
        <Bar isAnimationActive={!reduced} dataKey="recorrentes" name="Recorrentes" stackId="c" fill={CHART_COLORS.tertiary} maxBarSize={36} />
        <Bar isAnimationActive={!reduced} dataKey="novos" name="Novos" stackId="c" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} maxBarSize={36} />
      </BarChart>
    </ResponsiveContainer>
  );
}
