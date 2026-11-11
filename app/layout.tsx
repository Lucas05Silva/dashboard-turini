import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { ADEGA } from "@/lib/data";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${ADEGA.nome} · Indicadores de Gestão`,
  description: `${ADEGA.subtitulo} — ${ADEGA.periodo}`,
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={outfit.variable}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
