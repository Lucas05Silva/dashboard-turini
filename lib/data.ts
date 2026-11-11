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
//   • soma de newVsReturning.novos    = customerJourney "1ª compra"
//   • soma de purchaseFrequency.count = customerJourney "1ª compra"
//   • purchaseFrequency "1 compra"    = 1ª compra − 2ª compra do funil
//   • soma de customerProfiles.percentReceita = 100
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
  diasInativo: 60, // cliente sem compra há mais que isso = inativo
  // Premissa da estimativa de reativação: quantas compras (ao ticket médio)
  // um cliente de compra única reativado faz no semestre.
  comprasPorClienteReativado: 3,
  // Risco de churn ALTO quando: inativo há X+ dias, OU parado há N× o próprio intervalo médio
  churnDiasAlto: 75,
  churnFatorAlto: 4,
  margemMinimaProduto: 37, // % — produtos abaixo disso são destacados
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

// Perfil de clientes ativos por tipo (percentReceita deve somar 100)
export const customerProfiles = [
  { type: "Pessoa Física", count: 112, ticketMedio: 68, percentReceita: 48 },
  { type: "Restaurantes/Bares", count: 18, ticketMedio: 420, percentReceita: 32 },
  { type: "Eventos", count: 8, ticketMedio: 650, percentReceita: 12 },
  { type: "Empresas (cestas, brindes)", count: 10, ticketMedio: 380, percentReceita: 8 },
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

// ── ATO 5: Jornada do Cliente + Processos ──

// Funil da jornada (semestre). A 1ª etapa é a base; as demais são subconjuntos.
export const customerJourney = [
  { stage: "Visitaram a loja", count: 320 },
  { stage: "Fizeram 1ª compra", count: 210 },
  { stage: "Voltaram (2ª compra)", count: 148 },
  { stage: "Compraram 3+ vezes", count: 89 },
  { stage: "Clientes fiéis (mensal)", count: 52 },
];

// Clientes distintos que compraram em cada mês: novos (1ª compra) vs recorrentes
export const newVsReturning = [
  { month: "Jan", novos: 42, recorrentes: 28 },
  { month: "Fev", novos: 38, recorrentes: 35 },
  { month: "Mar", novos: 35, recorrentes: 41 },
  { month: "Abr", novos: 30, recorrentes: 48 },
  { month: "Mai", novos: 33, recorrentes: 50 },
  { month: "Jun", novos: 32, recorrentes: 56 },
];

// Quantas vezes cada cliente comprou no semestre (soma = clientes da 1ª compra)
export const purchaseFrequency = [
  { frequency: "1 compra", count: 62, single: true },
  { frequency: "2–3 compras", count: 59 },
  { frequency: "4–6 compras", count: 48 },
  { frequency: "7–12 compras", count: 29 },
  { frequency: "13+ (semanal)", count: 12 },
];

// Intervalo médio entre compras por perfil (dias). ideal: null = sazonal, sem meta.
export const avgTimeBetweenPurchases: { profile: string; avgDays: number; ideal: number | null }[] = [
  { profile: "PF casual", avgDays: 38, ideal: 30 },
  { profile: "PF entusiasta", avgDays: 14, ideal: 14 },
  { profile: "Restaurante/Bar", avgDays: 8, ideal: 7 },
  { profile: "Eventos", avgDays: 90, ideal: null },
];

// Mapeamento de processos: antes (manual) × depois (automatizado).
// implantadoEm: mês em que a automação entrou em operação (usado para comparar
// a retenção antes/depois no Ato 6). PLACEHOLDER — ajustar para as datas reais.
export const processComparison = [
  {
    process: "Registro de venda",
    before: "Anotado em caderno ou planilha manual, sem padrão de data e valor",
    after: "Microsoft Forms → Excel padronizado, preenchido automaticamente via Power Automate",
    impact: "Elimina erros de digitação e inconsistências; dados prontos para análise",
    implantadoEm: "Jan",
  },
  {
    process: "Controle de estoque",
    before: "Contagem visual, sem registro. Aba de estoque abandonada desde março",
    after: "Cada venda baixa o estoque automaticamente; e-mail de alerta quando chega ao mínimo",
    impact: "Visibilidade em tempo real; menos ruptura e menos capital parado",
    implantadoEm: "Fev",
  },
  {
    process: "Cobrança de fiados",
    before: "Anotado em caderno ou aba solta; cobrança depende da memória do dono",
    after: "Lembrete automático por e-mail/WhatsApp quando o prazo vence",
    impact: "Menos inadimplência; cobrança profissional, sem constrangimento",
    implantadoEm: "Fev",
  },
  {
    process: "Pós-venda e retenção",
    before: "Inexistente. Nenhum contato após a compra; o cliente some e ninguém percebe",
    after: "Agradecimento pós-compra + sugestão de produtos + alerta de cliente inativo (>30 dias)",
    impact: "Mais retenção e ticket médio; comprador eventual vira recorrente",
    implantadoEm: "Mar",
    retencao: true, // automação usada na comparação antes/depois da retenção
  },
  {
    process: "Relatório de desempenho",
    before: "Dono calcula de cabeça; totais manuais errados; nenhum indicador",
    after: "Este dashboard, atualizado automaticamente com KPIs, gráficos e alertas",
    impact: "Decisões baseadas em dados; visão completa do negócio",
    implantadoEm: "Jan",
  },
];

// ── ATO 6: Retenção + Alertas ──

// % dos clientes do mês anterior que voltaram a comprar no mês
export const retentionRate = [
  { month: "Jan", rate: 40 },
  { month: "Fev", rate: 47 },
  { month: "Mar", rate: 52 },
  { month: "Abr", rate: 55 },
  { month: "Mai", rate: 54 },
  { month: "Jun", rate: 58 },
];

// Coorte: % dos clientes adquiridos no mês que voltaram em m+1, m+2...
export const cohortData: { acquired: string; values: (number | null)[] }[] = [
  { acquired: "Jan", values: [47, 38, 31, 26, 24] },
  { acquired: "Fev", values: [50, 42, 35, 29, null] },
  { acquired: "Mar", values: [54, 44, 38, null, null] },
  { acquired: "Abr", values: [52, 46, null, null, null] },
  { acquired: "Mai", values: [55, null, null, null, null] },
];

// Clientes sem compra recente. intervaloMedio = dias entre compras no histórico do cliente.
// O nível de risco é calculado em lib/indicators.ts.
export const churnRisk = [
  { cliente: "Roberto Lima", tipo: "PF", ultimaCompra: "12/03/2024", diasInativo: 98, intervaloMedio: 38, ticketMedio: 156, comprasTotal: 4 },
  { cliente: "Ana Beatriz", tipo: "PF", ultimaCompra: "28/03/2024", diasInativo: 82, intervaloMedio: 38, ticketMedio: 89, comprasTotal: 3 },
  { cliente: "Marcos Oliveira", tipo: "PF", ultimaCompra: "15/04/2024", diasInativo: 64, intervaloMedio: 30, ticketMedio: 210, comprasTotal: 6 },
  { cliente: "Patrícia Costa", tipo: "PF", ultimaCompra: "02/05/2024", diasInativo: 47, intervaloMedio: 21, ticketMedio: 340, comprasTotal: 8 },
  { cliente: "Restaurante Sabor & Arte", tipo: "B2B", ultimaCompra: "10/05/2024", diasInativo: 39, intervaloMedio: 8, ticketMedio: 890, comprasTotal: 12 },
];

// Fiados em aberto
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
  type: "stock" | "finance" | "operational" | "churn" | "process";
  severity: Severity;
  message: string;
  icon: string;
}[] = [
  { type: "finance", severity: "warning", message: "Conta de luz de Maio: pagamento pendente", icon: "Zap" },
];
