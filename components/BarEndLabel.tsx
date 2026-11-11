import { UI_COLORS } from "@/lib/chartTheme";

type Box = { x?: number; y?: number; width?: number; height?: number };

type Props = Box & {
  viewBox?: Box;
  value?: number | string;
  format?: (v: number) => string;
};

/**
 * Rótulo no fim de barras horizontais: linha única, opacidade total (não herda o
 * esmaecimento da barra) e halo na cor do card para não colidir com linhas de referência.
 * Usa o `viewBox` da barra (fornecido pelo LabelList) para posicionar logo após a ponta.
 */
export default function BarEndLabel({ viewBox, value, format, ...rest }: Props) {
  const box = viewBox ?? rest;
  const x = Number(box.x ?? 0) + Number(box.width ?? 0) + 6;
  const y = Number(box.y ?? 0) + Number(box.height ?? 0) / 2;
  const text = format ? format(Number(value)) : String(value ?? "");
  return (
    <text
      x={x}
      y={y}
      dy={4}
      fill={UI_COLORS.textSecondary}
      fontSize={12}
      stroke="#141414"
      strokeWidth={4}
      strokeLinejoin="round"
      paintOrder="stroke"
    >
      {text}
    </text>
  );
}
