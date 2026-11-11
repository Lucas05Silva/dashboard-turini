// lib/indicators.ts
// Funções que derivam indicadores a partir dos dados brutos de lib/data.ts.
// Quando os dados reais substituírem os placeholders, os indicadores — e os
// números citados nos títulos narrativos — se recalculam automaticamente.

import {
  debtors,
  fixedExpenses,
  lowStock,
  manualAlerts,
  marginByProduct,
  metas,
  monthlyFinancials,
  paymentMethods,
  periodoAnterior,
  salesMix,
  stockTurnover,
  topProducts,
  type Severity,
} from "./data";
import { brl, num, times } from "./format";

const sum = <T>(arr: readonly T[], fn: (x: T) => number) => arr.reduce((s, x) => s + fn(x), 0);
const variation = (from: number, to: number) => ((to - from) / from) * 100;

// ── Totais base ──
export const totalFaturamento = sum(monthlyFinancials, (m) => m.faturamento);
export const totalCMV = sum(monthlyFinancials, (m) => m.cmv);
export const totalDespesasFixas = sum(monthlyFinancials, (m) => m.despesasFixas);
export const totalTransacoes = sum(salesMix, (c) => c.transactions);

// ── ATO 1: KPIs de resultado ──
export function calcularMargemBruta() {
  return ((totalFaturamento - totalCMV) / totalFaturamento) * 100;
}

export function calcularTicketMedio() {
  return totalFaturamento / totalTransacoes;
}

export function calcularSaldo() {
  return totalFaturamento - totalCMV - totalDespesasFixas;
}

export function calcularCrescimentoFaturamento() {
  return variation(periodoAnterior.faturamento, totalFaturamento);
}

export function calcularTotalFiado() {
  return sum(debtors, (d) => d.valor);
}

export function calcularInadimplenciaPercent() {
  return (calcularTotalFiado() / totalFaturamento) * 100;
}

export function calcularGiroMedio() {
  return sum(stockTurnover, (s) => s.turnover) / stockTurnover.length;
}

export type Tone = "positive" | "negative" | "neutral";

export type Kpi = {
  id: string;
  label: string;
  value: string;
  delta: string;
  tone: Tone;
  icon: string;
};

export function getKpis(): Kpi[] {
  const margem = calcularMargemBruta();
  const ticket = calcularTicketMedio();
  const saldo = calcularSaldo();
  const cresc = calcularCrescimentoFaturamento();
  const inad = calcularInadimplenciaPercent();
  const giro = calcularGiroMedio();
  const ticketDiff = ticket - periodoAnterior.ticketMedio;
  const meses = monthlyFinancials.length;

  return [
    {
      id: "faturamento",
      label: "Faturamento Bruto",
      value: brl(totalFaturamento),
      delta: `${cresc >= 0 ? "+" : "−"}${num(Math.abs(cresc))}% vs semestre anterior`,
      tone: cresc >= 0 ? "positive" : "negative",
      icon: "DollarSign",
    },
    {
      id: "cmv",
      label: "Custo Mercadoria (CMV)",
      value: brl(totalCMV),
      delta: `${num((totalCMV / totalFaturamento) * 100)}% do faturamento`,
      tone: "neutral",
      icon: "Package",
    },
    {
      id: "margem",
      label: "Margem Bruta",
      value: `${num(margem)}%`,
      delta: `Meta: ${metas.margemBruta}%`,
      tone: margem >= metas.margemBruta ? "positive" : "negative",
      icon: "TrendingUp",
    },
    {
      id: "ticket",
      label: "Ticket Médio",
      value: brl(ticket, true),
      delta: `${ticketDiff >= 0 ? "+" : "−"}${brl(Math.abs(ticketDiff), true)} vs anterior`,
      tone: ticketDiff >= 0 ? "positive" : "negative",
      icon: "Receipt",
    },
    {
      id: "transacoes",
      label: "Nº de Vendas",
      value: num(totalTransacoes),
      delta: `~${num(totalTransacoes / meses)}/mês`,
      tone: "neutral",
      icon: "ShoppingCart",
    },
    {
      id: "saldo",
      label: "Saldo do Período",
      value: brl(saldo),
      delta: saldo >= 0 ? "Positivo após CMV e despesas" : "Negativo",
      tone: saldo >= 0 ? "positive" : "negative",
      icon: "Wallet",
    },
    {
      id: "inadimplencia",
      label: "Inadimplência (Fiados)",
      value: brl(calcularTotalFiado()),
      delta: `${num(inad, 1)}% do faturamento`,
      tone: inad > 1 ? "negative" : "neutral",
      icon: "AlertTriangle",
    },
    {
      id: "giro",
      label: "Giro Médio Estoque",
      value: times(giro),
      delta: `Ideal: ${metas.giroEstoque}x+`,
      tone: giro >= metas.giroEstoque ? "positive" : "negative",
      icon: "RotateCcw",
    },
  ];
}

// ── ATO 2: Composição de receita ──
export function getSalesMixRanked() {
  return [...salesMix]
    .map((c) => ({ ...c, percent: (c.revenue / totalFaturamento) * 100 }))
    .sort((a, b) => b.revenue - a.revenue);
}

export function shareTopCategorias(n = 3) {
  return sum(getSalesMixRanked().slice(0, n), (c) => c.percent);
}

