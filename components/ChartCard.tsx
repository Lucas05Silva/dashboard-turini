import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export default function ChartCard({ title, subtitle, children, footer, className = "" }: Props) {
  return (
    <article
      className={`flex min-w-0 flex-col rounded-2xl border border-white/[0.06] bg-card p-5 transition-all duration-200 hover:border-white/10 hover:bg-[#171716] sm:p-6 ${className}`}
    >
      <header className="mb-5">
        <h3 className="text-base font-semibold leading-snug text-ink">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{subtitle}</p>
      </header>
      <div className="min-w-0 flex-1">{children}</div>
      {footer && <div className="mt-5">{footer}</div>}
    </article>
  );
}
