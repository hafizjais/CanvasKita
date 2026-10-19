import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name}: websites that make your business look the part`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#f3efe7",
          color: "#161513",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 34 }}>
          <span style={{ fontWeight: 700 }}>Hafiz MJ</span>
          <span style={{ opacity: 0.7 }}>Digital</span>
          <span style={{ width: 12, height: 12, background: "#c2643f", marginTop: 14 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.02, letterSpacing: -2, maxWidth: 940 }}>
            Websites that make your business look the part.
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#5c5850" }}>
            Business websites · Landing pages · Redesigns · Malaysia
          </div>
        </div>
        <div style={{ display: "flex", height: 6, width: 120, background: "#9a4a2c" }} />
      </div>
    ),
    size,
  );
}
