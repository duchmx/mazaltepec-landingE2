import { ImageResponse } from "next/og";
import { site } from "@/content/copy";

/** Solid pine-800 card with the wordmark. No photography exists yet. */

export const alt = site.ogTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          backgroundColor: "#184A3A",
          color: "#F7F8F1",
          padding: 80,
          fontSize: 64,
        }}
      >
        <div style={{ fontSize: 24, letterSpacing: 6, color: "#E8DCC7" }}>ETAPA 2</div>
        {/* The wordmark is the title itself; repeating it below only crowds the card. */}
        <div style={{ marginTop: 24, lineHeight: 1.15 }}>{site.ogTitle}</div>
      </div>
    ),
    size,
  );
}
