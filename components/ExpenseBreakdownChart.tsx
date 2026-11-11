"use client";

import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getExpenseBreakdown } from "@/lib/indicators";
import { pct } from "@/lib/format";
import { CHART_COLORS, UI_COLORS, axisProps, gridProps, tooltipProps, brlTooltip } from "@/lib/chartTheme";
import { useReducedMotion } from "@/lib/useReducedMotion";
import AxisTick from "./AxisTick";
import BarEndLabel from "./BarEndLabel";

export default function ExpenseBreakdownChart() {
  const reduced = useReducedMotion();
  const data = getExpenseBreakdown();

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 48, bottom: 0, left: 0 }}>
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
            `${brlTooltip(value as number)} · ${pct(item.payload.percent)}`,
            "Gasto no semestre",
          ]}
        />
        <Bar isAnimationActive={!reduced} dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
          {data.map((d, i) => (
            <Cell key={d.name} fill={i === 0 ? CHART_COLORS.secondary : CHART_COLORS.secondaryLight} fillOpacity={i === 0 ? 1 : 0.7} />
          ))}
          <LabelList
            dataKey="percent"
            content={<BarEndLabel format={pct} />}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
