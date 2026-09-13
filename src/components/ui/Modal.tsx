"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center animate-fade-in">
      <div
        className="absolute inset-0 bg-ms-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-white p-6 sm:p-8 shadow-2xl animate-fade-up",
          className
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          {title && (
            <h3 className="font-display text-xl text-ms-black">{title}</h3>
          )}
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="ml-auto -mr-2 -mt-2 rounded-full p-2 text-ms-gray-500 transition-colors hover:bg-ms-black/[0.04] hover:text-ms-black"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
