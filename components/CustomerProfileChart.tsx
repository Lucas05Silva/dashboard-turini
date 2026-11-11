"use client";

import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getCustomerProfiles } from "@/lib/indicators";
import { brl, num, pct } from "@/lib/format";
import { CHART_COLORS, axisProps, gridProps, tooltipProps } from "@/lib/chartTheme";
import { useReducedMotion } from "@/lib/useReducedMotion";
import AxisTick from "./AxisTick";
import BarEndLabel from "./BarEndLabel";

const pct0 = (v: number) => pct(v, 0);
const brl0 = (v: number) => brl(v);

/**
 * Small multiples: % da receita e ticket médio por tipo de cliente, lado a lado
 * (mesma ordem de linhas, escalas independentes — sem eixo duplo).
 */
export default function CustomerProfileChart() {
  const reduced = useReducedMotion();
  const data = getCustomerProfiles();
  const isPF = (type: string) => type.toLowerCase().includes("física");

  const panel = (
    key: "percentReceita" | "ticketMedio",
    title: string,
    color: string,
    format: (v: number) => string,
    showAxis: boolean,
  ) => (
    <div className="min-w-0">
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-ink-muted">{title}</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 56, bottom: 0, left: 0 }}>
          <CartesianGrid {...gridProps} horizontal={false} />
          <XAxis type="number" hide domain={[0, "dataMax"]} />
          <YAxis
            type="category"
            dataKey="type"
            width={showAxis ? 150 : 0}
            hide={!showAxis}
            tick={<AxisTick maxChars={24} />}
            axisLine={axisProps.axisLine}
            tickLine={false}
          />
          <Tooltip
            {...tooltipProps}
            formatter={(value, _name, item) => [
              `${format(value as number)} · ${num(item.payload.count)} clientes`,
              title,
            ]}
          />
          <Bar isAnimationActive={!reduced} dataKey={key} barSize={20} radius={[0, 4, 4, 0]}>
            {data.map((d) => (
              <Cell key={d.type} fill={color} fillOpacity={isPF(d.type) ? 0.5 : 1} />
            ))}
            <LabelList dataKey={key} content={<BarEndLabel format={format} />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-[1.35fr_1fr]">
      {panel("percentReceita", "% da receita", CHART_COLORS.primary, pct0, true)}
      <div className="sm:pt-0">
        {/* No mobile os painéis empilham; o 2º repete os rótulos para continuar legível */}
        <div className="sm:hidden">{panel("ticketMedio", "Ticket médio", CHART_COLORS.tertiary, brl0, true)}</div>
        <div className="hidden sm:block">{panel("ticketMedio", "Ticket médio", CHART_COLORS.tertiary, brl0, false)}</div>
      </div>
    </div>
  );
}
