import Link from "next/link";
import { Logo } from "@/components/layout/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-ms-gray-100/40">
      <div className="px-5 pt-8 sm:px-8">
        <Logo />
      </div>
      <div className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-sm">{children}</div>
      </div>
      <div className="pb-8 text-center text-xs text-ms-gray-500">
        <Link href="/" className="hover:text-ms-black">Voltar ao site</Link>
      </div>
    </div>
  );
}