/** Participação somada das categorias cujo nome começa com "Vinho" (tintos + brancos/rosé) */
export function shareVinhos() {
  return sum(
    getSalesMixRanked().filter((c) => c.category.toLowerCase().startsWith("vinho")),
    (c) => c.percent,
  );
}

export function getTopProductsRanked() {
  return [...topProducts].sort((a, b) => b.revenue - a.revenue);
}

export function shareTopProdutos() {
  return (sum(topProducts, (p) => p.revenue) / totalFaturamento) * 100;
}

export const PAYMENT_KEYS = ["pix", "credito", "debito", "dinheiro", "fiado"] as const;
export type PaymentKey = (typeof PAYMENT_KEYS)[number];

export function variacaoPagamento(key: PaymentKey) {
  const first = paymentMethods[0][key];
  const last = paymentMethods[paymentMethods.length - 1][key];
  return variation(first, last);
}

export function sharePagamento(key: PaymentKey) {
  const total = sum(paymentMethods, (m) => sum(PAYMENT_KEYS, (k) => m[k]));
  return (sum(paymentMethods, (m) => m[key]) / total) * 100;
}

// ── ATO 3: Estrutura de custos ──
export function getExpenseBreakdown() {
  const all = [{ name: "Compra de Mercadoria (CMV)", value: totalCMV }, ...fixedExpenses];
  const total = sum(all, (e) => e.value);
  return all
    .map((e) => ({ ...e, percent: (e.value / total) * 100 }))
    .sort((a, b) => b.value - a.value);
}

export function getMonthlyWithSaldo() {
  let acumulado = 0;
  return monthlyFinancials.map((m) => {
    const saldo = m.faturamento - m.cmv - m.despesasFixas;
    acumulado += saldo;
    return {
      ...m,
      saldo,
      acumulado,
      margem: ((m.faturamento - m.cmv) / m.faturamento) * 100,
    };
  });
}

export function mesesPositivos() {
  return getMonthlyWithSaldo().filter((m) => m.saldo > 0).length;
}

// ── ATO 4: Eficiência operacional ──
export type StockStatus = "ideal" | "atencao" | "baixo";

export function statusGiro(turnover: number): StockStatus {
  if (turnover >= metas.giroEstoque) return "ideal";
  if (turnover >= 3) return "atencao";
  return "baixo";
}

export function getStockTurnoverRanked() {
  return [...stockTurnover]
    .map((s) => ({ ...s, status: statusGiro(s.turnover) }))
    .sort((a, b) => b.turnover - a.turnover);
}

export function categoriasEstoqueCritico() {
  return getStockTurnoverRanked().filter((s) => s.status === "baixo");
}

export function getMarginRanked() {
  return [...marginByProduct].sort((a, b) => b.margin - a.margin);
}

export function margemMediaProdutos() {
  return sum(marginByProduct, (p) => p.margin) / marginByProduct.length;
}

/** Margem média dos produtos cujas categorias estão em `categorias`. */
export function margemMediaDe(categorias: readonly string[]) {
  const list = marginByProduct.filter((p) => categorias.includes(p.category));
  return list.length ? sum(list, (p) => p.margin) / list.length : 0;
}

/** Faixa de margem bruta mensal (mín/máx/média) */
export function faixaMargemMensal() {
  const margens = getMonthlyWithSaldo().map((m) => m.margem);
  return {
    min: Math.min(...margens),
    max: Math.max(...margens),
    media: sum(margens, (m) => m) / margens.length,
  };
}

// ── ATO 5: Alertas e pendências ──
export function getDebtorsSorted() {
  return [...debtors].sort((a, b) => b.diasAtraso - a.diasAtraso);
}

export function fiadosAcimaDe(dias: number) {
  const list = debtors.filter((d) => d.diasAtraso > dias);
  return { count: list.length, total: sum(list, (d) => d.valor), list };
}

export type Alert = { severity: Severity; message: string; icon: string };

/** Alertas derivados dos dados + pendências manuais, ordenados por severidade. */
export function getAlerts(): Alert[] {
  const derived: Alert[] = [];

  for (const item of lowStock) {
    const critical = item.unidades <= item.minimo / 3;
    derived.push({
      severity: critical ? "critical" : "warning",
      icon: critical ? "PackageX" : "Package",
      message: `${item.produto}: ${item.unidades} ${item.unidades === 1 ? "unidade" : "unidades"} (mín. ${item.minimo})${
        critical ? " — reposição urgente" : item.altoGiro ? " — item de alto giro" : " — incluir no próximo pedido"
      }`,
    });
  }

  const vencidos90 = fiadosAcimaDe(90);
  if (vencidos90.count > 0) {
    derived.push({
      severity: "critical",
      icon: "AlertTriangle",
      message: `${vencidos90.count} ${vencidos90.count === 1 ? "cliente" : "clientes"} com fiado acima de 90 dias — total: ${brl(vencidos90.total)}`,
    });
  }

  for (const cat of categoriasEstoqueCritico()) {
    derived.push({
      severity: "info",
      icon: "RotateCcw",
      message: `Giro de ${cat.category.toLowerCase()} abaixo do ideal (${times(cat.turnover)} vs meta ${metas.giroEstoque}x)`,
    });
  }

  const order: Record<Severity, number> = { critical: 0, warning: 1, info: 2 };
  return [...derived, ...manualAlerts].sort((a, b) => order[a.severity] - order[b.severity]);
}
