"use client";

import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getTopProductsRanked } from "@/lib/indicators";
import { brlCompact, num } from "@/lib/format";
import { CHART_COLORS, UI_COLORS, axisProps, gridProps, tooltipProps, brlTooltip } from "@/lib/chartTheme";
import { useReducedMotion } from "@/lib/useReducedMotion";
import AxisTick from "./AxisTick";
import BarEndLabel from "./BarEndLabel";

export default function TopProductsChart() {
  const reduced = useReducedMotion();
  const data = getTopProductsRanked();

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 56, bottom: 0, left: 0 }}>
        <CartesianGrid {...gridProps} horizontal={false} />
        <XAxis type="number" hide domain={[0, "dataMax"]} />
        <YAxis
          type="category"
          dataKey="name"
          width={160}
          tick={<AxisTick maxChars={24} />}
          axisLine={axisProps.axisLine}
          tickLine={false}
        />
        <Tooltip
          {...tooltipProps}
          formatter={(value, _name, item) => [
            `${brlTooltip(value as number)} · ${num(item.payload.units)} un.`,
            "Faturamento",
          ]}
        />
        <Bar isAnimationActive={!reduced} dataKey="revenue" barSize={20} radius={[0, 4, 4, 0]}>
          {data.map((d, i) => (
            <Cell key={d.name} fill={CHART_COLORS.primary} fillOpacity={i === 0 ? 1 : 0.7} />
          ))}
          <LabelList
            dataKey="revenue"
            content={<BarEndLabel format={brlCompact} />}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
