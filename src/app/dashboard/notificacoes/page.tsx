"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { NotificationItem } from "@/components/domain/NotificationItem";
import { EmptyState, LoadingState, ErrorState } from "@/components/ui/States";
import { useAuth } from "@/lib/auth/AuthProvider";
import { getUserNotifications, markNotificationRead } from "@/lib/data/notifications";
import type { Notification } from "@/types";

export default function NotificacoesPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[] | null>(null);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!user) return; // sem sessão (ex.: modo demonstração): nada a buscar
    let cancelled = false;
    getUserNotifications(user.uid)
      .then((data) => !cancelled && setNotifications(data))
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, [user, retryKey]);

  const resolvedNotifications = user ? notifications : [];

  const handleOpen = async (id: string) => {
    setNotifications((prev) =>
      prev ? prev.map((n) => (n.id === id ? { ...n, read: true } : n)) : prev
    );
    try {
      await markNotificationRead(id);
    } catch {
      // silencioso: a marcação como lida não deve travar a navegação
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl text-ms-black sm:text-3xl">Notificações</h1>
      <p className="mt-1 text-ms-gray-500">Atualizações dos seus empreendimentos e investimentos.</p>

      <div className="mt-8">
        {resolvedNotifications === null ? (
          error ? (
            <ErrorState onRetry={() => { setError(false); setRetryKey((k) => k + 1); }} />
          ) : (
            <LoadingState />
          )
        ) : resolvedNotifications.length === 0 ? (
          <EmptyState icon={<Bell size={20} />} title="Nenhuma notificação por aqui" />
        ) : (
          <div className="space-y-3">
            {resolvedNotifications.map((n) => (
              <NotificationItem key={n.id} notification={n} onOpen={handleOpen} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
