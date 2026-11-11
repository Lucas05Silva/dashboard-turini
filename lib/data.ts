// lib/data.ts
// ─────────────────────────────────────────────────────────────────────────────
// FONTE ÚNICA DE DADOS DO DASHBOARD.
// Todos os valores abaixo são PLACEHOLDERS fictícios. Quando os dados reais
// chegarem, edite SÓ este arquivo — KPIs, percentuais e os números citados nos
// títulos narrativos são recalculados automaticamente em lib/indicators.ts.
//
// Regras de consistência (para os números baterem entre si):
//   • soma de salesMix.revenue        = soma de monthlyFinancials.faturamento
//   • soma de cada mês em paymentMethods = faturamento daquele mês
//   • soma de fixedExpenses.value     = soma de monthlyFinancials.despesasFixas
// ─────────────────────────────────────────────────────────────────────────────

export const ADEGA = {
  nome: "Turini Adega & Empórios",
  subtitulo: "Mapeamento e Controle de Indicadores de Gestão",
  periodo: "Janeiro a Junho 2024",
  periodoCurto: "Jan–Jun 2024",
  footer:
    "Dashboard gerado automaticamente via Power Automate + Excel · Projeto de Extensão Universitário",
} as const;

// ── Metas e base de comparação ──
export const metas = {
  margemBruta: 50, // %
  giroEstoque: 6, // vezes no período
  fiadoDiasMax: 60, // fiados acima disso devem ser zerados
} as const;

export const periodoAnterior = {
  faturamento: 116951,
  ticketMedio: 75.5,
} as const;

// ── ATO 2: Composição de Receita ──
export const salesMix = [
  { category: "Vinhos Tintos", revenue: 48312, transactions: 486 },
  { category: "Destilados", revenue: 27110, transactions: 198 },
  { category: "Espumantes", revenue: 18548, transactions: 215 },
  { category: "Cervejas", revenue: 14268, transactions: 412 },
  { category: "Massas Importadas", revenue: 11414, transactions: 178 },
  { category: "Conservas e Azeites", revenue: 10701, transactions: 98 },
  { category: "Vinhos Brancos/Rosé", revenue: 7134, transactions: 89 },
  { category: "Frios e Doces Import.", revenue: 5193, transactions: 55 },
];

export const topProducts = [
  { name: "Casillero del Diablo Cab Sauv", revenue: 12475, units: 250 },
  { name: "Whisky Jack Daniels 1L", revenue: 11394, units: 60 },
  { name: "Heineken Long Neck (cx 24)", revenue: 9360, units: 52 },
  { name: "Espumante Chandon Brut", revenue: 8991, units: 100 },
  { name: "Gin Tanqueray 750ml", revenue: 7194, units: 60 },
  { name: "Massa Penne De Cecco 500g", revenue: 5725, units: 250 },
  { name: "Azeite Gallo 500ml", revenue: 5148, units: 120 },
  { name: "Atum Rio Mare 160g", revenue: 4935, units: 150 },
];

export const paymentMethods = [
  { month: "Jan", pix: 8200, credito: 5100, debito: 3800, dinheiro: 2400, fiado: 980 },
  { month: "Fev", pix: 9100, credito: 5800, debito: 4200, dinheiro: 2100, fiado: 720 },
  { month: "Mar", pix: 10400, credito: 6200, debito: 4500, dinheiro: 1900, fiado: 540 },
  { month: "Abr", pix: 11200, credito: 6800, debito: 4100, dinheiro: 1700, fiado: 410 },
  { month: "Mai", pix: 11800, credito: 7100, debito: 4600, dinheiro: 1500, fiado: 320 },
  { month: "Jun", pix: 13330, credito: 7400, debito: 4800, dinheiro: 1400, fiado: 280 },
];

// ── ATO 3: Estrutura de Custos ──
export const monthlyFinancials = [
  { month: "Jan", faturamento: 20480, cmv: 11264, despesasFixas: 8420 },
  { month: "Fev", faturamento: 21920, cmv: 12056, despesasFixas: 8420 },
  { month: "Mar", faturamento: 23540, cmv: 12947, despesasFixas: 8420 },
  { month: "Abr", faturamento: 24210, cmv: 13316, despesasFixas: 8420 },
  { month: "Mai", faturamento: 25320, cmv: 13926, despesasFixas: 8420 },
  { month: "Jun", faturamento: 27210, cmv: 14966, despesasFixas: 8420 },
];

