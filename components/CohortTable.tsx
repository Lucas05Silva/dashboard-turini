import { COHORT_OFFSETS, getCohort } from "@/lib/indicators";

/** Fundo do heatmap por faixa de retenção */
function cellClass(v: number) {
  if (v > 50) return "bg-green-500/20";
  if (v >= 40) return "bg-green-500/15";
  if (v >= 30) return "bg-green-500/10";
  if (v >= 20) return "bg-yellow-500/10";
  return "bg-red-500/10";
}

export default function CohortTable() {
  const rows = getCohort();
  const offsets = Array.from({ length: COHORT_OFFSETS }, (_, i) => i + 1);

  return (
    <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
      <table className="w-full min-w-[300px] border-separate border-spacing-[3px] text-sm tabular-nums">
        <caption className="sr-only">
          Coorte: percentual de clientes adquiridos em cada mês que voltaram a comprar nos meses seguintes
        </caption>
        <thead>
          <tr className="text-xs text-ink-muted">
            <th scope="col" className="pb-1 text-left font-medium">Aquisição</th>
            {offsets.map((o) => (
              <th key={o} scope="col" className="pb-1 text-center font-medium">
                m+{o}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.acquired}>
              <th scope="row" className="pr-2 text-left font-medium text-ink-secondary">
                {r.acquired}
              </th>
              {offsets.map((o) => {
                const v = r.values[o - 1];
                return v === null || v === undefined ? (
                  <td key={o} className="rounded-md py-2.5 text-center text-ink-muted/60">
                    —
                  </td>
                ) : (
                  <td key={o} className={`rounded-md py-2.5 text-center font-medium text-ink ${cellClass(v)}`}>
                    {v}%
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-xs text-ink-muted">
        Leitura: dos clientes adquiridos em {rows[0]?.acquired}, {rows[0]?.values[0]}% voltaram a comprar no mês seguinte (m+1).
      </p>
    </div>
  );
}
