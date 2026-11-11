# Turini Adega & Empórios — Dashboard de Indicadores de Gestão

**Mapeamento e Controle de Indicadores de Gestão — Turini Adega & Empórios** · Projeto de Extensão Universitário

Painel que substitui a planilha manual da adega por indicadores de gestão organizados em uma
narrativa de **5 atos** (storytelling com dados):

| Ato | Pergunta | Conteúdo |
| --- | --- | --- |
| 1 | Como está a saúde financeira? | 8 KPIs: faturamento, CMV, margem bruta, ticket médio, nº de vendas, saldo, inadimplência, giro |
| 2 | De onde vem o dinheiro? | Mix por categoria, top 8 produtos, formas de pagamento por mês |
| 3 | Para onde vai o dinheiro? | Estrutura de custos, faturamento × CMV × despesas fixas, saldo acumulado |
| 4 | O estoque está saudável? | Giro por categoria vs. meta, margem por produto vs. média |
| 5 | Quais são os riscos? | Tabela de fiados, painel de alertas (estoque, financeiro, operacional) |

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

Metas (margem, giro, prazo máximo de fiado) e a base de comparação com o semestre anterior
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
