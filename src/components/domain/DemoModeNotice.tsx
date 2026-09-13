import { Info } from "lucide-react";

export function DemoModeNotice() {
  return (
    <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-ms-gray-500/20 bg-ms-gray-100 p-3.5 text-xs text-ms-gray-500">
      <Info size={15} className="mt-0.5 shrink-0" />
      <span>
        Ambiente de demonstração: o Firebase ainda não está configurado nesta
        instância, então autenticação e dados reais estão desativados. Configure
        as variáveis <code className="text-ms-black">NEXT_PUBLIC_FIREBASE_*</code> para
        habilitar.
      </span>
    </div>
  );
}
