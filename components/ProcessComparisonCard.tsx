import { CalendarCheck, CheckCircle2, Workflow, XCircle, Zap } from "lucide-react";

type Props = {
  process: string;
  before: string;
  after: string;
  impact: string;
  implantadoEm?: string;
  className?: string;
};

/** Card antes × depois de um processo automatizado. */
export default function ProcessComparisonCard({ process, before, after, impact, implantadoEm, className = "" }: Props) {
  return (
    <article
      className={`flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-card transition-all duration-200 hover:border-white/10 ${className}`}
    >
      <header className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-3.5">
        <h3 className="flex items-center gap-2.5 text-sm font-semibold text-ink">
          <Workflow className="h-4 w-4 text-gold" aria-hidden />
          {process}
        </h3>
        {implantadoEm && (
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs text-ink-muted">
            <CalendarCheck className="h-3.5 w-3.5" aria-hidden />
            desde {implantadoEm}
          </span>
        )}
      </header>

      <div className="grid flex-1 grid-cols-1 sm:grid-cols-2">
        <div className="bg-red-500/[0.05] px-5 py-4 sm:border-r sm:border-white/[0.06]">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-red-300">
            <XCircle className="h-3.5 w-3.5" aria-hidden />
            Antes
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{before}</p>
        </div>
        <div className="border-t border-white/[0.06] bg-green-500/[0.05] px-5 py-4 sm:border-t-0">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-green-300">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
            Depois
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{after}</p>
        </div>
      </div>

      <footer className="flex gap-2 border-t border-white/[0.06] bg-blue-500/[0.05] px-5 py-3.5 text-sm leading-relaxed">
        <Zap className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" aria-hidden />
        <p className="text-blue-300">
          <span className="font-semibold">Impacto: </span>
          <span className="text-ink-secondary">{impact}</span>
        </p>
      </footer>
    </article>
  );
}
