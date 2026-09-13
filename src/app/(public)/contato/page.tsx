import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com o time MS Investor.",
};

export default function ContatoPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ms-green-900">Contato</span>
      <h1 className="mt-3 max-w-lg font-display text-3xl text-ms-black sm:text-4xl">
        Fale com o nosso time.
      </h1>

      <div className="mt-12 grid gap-12 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-2">
          <div className="flex items-start gap-3">
            <Mail size={18} className="mt-0.5 text-ms-green-900" />
            <div>
              <p className="text-sm text-ms-gray-500">E-mail</p>
              <p className="font-medium text-ms-black">contato@msinvestor.exemplo</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone size={18} className="mt-0.5 text-ms-green-900" />
            <div>
              <p className="text-sm text-ms-gray-500">Telefone</p>
              <p className="font-medium text-ms-black">(00) 0000-0000</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin size={18} className="mt-0.5 text-ms-green-900" />
            <div>
              <p className="text-sm text-ms-gray-500">Endereço</p>
              <p className="font-medium text-ms-black">A definir</p>
            </div>
          </div>
          <p className="pt-2 text-xs text-ms-gray-500">
            Dados de contato de demonstração — atualize com as informações
            oficiais da empresa.
          </p>
        </div>

        <div className="lg:col-span-3">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
