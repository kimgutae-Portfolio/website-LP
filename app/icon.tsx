import { ImageResponse } from "next/og";
import { siteConfig } from "@/site.config";

// 파비콘 (빌드 시 PNG로 생성됨)
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: siteConfig.theme.primary,
          borderRadius: 14,
        }}
      >
        <svg width="44" height="44" viewBox="0 0 32 32">
          <path d="M16 6.5 L26.5 15.2 V25.5 H5.5 V15.2 Z" fill="#ffffff" />
          <rect
            x="13.4"
            y="18.2"
            width="5.2"
            height="7.3"
            rx="1.4"
            fill={siteConfig.theme.primary}
          />
          <circle cx="16" cy="3.5" r="1.8" fill={siteConfig.theme.accent} />
        </svg>
      </div>
    ),
    { ...size },
  );
}