// Despesas operacionais do semestre (o CMV é somado automaticamente a partir
// de monthlyFinancials para compor a estrutura de custos completa).
export const fixedExpenses = [
  { name: "Aluguel", value: 19200 },
  { name: "Salários + Encargos", value: 16800 },
  { name: "Contador + Impostos", value: 6000 },
  { name: "Contas (luz, água, internet)", value: 3840 },
  { name: "Frete Importação", value: 2280 },
  { name: "Embalagens + Materiais", value: 1320 },
  { name: "Manutenção + Outros", value: 1080 },
];

// ── ATO 4: Eficiência Operacional ──
// Giro = vezes que o estoque da categoria "se renovou" no semestre.
// O status (ideal / atenção / baixo) é derivado da meta em lib/indicators.ts.
export const stockTurnover = [
  { category: "Cervejas", turnover: 8.2 },
  { category: "Frios Importados", turnover: 6.1 },
  { category: "Massas Importadas", turnover: 4.8 },
  { category: "Vinhos Tintos", turnover: 3.9 },
  { category: "Espumantes", turnover: 3.2 },
  { category: "Conservas/Azeites", turnover: 2.8 },
  { category: "Destilados", turnover: 2.1 },
];

// Categorias (de marginByProduct) consideradas "empório" — usadas para comparar margens.
export const CATEGORIAS_EMPORIO = ["Frios", "Conservas", "Doces", "Azeites", "Massas"] as const;

export const marginByProduct = [
  { name: "Queijo Brie Francês", margin: 44.9, category: "Frios" },
  { name: "Atum Rio Mare", margin: 45.3, category: "Conservas" },
  { name: "Chocolate Lindt 85%", margin: 46.5, category: "Doces" },
  { name: "Azeite Gallo 500ml", margin: 39.4, category: "Azeites" },
  { name: "Salame Milano", margin: 48.1, category: "Frios" },
  { name: "Massa De Cecco", margin: 45.4, category: "Massas" },
  { name: "Espumante Chandon", margin: 35.5, category: "Espumantes" },
  { name: "Gin Tanqueray", margin: 39.9, category: "Destilados" },
  { name: "Casillero del Diablo", margin: 42.9, category: "Vinhos" },
  { name: "Heineken Long Neck", margin: 44.0, category: "Cervejas" },
  { name: "Jack Daniels 1L", margin: 36.8, category: "Destilados" },
  { name: "Vodka Absolut", margin: 42.2, category: "Destilados" },
];

// ── ATO 5: Alertas e Pendências ──
export type DebtorStatus = "atrasado" | "parcial" | "devendo" | "em dia";

export const debtors: {
  cliente: string;
  itens: string;
  valor: number;
  vencimento: string;
  status: DebtorStatus;
  diasAtraso: number;
}[] = [
  { cliente: "Restaurante Bella", itens: "Massas + azeites + atum", valor: 890, vencimento: "Mensal", status: "atrasado", diasAtraso: 15 },
  { cliente: "Carlos (bar esquina)", itens: "Cx Heineken + destilados", valor: 480, vencimento: "Março", status: "parcial", diasAtraso: 90 },
  { cliente: "Sr. Antônio", itens: "3 garrafas vinho + whisky", valor: 299, vencimento: "Janeiro", status: "devendo", diasAtraso: 150 },
  { cliente: "Pedro Eventos", itens: "12 vinhos p/ casamento", valor: 599, vencimento: "Abril", status: "devendo", diasAtraso: 60 },
  { cliente: "Dona Márcia", itens: "2 Chandon + queijo brie", valor: 220, vencimento: "Fevereiro", status: "parcial", diasAtraso: 120 },
  { cliente: "João (vizinho)", itens: "1 Jack Daniels", valor: 190, vencimento: "Maio", status: "devendo", diasAtraso: 30 },
  { cliente: "Fernanda", itens: "Vinhos rosé + espumante", valor: 187, vencimento: "Junho", status: "devendo", diasAtraso: 5 },
];

// Itens com estoque abaixo do mínimo — viram alertas automaticamente.
export const lowStock = [
  { produto: "Queijo Brie Francês", unidades: 2, minimo: 6 },
  { produto: "Jack Daniels 1L", unidades: 3, minimo: 8, altoGiro: true },
  { produto: "Espumante Chandon", unidades: 4, minimo: 10 },
];

// Pendências que não vêm de nenhuma outra tabela (lançadas manualmente).
export type Severity = "critical" | "warning" | "info";

export const manualAlerts: {
  type: "stock" | "finance" | "operational";
  severity: Severity;
  message: string;
  icon: string;
}[] = [
  { type: "finance", severity: "warning", message: "Conta de luz de Maio: pagamento pendente", icon: "Zap" },
];
