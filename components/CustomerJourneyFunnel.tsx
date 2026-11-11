import { ChevronDown } from "lucide-react";
import { getFunnel } from "@/lib/indicators";
import { num, pct } from "@/lib/format";

// Interpola do azul (topo do funil) ao verde-água (base)
const FROM = [0x39, 0x87, 0xe5];
const TO = [0x19, 0x9e, 0x70];
const mix = (t: number) =>
  `rgb(${FROM.map((c, i) => Math.round(c + (TO[i] - c) * t)).join(",")})`;

/** Funil da jornada: barras centralizadas de largura proporcional + conversão entre etapas. */
export default function CustomerJourneyFunnel() {
  const steps = getFunnel();
  const n = steps.length;

  return (
    <ol className="space-y-1" aria-label="Funil da jornada do cliente">
      {steps.map((s, i) => (
        <li key={s.stage}>
          {i > 0 && (
            <div className="flex items-center justify-center gap-1.5 py-1 text-xs text-ink-muted">
              <ChevronDown className="h-3.5 w-3.5" aria-hidden />
              <span className="tabular-nums">
                <span className="font-semibold text-ink-secondary">{pct(s.conversao)}</span> seguiram ·{" "}
                {num(s.perdidos)} pararam aqui
              </span>
            </div>
          )}
          <div className="flex items-center gap-3">
            <span className="w-32 shrink-0 text-right text-sm leading-tight text-ink-secondary sm:w-44">{s.stage}</span>
            <div className="relative flex h-10 flex-1 items-center justify-center">
              <div
                className="h-full rounded-md transition-all duration-200"
                style={{ width: `${Math.max(s.percent, 8)}%`, backgroundColor: mix(n > 1 ? i / (n - 1) : 0) }}
              />
            </div>
            <span className="w-20 shrink-0 text-right tabular-nums">
              <span className="block text-sm font-semibold text-ink">{num(s.count)}</span>
              <span className="block text-xs text-ink-muted">{pct(s.percent)}</span>
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}
