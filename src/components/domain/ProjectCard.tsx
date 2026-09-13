import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { CardHover } from "@/components/ui/Card";
import { ProjectStatusBadge, DemoBadge } from "@/components/ui/StatusBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatCurrency } from "@/lib/utils/format";
import type { Project } from "@/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/investimentos/${project.slug}`}>
      <CardHover className="group overflow-hidden">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl bg-ms-gray-100">
          <Image
            src={project.coverImage}
            alt={project.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(min-width: 1024px) 380px, 100vw"
          />
          <div className="absolute left-4 top-4 flex gap-2">
            <ProjectStatusBadge status={project.status} />
            {project.isDemo && <DemoBadge />}
          </div>
        </div>
        <div className="p-6">
          <div className="mb-1 flex items-center gap-1.5 text-xs text-ms-gray-500">
            <MapPin size={13} />
            <span>
              {project.city} · {project.state}
            </span>
          </div>
          <h3 className="font-display text-xl text-ms-black">{project.name}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-ms-gray-500">
            {project.shortDescription}
          </p>
          <div className="mt-5">
            <ProgressBar value={project.constructionProgress} label="Progresso da obra" />
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-ms-black/[0.06] pt-4 text-sm">
            <span className="text-ms-gray-500">A partir de</span>
            <span className="font-medium text-ms-black">
              {formatCurrency(project.investmentMinimum)}
            </span>
          </div>
        </div>
      </CardHover>
    </Link>
  );
}
