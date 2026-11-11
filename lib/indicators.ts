// lib/indicators.ts
// Funções que derivam indicadores a partir dos dados brutos de lib/data.ts.
// Quando os dados reais substituírem os placeholders, os indicadores — e os
// números citados nos títulos narrativos — se recalculam automaticamente.

import {
  avgTimeBetweenPurchases,
  churnRisk,
  cohortData,
  customerJourney,
  customerProfiles,
  debtors,
  fixedExpenses,
  lowStock,
  manualAlerts,
  marginByProduct,
  metas,
  monthlyFinancials,
  newVsReturning,
  paymentMethods,
  periodoAnterior,
  processComparison,
  purchaseFrequency,
  retentionRate,
  salesMix,
  stockTurnover,
  topProducts,
  type Severity,
} from "./data";
import { brl, num, pct, times } from "./format";

const sum = <T>(arr: readonly T[], fn: (x: T) => number) => arr.reduce((s, x) => s + fn(x), 0);
const avg = (arr: readonly number[]) => (arr.length ? sum(arr, (x) => x) / arr.length : 0);
const variation = (from: number, to: number) => ((to - from) / from) * 100;
const last = <T>(arr: readonly T[]) => arr[arr.length - 1];

// ── Totais base ──
export const totalFaturamento = sum(monthlyFinancials, (m) => m.faturamento);
export const totalCMV = sum(monthlyFinancials, (m) => m.cmv);
export const totalDespesasFixas = sum(monthlyFinancials, (m) => m.despesasFixas);
export const totalTransacoes = sum(salesMix, (c) => c.transactions);
export const totalClientesAtivos = sum(customerProfiles, (p) => p.count);

