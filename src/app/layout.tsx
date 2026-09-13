import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/AuthProvider";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "MS Investor — Investimentos imobiliários com visão de longo prazo",
    template: "%s · MS Investor",
  },
  description:
    "Plataforma de relacionamento e acompanhamento de investidores em empreendimentos imobiliários selecionados. Acesse informações, documentos e evolução dos seus investimentos em um único ambiente.",
  openGraph: {
    title: "MS Investor",
    description:
      "Acesso a oportunidades imobiliárias selecionadas e acompanhamento completo do seu investimento.",
    type: "website",
    locale: "pt_BR",
    siteName: "MS Investor",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-ms-white text-ms-black antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
