"use client";

import { Area, AreaChart, CartesianGrid, ReferenceDot, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { retentionRate } from "@/lib/data";
import { retencaoAntesDepois } from "@/lib/indicators";
import { CHART_COLORS, UI_COLORS, axisProps, gridProps, tooltipProps } from "@/lib/chartTheme";
import { useReducedMotion } from "@/lib/useReducedMotion";

export default function RetentionRateChart() {
  const reduced = useReducedMotion();
  const lastPoint = retentionRate[retentionRate.length - 1];
  const marco = retencaoAntesDepois();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={retentionRate} margin={{ top: 28, right: 24, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="retencaoGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_COLORS.tertiary} stopOpacity={0.15} />
            <stop offset="100%" stopColor={CHART_COLORS.tertiary} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid {...gridProps} vertical={false} />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} axisLine={false} domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickFormatter={(v: number) => `${v}%`} width={44} />
        <Tooltip {...tooltipProps} formatter={(value) => [`${value}%`, "Retenção"]} />
        {marco && (
          <ReferenceLine
            x={marco.mes}
            stroke={UI_COLORS.textMuted}
            strokeWidth={1}
            label={{ value: `${marco.processo} (${marco.mes})`, position: "insideTopLeft", fill: UI_COLORS.textSecondary, fontSize: 11, dy: -22 }}
          />
        )}
        <Area
          isAnimationActive={!reduced}
          type="monotone"
          dataKey="rate"
          name="Retenção"
          stroke={CHART_COLORS.tertiary}
          strokeWidth={2.5}
          fill="url(#retencaoGradient)"
          dot={false}
          activeDot={{ r: 5, fill: CHART_COLORS.tertiary, stroke: "#0a0a0a", strokeWidth: 2 }}
        />
        <ReferenceDot
          x={lastPoint.month}
          y={lastPoint.rate}
          r={5}
          fill={CHART_COLORS.tertiary}
          stroke="#0a0a0a"
          strokeWidth={2}
          label={{ value: `${lastPoint.rate}%`, position: "top", fill: UI_COLORS.textPrimary, fontSize: 13, fontWeight: 600, offset: 10 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
