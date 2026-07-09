import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";

// 데모 페이지와 特商法 페이지는 noindex이므로 사이트맵에서 제외
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.meta.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
