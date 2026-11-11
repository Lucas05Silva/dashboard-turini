"use client";

import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getSalesMixRanked } from "@/lib/indicators";
import { pct } from "@/lib/format";
import { CHART_COLORS, UI_COLORS, axisProps, gridProps, tooltipProps, brlTooltip } from "@/lib/chartTheme";
import { useReducedMotion } from "@/lib/useReducedMotion";
import AxisTick from "./AxisTick";
import BarEndLabel from "./BarEndLabel";

const HIGHLIGHT = 3; // top-N categorias em destaque

export default function SalesMixChart() {
  const reduced = useReducedMotion();
  const data = getSalesMixRanked();

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 48, bottom: 0, left: 0 }}>
        <CartesianGrid {...gridProps} horizontal={false} />
        <XAxis type="number" hide domain={[0, "dataMax"]} />
        <YAxis
          type="category"
          dataKey="category"
          width={138}
          tick={<AxisTick maxChars={24} />}
          axisLine={axisProps.axisLine}
          tickLine={false}
        />
        <Tooltip
          {...tooltipProps}
          formatter={(value, _name, item) => [
            `${brlTooltip(value as number)} · ${pct(item.payload.percent)}`,
            "Faturamento",
          ]}
        />
        <Bar isAnimationActive={!reduced} dataKey="revenue" barSize={20} radius={[0, 4, 4, 0]}>
          {data.map((d, i) => (
            <Cell key={d.category} fill={i < HIGHLIGHT ? CHART_COLORS.primary : CHART_COLORS.primaryDark} fillOpacity={i < HIGHLIGHT ? 1 : 0.55} />
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
