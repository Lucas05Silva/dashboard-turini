import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StorySection from "@/components/StorySection";
import ChartCard from "@/components/ChartCard";
import CalloutBox from "@/components/CalloutBox";
import KpiRow from "@/components/KpiRow";
import SalesMixChart from "@/components/SalesMixChart";
import TopProductsChart from "@/components/TopProductsChart";
import PaymentMethodChart from "@/components/PaymentMethodChart";
import CustomerProfileChart from "@/components/CustomerProfileChart";
import ExpenseBreakdownChart from "@/components/ExpenseBreakdownChart";
import RevenueVsCostChart from "@/components/RevenueVsCostChart";
import MonthlyTrendChart from "@/components/MonthlyTrendChart";
import MarginByProductChart from "@/components/MarginByProductChart";
import StockTurnoverChart from "@/components/StockTurnoverChart";
import CustomerJourneyFunnel from "@/components/CustomerJourneyFunnel";
import NewVsReturningChart from "@/components/NewVsReturningChart";
import PurchaseFrequencyChart from "@/components/PurchaseFrequencyChart";
import PurchaseIntervalChart from "@/components/PurchaseIntervalChart";
import ProcessComparisonCard from "@/components/ProcessComparisonCard";
import RetentionRateChart from "@/components/RetentionRateChart";
import CohortTable from "@/components/CohortTable";
import ChurnRiskTable from "@/components/ChurnRiskTable";
import DebtorsTable from "@/components/DebtorsTable";
import AlertCard from "@/components/AlertCard";
import { ADEGA, CATEGORIAS_EMPORIO, metas, monthlyFinancials } from "@/lib/data";
import {
  calcularInadimplenciaPercent,
  calcularMargemBruta,
  calcularTotalFiado,
  categoriasEstoqueCritico,
  churnResumo,
  compraUnica,
  conversaoFunil,
  destaqueB2B,
  estimativaReativacao,
  faixaMargemMensal,
  faixaRetencaoLongoPrazo,
  fiadosAcimaDe,
  frequenciaResumo,
  getAlerts,
  getExpenseBreakdown,
  getFunnel,
  getMarginRanked,
  getMonthlyWithSaldo,
  getNewVsReturning,
  getProcesses,
  getPurchaseIntervals,
  getSalesMixRanked,
  getStockTurnoverRanked,
  getTopProductsRanked,
  liderTicketUnitario,
  maiorPerdaPosCompra,
  margemMediaDe,
  melhorCoorteM1,
  mesViradaRecorrentes,
  mesesPositivos,
  produtosAbaixoMargemMinima,
  retencaoAntesDepois,
  retencaoResumo,
  sharePagamento,
  shareTopCategorias,
  shareTopProdutos,
  shareVinhos,
  totalClientesAtivos,
  totalFaturamento,
  valorPontoRetencao,
  variacaoPagamento,
} from "@/lib/indicators";
import { brl, brlCompact, num, pct, signedPct, times } from "@/lib/format";

const plural = (n: number, one: string, many: string) => `${num(n)} ${n === 1 ? one : many}`;
const listaPt = (items: string[]) =>
  items.length <= 1 ? items.join("") : `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}`;

