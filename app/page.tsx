import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StorySection from "@/components/StorySection";
import ChartCard from "@/components/ChartCard";
import CalloutBox from "@/components/CalloutBox";
import KpiRow from "@/components/KpiRow";
import SalesMixChart from "@/components/SalesMixChart";
import TopProductsChart from "@/components/TopProductsChart";
import PaymentMethodChart from "@/components/PaymentMethodChart";
import ExpenseBreakdownChart from "@/components/ExpenseBreakdownChart";
import RevenueVsCostChart from "@/components/RevenueVsCostChart";
import MonthlyTrendChart from "@/components/MonthlyTrendChart";
import StockTurnoverChart from "@/components/StockTurnoverChart";
import MarginByProductChart from "@/components/MarginByProductChart";
import DebtorsTable from "@/components/DebtorsTable";
import AlertCard from "@/components/AlertCard";
import { ADEGA, CATEGORIAS_EMPORIO, metas, monthlyFinancials } from "@/lib/data";
import {
  calcularInadimplenciaPercent,
  calcularMargemBruta,
  calcularTotalFiado,
  categoriasEstoqueCritico,
  faixaMargemMensal,
  fiadosAcimaDe,
  getAlerts,
  getExpenseBreakdown,
  getMarginRanked,
  getMonthlyWithSaldo,
  getSalesMixRanked,
  getStockTurnoverRanked,
  getTopProductsRanked,
  margemMediaDe,
  mesesPositivos,
  sharePagamento,
  shareTopCategorias,
  shareTopProdutos,
  shareVinhos,
  totalFaturamento,
  variacaoPagamento,
} from "@/lib/indicators";
import { brl, brlCompact, num, pct, signedPct, times } from "@/lib/format";

const plural = (n: number, one: string, many: string) => `${num(n)} ${n === 1 ? one : many}`;

