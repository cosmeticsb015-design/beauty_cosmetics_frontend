import type { MetadataRoute } from "next";

const siteUrl = "https://beautycosmeticssv.com";

const routes = [
  { path: "", priority: 1, changeFrequency: "daily" as const },
  { path: "/catalog", priority: 0.95, changeFrequency: "daily" as const },
  { path: "/about", priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/faq", priority: 0.75, changeFrequency: "monthly" as const },
  { path: "/terminos-y-condiciones", priority: 0.45, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
