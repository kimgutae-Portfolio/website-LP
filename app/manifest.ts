import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";

// 스마트폰 "홈 화면에 추가" 시 로고·이름·테마색이 제대로 표시되도록 하는 설정
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.meta.siteName,
    short_name: siteConfig.meta.siteName,
    description: siteConfig.meta.description,
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: siteConfig.theme.primary,
    icons: [
      {
        src: "/brand/machinowebs-icon-1024.png",
        sizes: "1024x1024",
        type: "image/png",
      },
    ],
  };
}
