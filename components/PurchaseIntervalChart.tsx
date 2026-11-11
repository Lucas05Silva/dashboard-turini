"use client";

import { Bar, BarChart, CartesianGrid, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getPurchaseIntervals } from "@/lib/indicators";
import { CHART_COLORS, axisProps, gridProps, legendProps, tooltipProps } from "@/lib/chartTheme";
import { useReducedMotion } from "@/lib/useReducedMotion";
import AxisTick from "./AxisTick";
import BarEndLabel from "./BarEndLabel";

const META_COLOR = "#5c5b57"; // cinza neutro: referência, não série de destaque
const dias = (v: number) => `${v} d`;

/** Intervalo médio real entre compras × meta, por perfil. */
export default function PurchaseIntervalChart() {
  const reduced = useReducedMotion();
  const data = getPurchaseIntervals();

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 44, bottom: 0, left: 0 }} barGap={2}>
        <CartesianGrid {...gridProps} horizontal={false} />
        <XAxis type="number" hide domain={[0, "dataMax"]} />
        <YAxis
          type="category"
          dataKey="profile"
          width={112}
          tick={<AxisTick maxChars={20} />}
          axisLine={axisProps.axisLine}
          tickLine={false}
        />
        <Tooltip
          {...tooltipProps}
          formatter={(value, name) => [value === null || value === undefined ? "sem meta (sazonal)" : `${value} dias`, name]}
        />
        <Legend {...legendProps} />
        <Bar isAnimationActive={!reduced} dataKey="avgDays" name="Intervalo real" fill={CHART_COLORS.primary} barSize={12} radius={[0, 4, 4, 0]}>
          <LabelList dataKey="avgDays" content={<BarEndLabel format={dias} />} />
        </Bar>
        <Bar isAnimationActive={!reduced} dataKey="ideal" name="Meta" fill={META_COLOR} barSize={12} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
