import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // As imagens de demonstração dos empreendimentos são SVGs locais em /public.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
  },
};

export default nextConfig;
