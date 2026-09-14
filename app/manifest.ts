//* Types Imports
import type { MetadataRoute } from "next";

// Export estático (GitHub Pages) exige rota de metadata gerada no build.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  // URLs relativas resolvem a partir do próprio manifest, então o app continua instalável quando o
  // GitHub Pages injeta um basePath (ex.: /izi-freelas).
  return {
    id: "./",
    name: "izi Freelas",
    short_name: "izi Freelas",
    description: "Clientes, tarefas e financeiro numa única plataforma para quem toca o negócio sozinho.",
    lang: "pt-BR",
    start_url: "./dashboard",
    scope: "./",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#18181b",
    categories: ["business", "productivity", "finance"],
    icons: [
      { src: "icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
