# Turini Adega & Empórios — Dashboard de Indicadores de Gestão

**Mapeamento e Controle de Indicadores de Gestão — Turini Adega & Empórios** · Projeto de Extensão Universitário

Uma adega local que opera como empório gourmet funcionava com processos de venda e pós-venda
manuais e descentralizados: planilha caótica, estoque "de cabeça", fiados no caderno e nenhum
acompanhamento do cliente após a compra. Este painel aplica gestão de processos e inteligência
analítica para organizar a **jornada do cliente**, estruturar a **retenção** por meio da tecnologia
(Power Automate + Excel) e transformar dados brutos em decisões — contado em **6 atos**:

| Ato | Pergunta | Conteúdo |
| --- | --- | --- |
| 1 | Como está a saúde do negócio? | 10 KPIs: faturamento, CMV, margem, ticket, vendas, saldo, clientes ativos, retenção, inadimplência, giro |
| 2 | De onde vem a receita e quem compra? | Mix por categoria, top 8 produtos, formas de pagamento, perfil de cliente (% receita × ticket) |
| 3 | Para onde vai o dinheiro? | Estrutura de custos, faturamento × CMV × fixas, saldo acumulado, margem por produto |
| 4 | O estoque atende a demanda? | Giro por categoria vs. meta |
| 5 | Como está a jornada do cliente? | Funil da jornada, novos × recorrentes, frequência de compra, intervalo entre compras, processos antes × depois |
| 6 | Estamos retendo clientes? | Retenção mensal, coorte, clientes em risco de churn, fiados, painel de alertas |

**Stack:** Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS 3 · Recharts 2 · Lucide React · fonte Outfit (`next/font/google`).

## Como rodar

```bash
npm install
npm run dev        # http://localhost:3000
```

Build de produção:

```bash
npm run build
npm start
```

> Em redes com proxy/antivírus que intercepta HTTPS, se o `npm install` falhar com erro de
> certificado, rode com `NODE_OPTIONS=--use-system-ca npm install`.

## Como trocar pelos dados reais

Edite **somente** [`lib/data.ts`](lib/data.ts). Todos os KPIs, percentuais, status e os números
citados nos títulos narrativos são **calculados** em [`lib/indicators.ts`](lib/indicators.ts) —
nada está digitado à mão na interface, então os títulos nunca contradizem os gráficos.

Para os números baterem entre si, mantenha:

- soma de `salesMix.revenue` = soma de `monthlyFinancials.faturamento`
- soma de cada mês em `paymentMethods` = faturamento daquele mês
- soma de `fixedExpenses.value` = soma de `monthlyFinancials.despesasFixas`
- soma de `newVsReturning.novos` = soma de `purchaseFrequency.count` = etapa "1ª compra" do funil
- `purchaseFrequency` "1 compra" = etapa "1ª compra" − etapa "2ª compra" do funil
- soma de `customerProfiles.percentReceita` = 100

O nível de risco de churn é calculado (inativo há `churnDiasAlto`+ dias **ou** parado há
`churnFatorAlto`× o próprio intervalo médio). O campo `implantadoEm` de cada processo marca o
mês da automação; o de pós-venda (`retencao: true`) é usado para comparar a retenção antes ×
depois e aparece como linha de referência no gráfico de retenção.

Metas (margem, giro, prazo máximo de fiado, dias de inatividade) e a base de comparação com o semestre anterior
também ficam em `lib/data.ts` (`metas`, `periodoAnterior`). Alertas de estoque são gerados a
partir de `lowStock`; pendências avulsas vão em `manualAlerts`.

## Estrutura

```
app/            layout (fonte, metadata), página com os 5 atos, estilos globais
components/     StorySection, ChartCard, CalloutBox, KpiCard/KpiRow, StatusBadge, AlertCard,
                DebtorsTable, Header, Footer e os 8 gráficos (*Chart.tsx)
lib/data.ts         dados brutos (placeholders)
lib/indicators.ts   cálculo de todos os indicadores
lib/format.ts       formatação pt-BR (R$, %, x)
lib/chartTheme.ts   paleta e configuração padrão dos gráficos
```

## Decisões de visualização

- Sem pizza/rosca: composições usam barras horizontais ranqueadas.
- Cor de destaque só no que conta a história (top categorias, PIX vs. fiado, CMV); o restante esmaecido.
- Cores de status (ideal/atenção/baixo/crítico) nunca são usadas como cor de série; badges sempre têm ponto + texto.
- Rótulo só no último ponto da série de saldo acumulado; demais valores via tooltip.
- Animações dos gráficos são desligadas quando o sistema pede `prefers-reduced-motion`.

## Deploy na Vercel

O projeto já está pronto: na Vercel, **Add New → Project → importar `dashboard-turini`**.
O framework (Next.js), o comando de build (`next build`) e a pasta de saída são detectados
automaticamente — não é preciso configurar variáveis de ambiente. Cada push na `main` gera
um novo deploy.