export default function Home() {
  // ── Ato 1 ──
  const margem = calcularMargemBruta();
  const gapMargem = metas.margemBruta - margem;

  // ── Ato 2 ──
  const mix = getSalesMixRanked();
  const top3 = shareTopCategorias(3);
  const vinhos = shareVinhos();
  const produtos = getTopProductsRanked();
  const lider = produtos[0];
  const liderUnit = liderTicketUnitario();
  const varPix = variacaoPagamento("pix");
  const varFiado = variacaoPagamento("fiado");
  const sharePix = sharePagamento("pix");
  const b2b = destaqueB2B();
  const primeiroMes = monthlyFinancials[0].month;
  const ultimoMes = monthlyFinancials[monthlyFinancials.length - 1].month;

  // ── Ato 3 ──
  const despesas = getExpenseBreakdown();
  const cmv = despesas.find((d) => d.name.includes("CMV"))!;
  const fixasTop = despesas.filter((d) => d !== cmv).slice(0, 2);
  const faixa = faixaMargemMensal();
  const mensal = getMonthlyWithSaldo();
  const acumulado = mensal[mensal.length - 1].acumulado;
  const positivos = mesesPositivos();
  const margens = getMarginRanked();
  const abaixoMin = produtosAbaixoMargemMinima();
  const margemEmporio = margemMediaDe(CATEGORIAS_EMPORIO);
  const margemDestilados = margemMediaDe(["Destilados"]);

  // ── Ato 4 ──
  const giro = getStockTurnoverRanked();
  const giroTop = giro[0];
  const giroBottom = giro[giro.length - 1];
  const giroCritico = categoriasEstoqueCritico();

  // ── Ato 5 ──
  const funil = getFunnel();
  const conv = conversaoFunil();
  const gargalo = maiorPerdaPosCompra();
  const nvr = getNewVsReturning();
  const virada = mesViradaRecorrentes();
  const ultimoNvr = nvr[nvr.length - 1];
  const unica = compraUnica();
  const freq = frequenciaResumo();
  const reativ = estimativaReativacao(10);
  const intervalos = getPurchaseIntervals();
  const acimaMeta = intervalos.filter((i) => i.acimaDaMeta);
  const processos = getProcesses();

  // ── Ato 6 ──
  const ret = retencaoResumo();
  const antesDepois = retencaoAntesDepois();
  const melhorCoorte = melhorCoorteM1();
  const longoPrazo = faixaRetencaoLongoPrazo();
  const churn = churnResumo();
  const b2bAlto = churn.alto.filter((c) => c.tipo === "B2B");
  const totalFiado = calcularTotalFiado();
  const inad = calcularInadimplenciaPercent();
  const fiados90 = fiadosAcimaDe(90);
  const fiadosMeta = fiadosAcimaDe(metas.fiadoDiasMax);
  const alerts = getAlerts();
  const nCrit = alerts.filter((a) => a.severity === "critical").length;
  const nAviso = alerts.filter((a) => a.severity === "warning").length;
  const nInfo = alerts.length - nCrit - nAviso;

  const margemTexto =
    faixa.max - faixa.min < 1
      ? `A margem bruta se manteve estável em ~${num(faixa.media)}% em todos os meses`
      : `A margem bruta oscilou entre ${pct(faixa.min)} e ${pct(faixa.max)}`;

  return (
    <>
      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ═════════ ATO 1 — Saúde do negócio ═════════ */}
        <StorySection
          act={1}
          question="Como está a saúde do negócio?"
          title={`Visão Geral — Semestre ${ADEGA.periodoCurto}`}
          subtitle={`10 indicadores que resumem a saúde financeira, operacional e de relacionamento da ${ADEGA.nome}`}
        >
          <KpiRow />
          {gapMargem > 0 ? (
            <CalloutBox variant="warning">
              A margem bruta de {pct(margem)} está {num(gapMargem, 1)} p.p. abaixo da meta de {metas.margemBruta}%.
              Cada ponto de margem vale cerca de {brl(totalFaturamento / 100)} no semestre — renegociar compras e
              reforçar o mix do empório são os caminhos mais rápidos.
            </CalloutBox>
          ) : (
            <CalloutBox variant="insight">
              A margem bruta de {pct(margem)} já supera a meta de {metas.margemBruta}%.
            </CalloutBox>
          )}
        </StorySection>

        {/* ═════════ ATO 2 — Receita + perfil ═════════ */}
        <StorySection
          act={2}
          question="De onde vem a receita e quem compra?"
          title={`${pct(vinhos, 0)} do faturamento vem de vinhos — e ${pct(b2b.b2b.percentReceita, 0)} de apenas ${num(b2b.b2b.count)} clientes B2B`}
          subtitle="Mix de vendas, produtos campeões, meios de pagamento e perfil de quem compra: a receita é concentrada em poucas categorias e em poucos clientes de alto valor."
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ChartCard
              title="Vinhos dominam, mas o empório cresce — composição por categoria"
              subtitle={`3 categorias (${listaPt(mix.slice(0, 3).map((c) => c.category))}) respondem por ${pct(top3, 0)} do faturamento bruto do semestre`}
            >
              <SalesMixChart />
            </ChartCard>
            <ChartCard
              title={`Os ${produtos.length} campeões de venda movem ${pct(shareTopProdutos(), 0)} da receita`}
              subtitle={`${lider.name.split(" ").slice(0, 3).join(" ")} lidera em faturamento (${brlCompact(lider.revenue)}); ${liderUnit.name.replace(/^Whisky /, "")} tem o maior valor por unidade (${brl(liderUnit.unitario)})`}
            >
              <TopProductsChart />
            </ChartCard>
          </div>

          <ChartCard
            title="PIX é rei e o fiado está morrendo — evolução por forma de pagamento"
            subtitle={`Fiado ${varFiado < 0 ? "caiu" : "subiu"} ${pct(Math.abs(varFiado), 0)} de ${primeiroMes} a ${ultimoMes}; PIX ${varPix >= 0 ? "subiu" : "caiu"} ${pct(Math.abs(varPix), 0)} — menos risco, mais caixa`}
          >
            <PaymentMethodChart />
          </ChartCard>

          <ChartCard
            title={`${num(b2b.b2b.count)} ${b2b.b2b.type.toLowerCase()} geram ${pct(b2b.b2b.percentReceita, 0)} da receita com ticket ${num(b2b.ticketRatio)}x maior que pessoa física`}
            subtitle={`São só ${pct(b2b.b2b.percentClientes, 0)} dos ${num(totalClientesAtivos)} clientes ativos — o segmento B2B é pequeno em volume e grande em valor`}
          >
            <CustomerProfileChart />
          </ChartCard>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <CalloutBox variant="insight">
              O PIX já responde por {pct(sharePix, 0)} do faturamento e segue em alta ({signedPct(varPix)} no
              semestre) — dinheiro que cai na conta na hora, sem taxa de maquininha.
            </CalloutBox>
            <CalloutBox variant="action">
              Criar uma condição comercial para {b2b.b2b.type.toLowerCase()} (tabela de preço, entrega programada,
              pedido recorrente) protege a fatia de {pct(b2b.b2b.percentReceita, 0)} da receita e abre espaço para
              prospectar novas contas.
            </CalloutBox>
          </div>
        </StorySection>

        {/* ═════════ ATO 3 — Custos + margens ═════════ */}
        <StorySection
          act={3}
          question="Para onde vai o dinheiro?"
          title={`O custo acompanha o crescimento — e o saldo fechou em ${brlCompact(acumulado)}`}
          subtitle="Mercadoria é o maior gasto; aluguel e folha formam a base fixa. Mesmo assim, todos os meses fecharam no azul — e a margem varia muito de produto para produto."
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ChartCard
              title={`Para onde vai cada real: CMV é ${pct(cmv.percent, 0)}, ${listaPt(fixasTop.map((d) => d.name.toLowerCase()))} são os maiores fixos`}
              subtitle="Estrutura completa de custos do semestre, incluindo a compra de mercadoria"
            >
              <ExpenseBreakdownChart />
            </ChartCard>
            <ChartCard
              title={`Faturamento cresce mês a mês, mas o custo acompanha — margem ${faixa.max - faixa.min < 1 ? `estável em ~${num(faixa.media)}%` : "oscila"}`}
              subtitle={margemTexto}
            >
              <RevenueVsCostChart />
            </ChartCard>
            <ChartCard
              title={`Saldo ${positivos === mensal.length ? "positivo em todos os meses" : `positivo em ${positivos} de ${mensal.length} meses`} — ${brlCompact(acumulado)} ao final de ${ultimoMes}`}
              subtitle="Barras: saldo de cada mês · Área: saldo acumulado no semestre"
            >
              <MonthlyTrendChart />
            </ChartCard>
            <ChartCard
              title={`${margens[0].name} e ${margens[1].name} lideram margem; ${listaPt(abaixoMin.map((p) => p.name))} ficam abaixo de ${metas.margemMinimaProduto}%`}
              subtitle={`Produtos do empório têm margem média de ${pct(margemEmporio)}, contra ${pct(margemDestilados)} dos destilados`}
            >
              <MarginByProductChart />
            </ChartCard>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <CalloutBox variant="insight">
              O CMV consome {pct(cmv.percent, 0)} de tudo que sai do caixa. Pequenas melhorias na compra têm mais efeito
              no saldo do que cortes nas despesas fixas.
            </CalloutBox>
            <CalloutBox variant="action">
              Montar kits de empório (massa + azeite + conserva + vinho) junta itens de alta margem com o produto que
              mais vende — aumenta o ticket e a margem ao mesmo tempo.
            </CalloutBox>
          </div>
        </StorySection>

        {/* ═════════ ATO 4 — Estoque ═════════ */}
        <StorySection
          act={4}
          question="O estoque atende a demanda?"
          title={`Capital parado em ${listaPt(giroCritico.map((c) => c.category.toLowerCase())) || "nenhuma categoria"}`}
          subtitle="Giro mostra quantas vezes o estoque se renovou no semestre. O ideal é girar rápido — sem deixar faltar o que mais vende."
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
            <ChartCard
              title={`Giro de ${times(giroTop.turnover)} em ${giroTop.category.toLowerCase()} contra ${times(giroBottom.turnover)} em ${giroBottom.category.toLowerCase()} — dinheiro parado na prateleira`}
              subtitle="Categorias com giro abaixo de 3x têm capital parado e risco de perda"
            >
              <StockTurnoverChart />
            </ChartCard>
            <div className="flex flex-col gap-4">
              {giroCritico.length > 0 && (
                <CalloutBox variant="warning">
                  {listaPt(giroCritico.map((c) => `${c.category} (${times(c.turnover)})`))} giram bem abaixo da meta de{" "}
                  {metas.giroEstoque}x. Reduzir o volume dos próximos pedidos dessas categorias libera caixa.
                </CalloutBox>
              )}
              <CalloutBox variant="action">
                Para as categorias de giro alto ({listaPt(giro.filter((g) => g.status === "ideal").map((g) => g.category.toLowerCase()))}),
                o risco é o inverso: ruptura. Com a baixa automática de estoque, o pedido de reposição sai antes de
                faltar.
              </CalloutBox>
            </div>
          </div>
        </StorySection>

        {/* ═════════ ATO 5 — Jornada do cliente ═════════ */}
        <StorySection
          act={5}
          question="Como está a jornada do cliente?"
          title={`De ${num(funil[0].count)} visitantes, ${num(funil[funil.length - 1].count)} viraram clientes fiéis — e o gargalo é a ${gargalo.stage.match(/\d+ª/)?.[0] ?? "próxima"} compra`}
          subtitle="Do primeiro contato à recompra: onde o cliente se perde, com que frequência volta e quais processos foram reorganizados para não deixá-lo ir embora."
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ChartCard
              title={`Funil da jornada: conversão de ${pct(conv, 0)} até cliente fiel`}
              subtitle={`Depois da 1ª compra, a maior perda é entre “${gargalo.from.stage.toLowerCase()}” e “${gargalo.stage.toLowerCase()}”: ${num(gargalo.perdidos)} clientes (${pct(gargalo.naoVoltaram, 0)}) não avançaram`}
            >
              <CustomerJourneyFunnel />
            </ChartCard>
            <ChartCard
              title={
                virada
                  ? `Recorrentes superam novos desde ${virada} — a base está amadurecendo`
                  : "Novos ainda superam recorrentes — a base não está se fidelizando"
              }
              subtitle={`Em ${ultimoNvr.month}, ${pct(ultimoNvr.shareRecorrentes, 0)} dos clientes que compraram já tinham comprado antes`}
            >
              <NewVsReturningChart />
            </ChartCard>
          </div>

          <CalloutBox variant="action">
            Implementar o fluxo automático de pós-venda (agradecimento + cupom de retorno após a 1ª compra) ataca
            exatamente o gargalo: {num(gargalo.perdidos)} clientes compraram uma vez e não voltaram.
          </CalloutBox>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ChartCard
              title={`${pct(unica.percent)} compram apenas 1 vez — quase 1 em cada ${num(Math.round(100 / unica.percent))} clientes some após a 1ª compra`}
              subtitle={`Só ${pct(freq.topo.percent)} compram toda semana; ${pct(freq.base4mais, 0)} têm 4 ou mais compras e formam a base recorrente`}
            >
              <PurchaseFrequencyChart />
            </ChartCard>
            <ChartCard
              title={
                acimaMeta.length
                  ? `${listaPt(acimaMeta.map((a) => a.profile))} ${acimaMeta.length === 1 ? "demora" : "demoram"} mais que o ideal para voltar`
                  : "Todos os perfis voltam dentro do intervalo ideal"
              }
              subtitle={acimaMeta.map((a) => `${a.profile}: ${a.avgDays} dias (meta ${a.ideal})`).join(" · ") || "Intervalo médio entre compras por perfil"}
            >
              <PurchaseIntervalChart />
            </ChartCard>
          </div>

          <CalloutBox variant="warning">
            O grupo de compra única ({num(unica.count)} clientes) é o maior alvo de reativação. Recuperar{" "}
            {reativ.pctAlvo}% dele ({num(reativ.clientes)} clientes) com {metas.comprasPorClienteReativado} compras
            cada ao ticket médio representa cerca de {brl(reativ.valor)} a mais por semestre.
          </CalloutBox>

          <div className="pt-4">
            <h3 className="text-base font-semibold text-ink">
              {processos.length} processos transformados: do caderno ao fluxo automatizado
            </h3>
            <p className="mt-1.5 text-sm text-ink-muted">
              Cada automação elimina um ponto de falha e gera um dado novo para decisão
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {processos.map((p, i) => (
              <ProcessComparisonCard
                key={p.process}
                {...p}
                className={i === processos.length - 1 && processos.length % 2 === 1 ? "lg:col-span-2" : ""}
              />
            ))}
          </div>
        </StorySection>

        {/* ═════════ ATO 6 — Retenção + alertas ═════════ */}
        <StorySection
          act={6}
          question="Estamos retendo clientes?"
          title={`Retenção ${ret.variacao >= 0 ? "subiu" : "caiu"} de ${ret.inicial}% para ${ret.atual}% — mas ${plural(churn.alto.length, "cliente está", "clientes estão")} em risco alto de perda`}
          subtitle="Retenção mês a mês, coorte de clientes, quem está sumindo, quem está devendo e o que precisa de atenção agora."
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ChartCard
              title={`${ret.variacao >= 0 ? "Tendência positiva" : "Tendência de queda"}: ${ret.variacao >= 0 ? "+" : "−"}${Math.abs(ret.variacao)} p.p. de retenção entre ${ret.primeiroMes} e ${ret.ultimoMes}`}
              subtitle={`Cada ponto percentual de retenção equivale a ~${brlCompact(valorPontoRetencao())}/semestre em receita preservada`}
            >
              <RetentionRateChart />
            </ChartCard>
            <ChartCard
              title={`Coorte de ${melhorCoorte.acquired} teve o melhor retorno no mês seguinte: ${melhorCoorte.values[0]}%`}
              subtitle={`Do 3º mês em diante a retenção fica entre ${longoPrazo.min}% e ${longoPrazo.max}% — esse é o núcleo fiel`}
            >
              <CohortTable />
            </ChartCard>
          </div>

          {antesDepois && (
            <CalloutBox variant="insight">
              Desde a implantação do {antesDepois.processo.toLowerCase()} ({antesDepois.mes}), a retenção média foi de{" "}
              {pct(antesDepois.depois)}, contra {pct(antesDepois.antes)} nos meses anteriores. O maior salto mensal foi
              de {ret.salto.from} para {ret.salto.to} (+{ret.salto.delta} p.p.) — acompanhar os próximos meses confirma
              se a melhora se sustenta.
            </CalloutBox>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ChartCard
              title={`${plural(churn.total, "cliente", "clientes")} em risco de perda${churn.b2b.length ? ` — incluindo ${plural(churn.b2b.length, "conta B2B", "contas B2B")}` : ""}`}
              subtitle={`${plural(churn.inativosAcima.length, "está", "estão")} há mais de ${metas.diasInativo} dias sem comprar; clientes nessa situação dificilmente voltam sem contato ativo`}
            >
              <ChurnRiskTable />
            </ChartCard>
            <ChartCard
              title={`${brl(totalFiado)} em fiados abertos — ${plural(fiados90.count, "cliente", "clientes")} com mais de 90 dias`}
              subtitle={`Inadimplência é ${pct(inad)} do faturamento; meta: zerar fiados acima de ${metas.fiadoDiasMax} dias`}
            >
              <DebtorsTable />
            </ChartCard>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {b2bAlto.map((c) => (
              <CalloutBox key={c.cliente} variant="critical">
                {c.cliente} está há {c.diasInativo} dias sem pedido — a média era de {c.intervaloMedio} dias (
                {num(c.fator, 1)}× o normal). Possível troca de fornecedor: contato imediato recomendado.
              </CalloutBox>
            ))}
            {fiadosMeta.count > 0 && (
              <CalloutBox variant="critical">
                {plural(fiadosMeta.count, "cliente deve", "clientes devem")} há mais de {metas.fiadoDiasMax} dias, somando{" "}
                {brl(fiadosMeta.total)} ({listaPt(fiadosMeta.list.map((d) => d.cliente))}). Combinar parcelamento via PIX e
                suspender novas vendas a prazo até a regularização.
              </CalloutBox>
            )}
          </div>

          <ChartCard
            title="Painel consolidado: o que precisa de atenção agora"
            subtitle={`${plural(nCrit, "alerta crítico", "alertas críticos")}, ${plural(nAviso, "aviso", "avisos")} e ${plural(nInfo, "oportunidade de processo", "oportunidades de processo")} — gerados automaticamente a partir dos dados`}
          >
            <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {alerts.map((a) => (
                <AlertCard key={a.message} alert={a} />
              ))}
            </ul>
          </ChartCard>
        </StorySection>
      </main>

      <Footer />
    </>
  );
}
