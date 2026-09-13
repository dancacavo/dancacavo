"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { EmptyState, LoadingState, ErrorState } from "@/components/ui/States";
import { formatDate } from "@/lib/utils/format";
import { getAllInvestors } from "@/lib/data/users";
import type { UserProfile } from "@/types";

export default function AdminInvestorsPage() {
  const [investors, setInvestors] = useState<UserProfile[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getAllInvestors()
      .then((data) => !cancelled && setInvestors(data))
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl text-ms-black sm:text-3xl">Investidores</h1>
      <p className="mt-1 text-ms-gray-500">Usuários cadastrados na plataforma.</p>

      <div className="mt-8">
        {investors === null ? (
          error ? <ErrorState /> : <LoadingState />
        ) : investors.length === 0 ? (
          <EmptyState icon={<Users size={20} />} title="Nenhum investidor cadastrado ainda" />
        ) : (
          <div className="space-y-3">
            {investors.map((investor) => (
              <Card key={investor.id} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="font-medium text-ms-black">{investor.name || "Sem nome"}</p>
                  <p className="text-sm text-ms-gray-500">{investor.email}</p>
                </div>
                <div className="text-right text-sm text-ms-gray-500">
                  {investor.phone && <p>{investor.phone}</p>}
                  <p>Desde {formatDate(investor.createdAt)}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
