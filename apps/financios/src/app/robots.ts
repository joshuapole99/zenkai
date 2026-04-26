import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/scan", "/upgrade", "/vakantie-sparen", "/5000-euro-sparen", "/10000-euro-sparen", "/auto-sparen", "/disclaimer", "/privacy", "/terms"],
        disallow: ["/checkout", "/plan", "/result"],
      },
    ],
    sitemap: "https://financios.nl/sitemap.xml",
  };
}
