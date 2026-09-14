import type { MetadataRoute } from "next";
import { getPublicProjects } from "@/lib/data/projects";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getPublicProjects();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/investimentos",
    "/sobre",
    "/contato",
    "/login",
    "/cadastro",
    "/termos",
    "/privacidade",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${BASE_URL}/investimentos/${project.slug}`,
    lastModified: project.updatedAt,
  }));

  return [...staticRoutes, ...projectRoutes];
}
