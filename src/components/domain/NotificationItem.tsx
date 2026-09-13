import Link from "next/link";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatDate } from "@/lib/utils/format";
import type { Notification } from "@/types";

export function NotificationItem({
  notification,
  onOpen,
}: {
  notification: Notification;
  onOpen?: (id: string) => void;
}) {
  const content = (
    <div
      className={cn(
        "flex gap-3 rounded-xl border border-ms-black/[0.06] p-4 transition-colors",
        notification.read ? "bg-white" : "bg-ms-green-900/[0.04]"
      )}
    >
      <div
        className={cn(
          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          notification.read
            ? "bg-ms-gray-100 text-ms-gray-500"
            : "bg-ms-green-900 text-white"
        )}
      >
        <Bell size={14} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ms-black">{notification.title}</p>
        <p className="mt-0.5 text-sm text-ms-gray-500">{notification.message}</p>
        <p className="mt-1.5 text-xs text-ms-gray-500/80">
          {formatDate(notification.createdAt)}
        </p>
      </div>
      {!notification.read && (
        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-ms-green-900" />
      )}
    </div>
  );

  if (notification.link) {
    return (
      <Link href={notification.link} onClick={() => onOpen?.(notification.id)}>
        {content}
      </Link>
    );
  }
  return (
    <button className="w-full text-left" onClick={() => onOpen?.(notification.id)}>
      {content}
    </button>
  );
}
