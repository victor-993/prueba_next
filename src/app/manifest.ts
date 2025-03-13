import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mi Aplicación PWA",
    short_name: "MiPWA",
    description: "Una aplicación web progresiva con Next.js",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/icon512_rounded.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