export default function Home() {
  // ── Ato 1 ──
  const margem = calcularMargemBruta();
  const gapMargem = metas.margemBruta - margem;
  const valorPontoMargem = totalFaturamento / 100;

  // ── Ato 2 ──
  const mix = getSalesMixRanked();
  const top3 = shareTopCategorias(3);
  const vinhos = shareVinhos();
  const produtos = getTopProductsRanked();
  const lider = produtos[0];
  const varPix = variacaoPagamento("pix");
  const varFiado = variacaoPagamento("fiado");
  const sharePix = sharePagamento("pix");

  // ── Ato 3 ──
  const despesas = getExpenseBreakdown();
  const cmv = despesas.find((d) => d.name.includes("CMV"))!;
  const fixasTop = despesas.filter((d) => d !== cmv).slice(0, 2);
  const faixa = faixaMargemMensal();
  const mensal = getMonthlyWithSaldo();
  const acumulado = mensal[mensal.length - 1].acumulado;
  const positivos = mesesPositivos();
  const melhorMes = [...mensal].sort((a, b) => b.margem - a.margem)[0];

  // ── Ato 4 ──
  const giro = getStockTurnoverRanked();
  const giroTop = giro[0];
  const giroBottom = giro[giro.length - 1];
  const giroCritico = categoriasEstoqueCritico();
  const margens = getMarginRanked();
  const margemEmporio = margemMediaDe(CATEGORIAS_EMPORIO);
  const margemDestilados = margemMediaDe(["Destilados"]);

  // ── Ato 5 ──
  const totalFiado = calcularTotalFiado();
  const inad = calcularInadimplenciaPercent();
  const fiados90 = fiadosAcimaDe(90);
  const fiadosMeta = fiadosAcimaDe(metas.fiadoDiasMax);
  const alerts = getAlerts();
  const nCrit = alerts.filter((a) => a.severity === "critical").length;
  const nOutros = alerts.length - nCrit;

  const margemTexto =
    faixa.max - faixa.min < 1
      ? `A margem bruta se manteve estável em ~${num(faixa.media)}% em todos os meses`
      : `A margem bruta oscilou entre ${pct(faixa.min)} e ${pct(faixa.max)}, com melhor resultado em ${melhorMes.month}`;

  return (
    <>
      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ATO 1 — Saúde financeira */}
        <StorySection
          act={1}
          question="Como está a saúde financeira?"
          title={`Visão Geral — Semestre ${ADEGA.periodoCurto}`}
          subtitle="8 indicadores que resumem a saúde financeira da Diretriz Adega"
        >
          <KpiRow />
          {gapMargem > 0 ? (
            <CalloutBox variant="warning">
              A margem bruta de {pct(margem)} está {num(gapMargem, 1)} p.p. abaixo da meta de {metas.margemBruta}%.
              Cada ponto de margem vale cerca de {brl(valorPontoMargem)} no semestre — renegociar compras e
              reforçar o mix do empório são os caminhos mais rápidos.
            </CalloutBox>
          ) : (
            <CalloutBox variant="insight">
              A margem bruta de {pct(margem)} já supera a meta de {metas.margemBruta}%.
            </CalloutBox>
          )}
        </StorySection>

        {/* ATO 2 — Composição de receita */}
        <StorySection
          act={2}
          question="De onde vem o dinheiro?"
          title={`${pct(vinhos, 0)} do faturamento vem de vinhos — e o empório já cresce ao lado`}
          subtitle="Mix de vendas, produtos campeões e como o cliente paga: a receita está concentrada, mas o meio de pagamento está mudando rápido."
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ChartCard
              title="Vinhos dominam, mas o empório cresce — composição por categoria"
              subtitle={`${num(3)} categorias (${mix
                .slice(0, 3)
                .map((c) => c.category)
                .join(", ")}) respondem por ${pct(top3, 0)} do faturamento bruto do semestre`}
            >
              <SalesMixChart />
            </ChartCard>
            <ChartCard
              title={`Os campeões de venda: ${produtos.length} produtos que movem ${pct(shareTopProdutos(), 0)} da receita`}
              subtitle={`${lider.name.split(" ").slice(0, 3).join(" ")} lidera com ${brlCompact(lider.revenue)} — destilados vendem menos unidades, mas com ticket alto`}
            >
              <TopProductsChart />
            </ChartCard>
          </div>

          <ChartCard
            title={`PIX é rei e o fiado está morrendo — evolução por forma de pagamento`}
            subtitle={`Fiado ${varFiado < 0 ? "caiu" : "subiu"} ${pct(Math.abs(varFiado), 0)} de ${monthlyFinancials[0].month} a ${
              monthlyFinancials[monthlyFinancials.length - 1].month
            }; PIX ${varPix >= 0 ? "subiu" : "caiu"} ${pct(Math.abs(varPix), 0)} no mesmo período`}
          >
            <PaymentMethodChart />
          </ChartCard>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <CalloutBox variant="insight">
              O PIX já responde por {pct(sharePix, 0)} do faturamento e segue em tendência de alta ({signedPct(varPix)} no
              semestre) — dinheiro que cai na conta na hora, sem taxa de maquininha.
            </CalloutBox>
            <CalloutBox variant="action">
              Oferecer um pequeno desconto no PIX para compras acima do ticket médio acelera o recebimento e reduz o
              custo com cartão de crédito.
            </CalloutBox>
          </div>
        </StorySection>

        {/* ATO 3 — Estrutura de custos */}
        <StorySection
          act={3}
          question="Para onde vai o dinheiro?"
          title={`O custo acompanha o crescimento — e o saldo fechou em ${brlCompact(acumulado)}`}
          subtitle="Mercadoria é o maior gasto; aluguel e folha formam a base fixa. Mesmo assim, todos os meses fecharam no azul."
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ChartCard
              title="Para onde vai cada real: estrutura de custos do semestre"
              subtitle={`CMV é ${pct(cmv.percent, 0)} dos gastos — ${fixasTop
                .map((d) => d.name.toLowerCase())
                .join(" e ")} são os maiores custos fixos`}
            >
              <ExpenseBreakdownChart />
            </ChartCard>
            <ChartCard
              title="Faturamento cresce, mas custo acompanha — evolução mês a mês"
              subtitle={margemTexto}
            >
              <RevenueVsCostChart />
            </ChartCard>
          </div>

          <ChartCard
            title="O saldo acumula mês a mês — trajetória do semestre"
            subtitle={`${
              positivos === mensal.length ? "Todos os meses positivos" : `${positivos} de ${mensal.length} meses positivos`
            }; saldo acumulado de ${brlCompact(acumulado)} ao final de ${mensal[mensal.length - 1].month}`}
          >
            <MonthlyTrendChart />
          </ChartCard>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <CalloutBox variant="insight">
              O CMV consome {pct(cmv.percent, 0)} de tudo que sai do caixa. Pequenas melhorias na compra têm mais efeito
              no saldo do que cortes nas despesas fixas.
            </CalloutBox>
            <CalloutBox variant="action">
              Consolidar pedidos de importados com menos fornecedores para negociar volume e diluir o frete de
              importação.
            </CalloutBox>
          </div>
        </StorySection>

        {/* ATO 4 — Eficiência operacional */}
        <StorySection
          act={4}
          question="O estoque está saudável?"
          title={`Capital parado em ${giroCritico.map((c) => c.category.toLowerCase()).join(" e ") || "nenhuma categoria"}`}
          subtitle="Giro mostra quanto o estoque se renova; margem mostra quanto cada venda deixa. O ideal é girar rápido o que tem boa margem."
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ChartCard
              title={`Giro de ${times(giroTop.turnover)} em ${giroTop.category.toLowerCase()} contra ${times(giroBottom.turnover)} em ${giroBottom.category.toLowerCase()} — eficiência do estoque`}
              subtitle="Categorias com giro abaixo de 3x têm capital parado e risco de perda"
            >
              <StockTurnoverChart />
            </ChartCard>
            <ChartCard
              title={`${margens[0].name} e ${margens[1].name} lideram margem; ${margens[margens.length - 1].name} tem a menor`}
              subtitle={`Produtos do empório têm margem média de ${pct(margemEmporio)}, contra ${pct(margemDestilados)} dos destilados`}
            >
              <MarginByProductChart />
            </ChartCard>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {giroCritico.length > 0 && (
              <CalloutBox variant="warning">
                {giroCritico.map((c) => `${c.category} (${times(c.turnover)})`).join(" e ")} giram bem abaixo da meta de{" "}
                {metas.giroEstoque}x. Reduzir o volume dos próximos pedidos dessas categorias libera caixa.
              </CalloutBox>
            )}
            <CalloutBox variant="action">
              Montar kits de empório (massa + azeite + conserva + vinho) junta itens de alta margem com o produto que
              mais vende — aumenta o ticket e o giro ao mesmo tempo.
            </CalloutBox>
          </div>
        </StorySection>

        {/* ATO 5 — Riscos */}
        <StorySection
          act={5}
          question="Quais são os riscos?"
          title={`${plural(nCrit, "alerta crítico", "alertas críticos")} pedem ação agora`}
          subtitle="Fiados em aberto, estoque no limite e pendências financeiras — o que antes ficava escondido em abas separadas da planilha."
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ChartCard
              title={`${brl(totalFiado)} em fiados abertos — ${plural(fiados90.count, "cliente", "clientes")} com mais de 90 dias`}
              subtitle={`Inadimplência é ${pct(inad)} do faturamento; meta: zerar fiados acima de ${metas.fiadoDiasMax} dias`}
            >
              <DebtorsTable />
            </ChartCard>
            <ChartCard
              title="Painel de alertas: o que precisa de atenção agora"
              subtitle={`${plural(nCrit, "alerta crítico", "alertas críticos")} e ${plural(nOutros, "aviso operacional", "avisos operacionais")} ativos`}
            >
              <ul className="space-y-3">
                {alerts.map((a) => (
                  <AlertCard key={a.message} alert={a} />
                ))}
              </ul>
            </ChartCard>
          </div>

          {fiadosMeta.count > 0 && (
            <CalloutBox variant="critical">
              {plural(fiadosMeta.count, "cliente deve", "clientes devem")} há mais de {metas.fiadoDiasMax} dias, somando{" "}
              {brl(fiadosMeta.total)} ({fiadosMeta.list.map((d) => d.cliente).join(", ")}). Combinar parcelamento via PIX e
              suspender novas vendas a prazo até a regularização.
            </CalloutBox>
          )}
        </StorySection>
      </main>

      <Footer />
    </>
  );
}
