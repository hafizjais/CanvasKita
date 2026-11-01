import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name}: websites that make your business look the part`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const mark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="150 140 960 970"><defs><linearGradient id="o" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0" stop-color="#f6a98f"/><stop offset="0.45" stop-color="#e5803f"/><stop offset="1" stop-color="#b9540c"/></linearGradient></defs><path d="M160 265 L338 162 V1035 L160 945 Z" fill="#ffffff"/><path d="M338 570 L640 415 L710 452 V835 L562 912 V632 L338 745 Z" fill="#e8edf3"/><path d="M588 148 L920 322 C1040 392 1100 500 1100 610 C1100 765 1010 865 890 925 L562 1102 V912 L710 838 L852 770 C905 735 928 680 928 612 C928 540 895 495 840 465 L588 335 Z" fill="url(#o)"/></svg>`;

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
          background: "#121418",
          color: "#eef0f3",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 34 }}>
          <img src={`data:image/svg+xml;base64,${Buffer.from(mark).toString("base64")}`} width={52} height={53} alt="" />
          <span style={{ fontWeight: 700 }}>Hafiz MJ</span>
          <span style={{ opacity: 0.7, marginLeft: -6 }}>Digital</span>
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
