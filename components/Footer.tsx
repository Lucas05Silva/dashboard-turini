import { Wine } from "lucide-react";
import { ADEGA } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-white/5">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-10 text-sm text-ink-muted sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex items-center gap-2.5">
          <Wine className="h-4 w-4 text-gold/70" aria-hidden />
          <span className="text-ink-secondary">{ADEGA.nome}</span>
          <span aria-hidden>·</span>
          <span>{ADEGA.periodo}</span>
        </div>
      </div>
    </footer>
  );
}
