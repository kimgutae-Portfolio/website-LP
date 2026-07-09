import { ImageResponse } from "next/og";
import { siteConfig } from "@/site.config";

// iOS 홈 화면 아이콘 (빌드 시 PNG로 생성됨)
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
        }}
      >
        <svg width="124" height="124" viewBox="0 0 32 32">
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
