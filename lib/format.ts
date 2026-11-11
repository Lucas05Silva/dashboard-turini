// Formatadores pt-BR usados em cards, títulos narrativos e tooltips.

const nf = (min: number, max = min) =>
  new Intl.NumberFormat("pt-BR", { minimumFractionDigits: min, maximumFractionDigits: max });

/** R$ 142.680 (sem centavos) ou R$ 82,43 (com `cents`) */
export function brl(value: number, cents = false) {
  return `R$ ${nf(cents ? 2 : 0).format(value)}`;
}

/** R$ 12,5K · R$ 1,2M — para títulos e eixos */
export function brlCompact(value: number) {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `R$ ${nf(0, 1).format(value / 1_000_000)}M`;
  if (abs >= 1_000) return `R$ ${nf(0, 1).format(value / 1_000)}K`;
  return `R$ ${nf(0).format(value)}`;
}

/** 45,0% — `digits` casas decimais */
export function pct(value: number, digits = 1) {
  return `${nf(digits).format(value)}%`;
}

/** 1.731 */
export function num(value: number, digits = 0) {
  return nf(digits).format(value);
}

/** 4,4x */
export function times(value: number) {
  return `${nf(1).format(value)}x`;
}

/** +22% / −71% — variação com sinal */
export function signedPct(value: number, digits = 0) {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${nf(digits).format(Math.abs(value))}%`;
}