// ══════════════════════════════════════════════
// ATO 1: KPIs de resultado
// ══════════════════════════════════════════════
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
  const ret = retencaoResumo();

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
      id: "clientesAtivos",
      label: "Clientes Ativos",
      value: num(totalClientesAtivos),
      delta: `compraram nos últimos ${metas.diasInativo} dias`,
      tone: "neutral",
      icon: "Users",
    },
    {
      id: "retencao",
      label: "Taxa de Retenção",
      value: `${num(ret.atual)}%`,
      delta: `${ret.variacao >= 0 ? "+" : "−"}${num(Math.abs(ret.variacao))} p.p. desde ${ret.primeiroMes}`,
      tone: ret.variacao >= 0 ? "positive" : "negative",
      icon: "UserCheck",
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

// ══════════════════════════════════════════════
// ATO 2: Composição de receita + perfil do cliente
// ══════════════════════════════════════════════
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

/** Produto com maior preço médio por unidade vendida */
export function liderTicketUnitario() {
  return [...topProducts]
    .map((p) => ({ ...p, unitario: p.revenue / p.units }))
    .sort((a, b) => b.unitario - a.unitario)[0];
}

export const PAYMENT_KEYS = ["pix", "credito", "debito", "dinheiro", "fiado"] as const;
export type PaymentKey = (typeof PAYMENT_KEYS)[number];

export function variacaoPagamento(key: PaymentKey) {
  const first = paymentMethods[0][key];
  const lastValue = last(paymentMethods)[key];
  return variation(first, lastValue);
}

export function sharePagamento(key: PaymentKey) {
  const total = sum(paymentMethods, (m) => sum(PAYMENT_KEYS, (k) => m[k]));
  return (sum(paymentMethods, (m) => m[key]) / total) * 100;
}

export function getCustomerProfiles() {
  return [...customerProfiles]
    .map((p) => ({ ...p, percentClientes: (p.count / totalClientesAtivos) * 100 }))
    .sort((a, b) => b.percentReceita - a.percentReceita);
}

/** Perfil B2B de maior receita comparado à pessoa física */
export function destaqueB2B() {
  const profiles = getCustomerProfiles();
  const pf = profiles.find((p) => p.type.toLowerCase().includes("física"))!;
  const b2b = profiles.filter((p) => p !== pf).sort((a, b) => b.percentReceita - a.percentReceita)[0];
  return { pf, b2b, ticketRatio: b2b.ticketMedio / pf.ticketMedio };
}

// ══════════════════════════════════════════════
// ATO 3: Estrutura de custos + margens
// ══════════════════════════════════════════════
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

/** Faixa de margem bruta mensal (mín/máx/média) */
export function faixaMargemMensal() {
  const margens = getMonthlyWithSaldo().map((m) => m.margem);
  return { min: Math.min(...margens), max: Math.max(...margens), media: avg(margens) };
}

export function getMarginRanked() {
  return [...marginByProduct].sort((a, b) => b.margin - a.margin);
}

export function margemMediaProdutos() {
  return avg(marginByProduct.map((p) => p.margin));
}

/** Margem média dos produtos cujas categorias estão em `categorias`. */
export function margemMediaDe(categorias: readonly string[]) {
  return avg(marginByProduct.filter((p) => categorias.includes(p.category)).map((p) => p.margin));
}

export function produtosAbaixoMargemMinima() {
  return getMarginRanked().filter((p) => p.margin < metas.margemMinimaProduto);
}

// ══════════════════════════════════════════════
// ATO 4: Eficiência operacional
// ══════════════════════════════════════════════
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

// ══════════════════════════════════════════════
// ATO 5: Jornada do cliente
// ══════════════════════════════════════════════
export function getFunnel() {
  const top = customerJourney[0].count;
  return customerJourney.map((s, i) => {
    const prev = i > 0 ? customerJourney[i - 1].count : s.count;
    return {
      ...s,
      percent: (s.count / top) * 100,
      conversao: (s.count / prev) * 100, // vs etapa anterior
      perdidos: prev - s.count,
    };
  });
}

/** % da base do funil que chegou à última etapa */
export function conversaoFunil() {
  return (last(customerJourney).count / customerJourney[0].count) * 100;
}

/** Maior perda (em clientes) entre etapas depois da 1ª compra */
export function maiorPerdaPosCompra() {
  const steps = getFunnel().slice(2);
  const worst = [...steps].sort((a, b) => b.perdidos - a.perdidos)[0];
  const idx = customerJourney.findIndex((s) => s.stage === worst.stage);
  return { ...worst, from: customerJourney[idx - 1], naoVoltaram: 100 - worst.conversao };
}

export function getNewVsReturning() {
  return newVsReturning.map((m) => {
    const total = m.novos + m.recorrentes;
    return { ...m, total, shareRecorrentes: (m.recorrentes / total) * 100 };
  });
}

/** Primeiro mês a partir do qual recorrentes superam novos em todos os meses seguintes */
export function mesViradaRecorrentes() {
  const data = getNewVsReturning();
  for (let i = 0; i < data.length; i++) {
    if (data.slice(i).every((m) => m.recorrentes > m.novos)) return data[i].month;
  }
  return null;
}

export function getPurchaseFrequency() {
  const total = sum(purchaseFrequency, (f) => f.count);
  return purchaseFrequency.map((f) => ({ ...f, percent: (f.count / total) * 100 }));
}

export function compraUnica() {
  const f = getPurchaseFrequency().find((x) => "single" in x && x.single)!;
  return { count: f.count, percent: f.percent };
}

/** % de clientes no grupo de maior frequência e % com 4+ compras (base recorrente) */
export function frequenciaResumo() {
  const freq = getPurchaseFrequency();
  const topo = last(freq);
  const base4mais = sum(freq.slice(2), (f) => f.percent); // faixas a partir de "4–6 compras"
  return { topo, base4mais };
}

/** Estimativa de receita ao reativar `pct`% dos clientes de compra única */
export function estimativaReativacao(pctAlvo = 10) {
  const clientes = Math.round((compraUnica().count * pctAlvo) / 100);
  const valor = clientes * metas.comprasPorClienteReativado * calcularTicketMedio();
  return { pctAlvo, clientes, valor };
}

export function getPurchaseIntervals() {
  return avgTimeBetweenPurchases.map((p) => ({
    ...p,
    acimaDaMeta: p.ideal !== null && p.avgDays > p.ideal,
  }));
}

export function getProcesses() {
  return processComparison;
}

// ══════════════════════════════════════════════
// ATO 6: Retenção, churn e alertas
// ══════════════════════════════════════════════
export function retencaoResumo() {
  const first = retentionRate[0];
  const lastPoint = last(retentionRate);
  let salto = { from: first.month, to: first.month, delta: -Infinity };
  for (let i = 1; i < retentionRate.length; i++) {
    const d = retentionRate[i].rate - retentionRate[i - 1].rate;
    if (d > salto.delta) salto = { from: retentionRate[i - 1].month, to: retentionRate[i].month, delta: d };
  }
  return {
    inicial: first.rate,
    atual: lastPoint.rate,
    primeiroMes: first.month,
    ultimoMes: lastPoint.month,
    variacao: lastPoint.rate - first.rate,
    salto,
  };
}

/** Retenção média antes × depois da automação de pós-venda (marcada com `retencao: true`). */
export function retencaoAntesDepois() {
  const proc = processComparison.find((p) => "retencao" in p && p.retencao);
  if (!proc) return null;
  const idx = retentionRate.findIndex((r) => r.month === proc.implantadoEm);
  if (idx <= 0) return null;
  return {
    processo: proc.process,
    mes: proc.implantadoEm,
    antes: avg(retentionRate.slice(0, idx).map((r) => r.rate)),
    depois: avg(retentionRate.slice(idx).map((r) => r.rate)),
  };
}

/** Receita do semestre associada a 1 p.p. de retenção (1% da base ativa × receita média por cliente) */
export function valorPontoRetencao() {
  const receitaPorCliente = totalFaturamento / totalClientesAtivos;
  return totalClientesAtivos * 0.01 * receitaPorCliente;
}

export const COHORT_OFFSETS = Math.max(...cohortData.map((c) => c.values.length));

export function getCohort() {
  return cohortData;
}

/** Coorte com maior retenção no mês seguinte (m+1) */
export function melhorCoorteM1() {
  return [...cohortData]
    .filter((c) => c.values[0] !== null)
    .sort((a, b) => (b.values[0] ?? 0) - (a.values[0] ?? 0))[0];
}

/** Faixa de retenção de longo prazo (m+3 em diante) */
export function faixaRetencaoLongoPrazo() {
  const values = cohortData.flatMap((c) => c.values.slice(2)).filter((v): v is number => v !== null);
  return { min: Math.min(...values), max: Math.max(...values) };
}

export type ChurnLevel = "alto" | "medio";

export function getChurnRisk() {
  return churnRisk
    .map((c) => {
      const fator = c.diasInativo / c.intervaloMedio;
      const risco: ChurnLevel = c.diasInativo >= metas.churnDiasAlto || fator >= metas.churnFatorAlto ? "alto" : "medio";
      return { ...c, fator, risco };
    })
    .sort((a, b) => (a.risco === b.risco ? b.fator - a.fator : a.risco === "alto" ? -1 : 1));
}

export function churnResumo() {
  const list = getChurnRisk();
  const b2b = list.filter((c) => c.tipo === "B2B");
  return {
    total: list.length,
    alto: list.filter((c) => c.risco === "alto"),
    b2b,
    inativosAcima: list.filter((c) => c.diasInativo > metas.diasInativo),
  };
}

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

  // Churn
  for (const c of getChurnRisk().filter((x) => x.risco === "alto")) {
    derived.push(
      c.tipo === "B2B"
        ? {
            severity: "critical",
            icon: "UserMinus",
            message: `${c.cliente}: ${c.diasInativo} dias sem pedido (média era ${c.intervaloMedio} dias) — possível perda de conta B2B`,
          }
        : {
            severity: "warning",
            icon: "UserX",
            message: `${c.cliente}: ${c.diasInativo} dias sem comprar (${c.comprasTotal} compras, ticket ${brl(c.ticketMedio)}) — reativar`,
          },
    );
  }

  // Estoque
  for (const item of lowStock) {
    const critical = item.unidades <= item.minimo / 3;
    const margem = marginByProduct.find((p) => item.produto.startsWith(p.name) || p.name.startsWith(item.produto));
    const extra = critical
      ? ` — reposição urgente${margem ? ` (margem ${pct(margem.margin)})` : ""}`
      : item.altoGiro
        ? " — item de alto giro"
        : " — incluir no próximo pedido";
    derived.push({
      severity: critical ? "critical" : "warning",
      icon: critical ? "PackageX" : "Package",
      message: `${item.produto}: ${item.unidades} ${item.unidades === 1 ? "unidade" : "unidades"} (mín. ${item.minimo})${extra}`,
    });
  }

  // Financeiro
  const vencidos90 = fiadosAcimaDe(90);
  if (vencidos90.count > 0) {
    derived.push({
      severity: "critical",
      icon: "AlertTriangle",
      message: `${vencidos90.count} ${vencidos90.count === 1 ? "cliente" : "clientes"} com fiado acima de 90 dias — total: ${brl(vencidos90.total)}`,
    });
  }

  // Operacional / processos
  for (const cat of categoriasEstoqueCritico()) {
    derived.push({
      severity: "info",
      icon: "RotateCcw",
      message: `Giro de ${cat.category.toLowerCase()} abaixo do ideal (${times(cat.turnover)} vs meta ${metas.giroEstoque}x)`,
    });
  }
  const unica = compraUnica();
  derived.push({
    severity: "info",
    icon: "Mail",
    message: `${pct(unica.percent)} dos clientes compraram só 1 vez — ativar o fluxo de pós-venda para esse grupo`,
  });
  for (const p of getPurchaseIntervals().filter((x) => x.acimaDaMeta)) {
    derived.push({
      severity: "info",
      icon: "Clock",
      message: `Intervalo entre compras de ${p.profile}: ${p.avgDays} dias (meta ${p.ideal}) — reengajar com campanhas periódicas`,
    });
  }

  const order: Record<Severity, number> = { critical: 0, warning: 1, info: 2 };
  return [...derived, ...manualAlerts].sort((a, b) => order[a.severity] - order[b.severity]);
}
