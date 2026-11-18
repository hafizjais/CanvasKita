import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name}: websites that make your business look the part`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function getLogo() {
  "use cache";
  // A string, because cached values must be serialisable (a Buffer is not).
  return (await readFile(join(process.cwd(), "public", "canvas-kita-logo.png"))).toString("base64");
}

export default async function Image() {
  const logo = await getLogo();
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
          background: "#121418",
          color: "#eef0f3",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={`data:image/png;base64,${logo}`} width={246} height={38} alt="" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.02, letterSpacing: -2, maxWidth: 940 }}>
            Websites that make your business look the part.
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#9ba4af" }}>
            Business websites, landing pages and online stores in Malaysia
          </div>
        </div>
        <div style={{ display: "flex", height: 6, width: 120, background: "#f08b46" }} />
      </div>
    ),
    size,
  );
}
