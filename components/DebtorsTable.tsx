import StatusBadge from "./StatusBadge";
import { calcularTotalFiado, getDebtorsSorted } from "@/lib/indicators";
import { metas } from "@/lib/data";
import { brl } from "@/lib/format";

export default function DebtorsTable() {
  const rows = getDebtorsSorted();
  const total = calcularTotalFiado();

  return (
    <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Fiados em aberto, ordenados por dias de atraso</caption>
        <thead>
          <tr className="border-b border-white/[0.08] text-xs uppercase tracking-wider text-ink-muted">
            <th scope="col" className="pb-3 pr-3 font-medium">Cliente</th>
            <th scope="col" className="px-3 pb-3 text-right font-medium">Valor</th>
            <th scope="col" className="hidden px-3 pb-3 text-right font-medium sm:table-cell">Atraso</th>
            <th scope="col" className="pb-3 pl-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {rows.map((d) => {
            const overdue = d.diasAtraso > metas.fiadoDiasMax;
            return (
              <tr key={d.cliente} className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]">
                <td className="py-3 pr-3">
                  <p className="font-medium text-ink">{d.cliente}</p>
                  <p className="text-xs text-ink-muted">{d.itens}</p>
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-right text-ink">
                  {brl(d.valor)}
                  <p className={`text-xs sm:hidden ${overdue ? "font-semibold text-[#f08a6a]" : "text-ink-muted"}`}>
                    {d.diasAtraso} dias
                  </p>
                </td>
                <td
                  className={`hidden whitespace-nowrap px-3 py-3 text-right sm:table-cell ${
                    overdue ? "font-semibold text-[#f08a6a]" : "text-ink-secondary"
                  }`}
                >
                  {d.diasAtraso} dias
                </td>
                <td className="py-3 pl-3">
                  <StatusBadge status={d.status} />
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot className="tabular-nums">
          <tr>
            <th scope="row" className="pr-3 pt-4 text-sm font-medium text-ink-secondary">
              Total em aberto
            </th>
            <td className="whitespace-nowrap px-3 pt-4 text-right font-semibold text-ink">{brl(total)}</td>
            <td className="hidden sm:table-cell" />
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
