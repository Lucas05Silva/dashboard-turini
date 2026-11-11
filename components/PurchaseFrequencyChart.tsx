"use client";

import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getPurchaseFrequency } from "@/lib/indicators";
import { num, pct } from "@/lib/format";
import { CHART_COLORS, axisProps, gridProps, tooltipProps } from "@/lib/chartTheme";
import { useReducedMotion } from "@/lib/useReducedMotion";
import AxisTick from "./AxisTick";
import BarEndLabel from "./BarEndLabel";

export default function PurchaseFrequencyChart() {
  const reduced = useReducedMotion();
  const data = getPurchaseFrequency();

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 52, bottom: 0, left: 0 }}>
        <CartesianGrid {...gridProps} horizontal={false} />
        <XAxis type="number" hide domain={[0, "dataMax"]} />
        <YAxis
          type="category"
          dataKey="frequency"
          width={112}
          tick={<AxisTick maxChars={20} />}
          axisLine={axisProps.axisLine}
          tickLine={false}
        />
        <Tooltip
          {...tooltipProps}
          formatter={(value, _name, item) => [`${num(value as number)} clientes · ${pct(item.payload.percent)}`, "Clientes"]}
        />
        <Bar isAnimationActive={!reduced} dataKey="count" barSize={20} radius={[0, 4, 4, 0]}>
          {/* Compra única em laranja: é o grupo-alvo da reativação */}
          {data.map((d) => (
            <Cell key={d.frequency} fill={"single" in d && d.single ? CHART_COLORS.secondary : CHART_COLORS.primary} fillOpacity={"single" in d && d.single ? 1 : 0.6} />
          ))}
          <LabelList dataKey="percent" content={<BarEndLabel format={(v) => pct(v)} />} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
