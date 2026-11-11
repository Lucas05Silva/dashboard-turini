import { CalendarDays, Wine } from "lucide-react";
import { ADEGA } from "@/lib/data";

const ACTS = [
  { id: "ato-1", label: "Saúde financeira" },
  { id: "ato-2", label: "Receita" },
  { id: "ato-3", label: "Custos" },
  { id: "ato-4", label: "Estoque" },
  { id: "ato-5", label: "Jornada do cliente" },
  { id: "ato-6", label: "Retenção e riscos" },
];

export default function Header() {
  return (
    <header className="border-b border-white/5">
      <div className="mx-auto max-w-7xl px-4 pb-6 pt-8 sm:px-6 lg:px-8 lg:pt-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex items-start gap-4">
            <div
              aria-hidden
              className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-gold/25 bg-gradient-to-b from-wine/40 to-wine/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
            >
              <Wine className="h-7 w-7 text-gold" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold/90">
                Painel de gestão
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                {ADEGA.nome}
              </h1>
              <p className="mt-1 text-sm text-ink-secondary">{ADEGA.subtitulo}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 text-xs text-ink-secondary">
              <CalendarDays className="h-3.5 w-3.5 text-ink-muted" aria-hidden />
              {ADEGA.periodo}
            </span>
            <span className="inline-flex h-9 items-center gap-2 rounded-full border border-status-ideal/25 bg-status-ideal/10 px-3.5 text-xs font-medium text-[#7ee07e]">
              <span className="relative flex h-2 w-2" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-status-ideal" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-status-ideal" />
              </span>
              Atualizado automaticamente
            </span>
          </div>
        </div>

        <nav aria-label="Atos do painel" className="-mx-4 mt-8 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <ol className="flex min-w-max gap-1.5">
            {ACTS.map((act, i) => (
              <li key={act.id}>
                <a
                  href={`#${act.id}`}
                  className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/[0.06] bg-card/60 px-3.5 text-sm text-ink-secondary transition-all duration-200 hover:border-gold/30 hover:bg-card hover:text-ink"
                >
                  <span className="text-[11px] font-semibold tabular-nums text-gold/80">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {act.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </header>
  );
}
