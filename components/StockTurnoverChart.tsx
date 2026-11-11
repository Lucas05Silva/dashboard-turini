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
import { getStockTurnoverRanked, type StockStatus } from "@/lib/indicators";
import { metas } from "@/lib/data";
import { times } from "@/lib/format";
import { CHART_COLORS, UI_COLORS, axisProps, gridProps, tooltipProps } from "@/lib/chartTheme";
import { useReducedMotion } from "@/lib/useReducedMotion";
import AxisTick from "./AxisTick";
import BarEndLabel from "./BarEndLabel";
import StatusBadge from "./StatusBadge";

const GROUPS: { status: StockStatus; hint: string }[] = [
  { status: "ideal", hint: `≥ ${metas.giroEstoque}x` },
  { status: "atencao", hint: `3x – ${metas.giroEstoque}x` },
  { status: "baixo", hint: "< 3x" },
];

export default function StockTurnoverChart() {
  const reduced = useReducedMotion();
  const data = getStockTurnoverRanked();
  const max = Math.ceil(Math.max(metas.giroEstoque, ...data.map((d) => d.turnover)) + 1);

  return (
    <div>
      <ResponsiveContainer width="100%" height={290}>
        <BarChart data={data} layout="vertical" margin={{ top: 18, right: 44, bottom: 0, left: 0 }}>
          <CartesianGrid {...gridProps} horizontal={false} />
          <XAxis type="number" domain={[0, max]} {...axisProps} axisLine={false} tickFormatter={(v: number) => `${v}x`} />
          <YAxis
            type="category"
            dataKey="category"
            width={128}
            tick={<AxisTick maxChars={24} />}
            axisLine={axisProps.axisLine}
            tickLine={false}
          />
          <Tooltip {...tooltipProps} formatter={(value) => [times(value as number), "Giro no semestre"]} />
          <ReferenceLine
            x={metas.giroEstoque}
            stroke={UI_COLORS.textMuted}
            strokeWidth={1}
            label={{ value: `Meta ${metas.giroEstoque}x`, position: "top", fill: UI_COLORS.textSecondary, fontSize: 11 }}
          />
          <Bar isAnimationActive={!reduced} dataKey="turnover" barSize={18} radius={[0, 4, 4, 0]}>
            {data.map((d) => (
              <Cell
                key={d.category}
                fill={CHART_COLORS.primary}
                fillOpacity={d.turnover >= metas.giroEstoque ? 1 : 0.55}
              />
            ))}
            <LabelList
              dataKey="turnover"
              content={<BarEndLabel format={times} />}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <dl className="mt-4 grid gap-2 border-t border-white/[0.06] pt-4 text-xs sm:grid-cols-3">
        {GROUPS.map((g) => {
          const items = data.filter((d) => d.status === g.status);
          return (
            <div key={g.status} className="flex flex-col gap-1.5">
              <dt className="flex items-center gap-2">
                <StatusBadge status={g.status} />
                <span className="text-ink-muted">{g.hint}</span>
              </dt>
              <dd className="text-ink-secondary">{items.length ? items.map((i) => i.category).join(", ") : "—"}</dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
