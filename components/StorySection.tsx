import type { ReactNode } from "react";

type Props = {
  act: number;
  title: string;
  subtitle: string;
  question?: string;
  children: ReactNode;
};

export default function StorySection({ act, title, subtitle, question, children }: Props) {
  return (
    <section
      id={`ato-${act}`}
      aria-labelledby={`ato-${act}-title`}
      className="scroll-mt-6 border-t border-white/5 py-12 first:border-t-0 lg:py-16"
    >
      <div className="mb-8 max-w-3xl">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
          <span className="text-gold">Ato {act}</span>
          {question && (
            <>
              <span aria-hidden className="h-px w-6 bg-white/15" />
              <span className="text-[13px] font-medium normal-case tracking-normal">{question}</span>
            </>
          )}
        </p>
        <h2 id={`ato-${act}-title`} className="mt-3 text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-secondary sm:text-[15px]">{subtitle}</p>
        <div aria-hidden className="mt-6 h-px w-full bg-gradient-to-r from-gold/40 via-white/10 to-transparent" />
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}
