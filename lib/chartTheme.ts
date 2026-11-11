// Tema compartilhado dos gráficos Recharts (paleta validada p/ dark mode + daltonismo).

export const CHART_COLORS = {
  primary: "#3987e5", // azul — faturamento, valores positivos
  secondary: "#d95926", // laranja — despesas, custos
  tertiary: "#199e70", // verde-água — saldo, margem
  primaryLight: "#6aabe8",
  primaryDark: "#2a6ab5",
  secondaryLight: "#e8845c",
  secondaryDark: "#a8401a",
  tertiaryLight: "#3ec29a",
  tertiaryDark: "#127a54",
} as const;

// Cores de status — NUNCA usar como cor de série.
export const STATUS_COLORS = {
  ideal: "#0ca30c",
  atencao: "#fab219",
  baixo: "#ec835a",
  critico: "#d03b3b",
} as const;

export const UI_COLORS = {
  surface: "#1a1a19",
  textPrimary: "#f0efec",
  textSecondary: "#c3c2b7",
  textMuted: "#898781",
  gridline: "#2c2c2a",
  baseline: "#383835",
} as const;

export const gridProps = {
  stroke: UI_COLORS.gridline,
  strokeWidth: 1,
} as const;

export const tickStyle = { fill: UI_COLORS.textMuted, fontSize: 12 } as const;

export const axisProps = {
  tick: tickStyle,
  axisLine: { stroke: UI_COLORS.baseline },
  tickLine: false,
} as const;

export const tooltipProps = {
  cursor: { fill: "rgba(255,255,255,0.03)" },
  contentStyle: {
    background: UI_COLORS.gridline,
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    fontSize: 13,
    color: UI_COLORS.textPrimary,
    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
  },
  labelStyle: { color: UI_COLORS.textPrimary, fontWeight: 600, marginBottom: 4 },
  itemStyle: { color: UI_COLORS.textSecondary, padding: 0 },
} as const;

export const legendProps = {
  wrapperStyle: { fontSize: 12, color: UI_COLORS.textSecondary, paddingTop: 8 },
  iconType: "rect" as const,
  iconSize: 10,
};

export const brlTooltip = (value: number | string) =>
  `R$ ${Number(value).toLocaleString("pt-BR")}`;

export const truncate = (text: string, max: number) =>
  text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;

export const brlAxis =(value: number) =>
  value >= 1000 ? `${(value / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}K` : `${value}`;
