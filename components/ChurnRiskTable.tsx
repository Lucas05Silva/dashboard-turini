import StatusBadge from "./StatusBadge";
import { getChurnRisk } from "@/lib/indicators";
import { brl, num } from "@/lib/format";

export default function ChurnRiskTable() {
  const rows = getChurnRisk();

  return (
    <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Clientes em risco de churn, do maior para o menor risco</caption>
        <thead>
          <tr className="border-b border-white/[0.08] text-xs uppercase tracking-wider text-ink-muted">
            <th scope="col" className="pb-3 pr-3 font-medium">Cliente</th>
            <th scope="col" className="px-3 pb-3 text-right font-medium">Sem comprar</th>
            <th scope="col" className="hidden px-3 pb-3 text-right font-medium sm:table-cell">Ticket</th>
            <th scope="col" className="hidden pb-3 pl-3 font-medium sm:table-cell">Risco</th>
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {rows.map((c) => (
            <tr key={c.cliente} className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]">
              <td className="py-3 pr-3">
                <p className="font-medium text-ink">
                  {c.cliente}
                  {c.tipo === "B2B" && (
                    <span className="ml-2 rounded border border-gold/30 px-1.5 py-px text-[10px] font-semibold uppercase tracking-wider text-gold">
                      B2B
                    </span>
                  )}
                </p>
                <div className="my-1 sm:hidden">
                  <StatusBadge status={c.risco} />
                </div>
                <p className="text-xs text-ink-muted">
                  última compra {c.ultimaCompra} · {num(c.comprasTotal)} compras
                  <span className="sm:hidden"> · ticket {brl(c.ticketMedio)}</span>
                </p>
              </td>
              <td className="whitespace-nowrap px-3 py-3 text-right">
                <span className={c.risco === "alto" ? "font-semibold text-[#f08a6a]" : "text-ink"}>{c.diasInativo} dias</span>
                <p className="text-xs text-ink-muted">média {c.intervaloMedio} d</p>
              </td>
              <td className="hidden whitespace-nowrap px-3 py-3 text-right text-ink-secondary sm:table-cell">
                {brl(c.ticketMedio)}
              </td>
              <td className="hidden py-3 pl-3 sm:table-cell">
                <StatusBadge status={c.risco} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
