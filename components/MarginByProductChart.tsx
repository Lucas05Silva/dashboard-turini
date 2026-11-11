"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getMarginRanked, margemMediaProdutos } from "@/lib/indicators";
import { pct } from "@/lib/format";
import { CHART_COLORS, UI_COLORS, axisProps, gridProps, tooltipProps } from "@/lib/chartTheme";
import { useReducedMotion } from "@/lib/useReducedMotion";
import AxisTick from "./AxisTick";
import BarEndLabel from "./BarEndLabel";

export default function MarginByProductChart() {
  const reduced = useReducedMotion();
  const data = getMarginRanked();
  const avg = margemMediaProdutos();

  return (
    <ResponsiveContainer width="100%" height={380}>
      <BarChart data={data} layout="vertical" margin={{ top: 18, right: 48, bottom: 0, left: 0 }}>
        <CartesianGrid {...gridProps} horizontal={false} />
        <XAxis
          type="number"
          domain={[0, 60]}
          ticks={[0, 15, 30, 45, 60]}
          {...axisProps}
          axisLine={false}
          tickFormatter={(v: number) => `${v}%`}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={132}
          tick={<AxisTick maxChars={24} />}
          axisLine={axisProps.axisLine}
          tickLine={false}
          interval={0}
        />
        <Tooltip
          {...tooltipProps}
          formatter={(value, _name, item) => [`${pct(value as number)} · ${item.payload.category}`, "Margem"]}
        />
        <ReferenceLine
          x={avg}
          stroke={UI_COLORS.textMuted}
          strokeWidth={1}
          label={{ value: `Média ${pct(avg)}`, position: "top", fill: UI_COLORS.textSecondary, fontSize: 11 }}
        />
        <Bar isAnimationActive={!reduced} dataKey="margin" barSize={16} radius={[0, 4, 4, 0]}>
          {data.map((d) => (
            <Cell key={d.name} fill={CHART_COLORS.tertiary} fillOpacity={d.margin >= avg ? 1 : 0.45} />
          ))}
          <LabelList
            dataKey="margin"
            content={<BarEndLabel format={pct} />}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
