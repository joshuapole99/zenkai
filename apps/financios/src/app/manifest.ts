import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Financios – Spaarplan",
    short_name: "Financios",
    description: "Ontdek waar jouw geld naartoe gaat en fix je spaardoel.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B0F14",
    theme_color: "#6366F1",
    icons: [
      {
        src: "/icon.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
