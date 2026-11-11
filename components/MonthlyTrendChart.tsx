"use client";

import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getMonthlyWithSaldo } from "@/lib/indicators";
import { brlCompact } from "@/lib/format";
import { CHART_COLORS, UI_COLORS, axisProps, gridProps, legendProps, tooltipProps, brlAxis, brlTooltip } from "@/lib/chartTheme";
import { useReducedMotion } from "@/lib/useReducedMotion";

export default function MonthlyTrendChart() {
  const reduced = useReducedMotion();
  const data = getMonthlyWithSaldo();
  const last = data[data.length - 1];

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={data} margin={{ top: 28, right: 24, bottom: 0, left: -8 }}>
        <defs>
          <linearGradient id="saldoGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_COLORS.tertiary} stopOpacity={0.15} />
            <stop offset="100%" stopColor={CHART_COLORS.tertiary} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid {...gridProps} vertical={false} />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} axisLine={false} tickFormatter={brlAxis} width={48} />
        <Tooltip {...tooltipProps} formatter={(value, name) => [brlTooltip(value as number), name]} />
        <Legend {...legendProps} />
        <Bar isAnimationActive={!reduced} dataKey="saldo" name="Saldo do mês" fill={CHART_COLORS.tertiaryDark} radius={[4, 4, 0, 0]} maxBarSize={22} />
        <Area isAnimationActive={!reduced}
          type="monotone"
          dataKey="acumulado"
          name="Saldo acumulado"
          stroke={CHART_COLORS.tertiary}
          strokeWidth={2.5}
          fill="url(#saldoGradient)"
          dot={false}
          activeDot={{ r: 5, fill: CHART_COLORS.tertiary, stroke: "#0a0a0a", strokeWidth: 2 }}
        />
        <ReferenceDot
          x={last.month}
          y={last.acumulado}
          r={5}
          fill={CHART_COLORS.tertiary}
          stroke="#0a0a0a"
          strokeWidth={2}
          label={{
            value: brlCompact(last.acumulado),
            position: "top",
            fill: UI_COLORS.textPrimary,
            fontSize: 13,
            fontWeight: 600,
            offset: 10,
          }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
