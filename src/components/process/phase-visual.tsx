import { Headset } from "lucide-react";
import type { PhaseVisual as Kind } from "@/data/project-process";
import { at, Box, Coin, Front, IsoScene, pts, Shadow, shades, Top } from "@/components/process/iso";

const LINE = "#d8d0c1";
const INK_LINE = "#8a847a";

const Plate = () => <Box at={[0, 0, 0]} size={[120, 120, 8]} shade={shades.plate} />;

/** A tick drawn flat on top of a coin. */
function Tick({ c, r }: { c: [number, number, number]; r: number }) {
  const [cx, cy] = at(c);
  const s = r * 1.2;
  return (
    <polyline
      points={`${cx - s * 0.42},${cy} ${cx - s * 0.1},${cy + s * 0.22} ${cx + s * 0.45},${cy - s * 0.22}`}
      fill="none"
      stroke="#fdfbf7"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

/** Phase 01: a quotation sheet, a checklist and a confirmation badge. */
function Plan() {
  const rows = [52, 60, 68, 76];
  const checks = [24, 36, 48, 60];
  return (
    <IsoScene
      layers={[
        <g key="base">
          <Plate />
          <Shadow at={[88, 96, 8]} r={13} />
        </g>,
        <g key="docs">
          {/* Quotation */}
          <Box at={[12, 28, 8]} size={[54, 80, 2]} shade={shades.paper} />
          <Top x={[18, 44]} y={[34, 42]} z={10} fill={shades.accent.top} />
          {rows.map((y) => (
            <Top key={y} x={[18, y % 16 ? 52 : 60]} y={[y, y + 2]} z={10} fill={LINE} />
          ))}
          <Top x={[18, 34]} y={[94, 97]} z={10} fill={INK_LINE} />
          <Top x={[42, 60]} y={[92, 99]} z={10} fill={shades.accent.top} />
          {/* Checklist */}
          <Box at={[72, 14, 8]} size={[40, 60, 2]} shade={shades.paper} />
          {checks.map((y, i) => (
            <g key={y}>
              <Top x={[77, 83]} y={[y, y + 6]} z={10} fill={i < 3 ? shades.accent.top : LINE} />
              <Top x={[87, 106]} y={[y + 2, y + 4]} z={10} fill={LINE} />
            </g>
          ))}
        </g>,
        <g key="badge">
          <Coin at={[88, 96, 34]} r={13} h={5} shade={shades.accent}>
            <Tick c={[88, 96, 39]} r={13} />
          </Coin>
        </g>,
      ]}
    />
  );
}

/** Phase 02: a laptop showing a page layout, with design layers beside it. */
function Build() {
  return (
    <IsoScene
      layers={[
        <g key="base">
          <Plate />
          <Shadow at={[106, 22, 8]} r={14} />
        </g>,
        <g key="laptop">
          <Box at={[10, 38, 8]} size={[80, 4, 60]} shade={shades.ink} />
          <Front x={[14, 86]} z={[13, 64]} y={42} fill="#fdfbf7" />
          <Front x={[14, 86]} z={[58, 64]} y={42} fill="#e9e3d6" />
          <Front x={[18, 50]} z={[49, 53]} y={42} fill="#3a3733" />
          <Front x={[18, 44]} z={[44, 46]} y={42} fill={LINE} />
          <Front x={[18, 32]} z={[37, 41]} y={42} fill={shades.accent.top} />
          <Front x={[56, 82]} z={[36, 54]} y={42} fill={shades.soft.left} />
          <Front x={[18, 38]} z={[17, 31]} y={42} fill="#efe9de" />
          <Front x={[42, 62]} z={[17, 31]} y={42} fill="#efe9de" />
          <Front x={[66, 82]} z={[17, 31]} y={42} fill="#efe9de" />
          <Box at={[10, 42, 8]} size={[80, 56, 4]} shade={shades.ink} />
          <Top x={[16, 84]} y={[48, 74]} z={12} fill="#4a4641" />
          <Top x={[40, 60]} y={[80, 92]} z={12} fill="#4a4641" />
        </g>,
        <g key="layers">
          <Box at={[94, 8, 28]} size={[26, 28, 2]} shade={shades.soft} />
          <Box at={[94, 8, 38]} size={[26, 28, 2]} shade={shades.paper} />
          <Top x={[98, 116]} y={[13, 17]} z={40} fill={shades.accent.top} />
          <Top x={[98, 112]} y={[22, 24]} z={40} fill={LINE} />
          <Top x={[98, 108]} y={[28, 30]} z={40} fill={LINE} />
          <Box at={[94, 8, 48]} size={[26, 28, 2]} shade={shades.accent} />
        </g>,
      ]}
    />
  );
}

/** Phase 03: desktop and mobile previews, an approval badge and a launch trail. */
function Launch() {
  return (
    <IsoScene
      layers={[
        <g key="base">
          <Plate />
          <Shadow at={[76, 26, 8]} r={11} />
        </g>,
        <g key="devices">
          <Box at={[28, 30, 8]} size={[30, 20, 2]} shade={{ top: "#5a5650", left: "#3a3733", right: "#262421" }} />
          <Box at={[39, 34, 10]} size={[8, 4, 20]} shade={shades.ink} />
          <Box at={[6, 38, 24]} size={[74, 4, 48]} shade={shades.ink} />
          <Front x={[9, 77]} z={[27, 69]} y={42} fill="#fdfbf7" />
          <Front x={[9, 77]} z={[64, 69]} y={42} fill="#e9e3d6" />
          <Front x={[14, 42]} z={[54, 58]} y={42} fill="#3a3733" />
          <Front x={[14, 36]} z={[48, 50]} y={42} fill={LINE} />
          <Front x={[14, 26]} z={[41, 44]} y={42} fill={shades.accent.top} />
          <Front x={[48, 72]} z={[33, 59]} y={42} fill={shades.soft.left} />
          <Box at={[92, 84, 8]} size={[24, 4, 42]} shade={shades.ink} />
          <Front x={[94, 114]} z={[11, 47]} y={88} fill="#fdfbf7" />
          <Front x={[96, 112]} z={[38, 42]} y={88} fill="#3a3733" />
          <Front x={[96, 108]} z={[32, 34]} y={88} fill={LINE} />
          <Front x={[96, 112]} z={[18, 28]} y={88} fill={shades.soft.left} />
          <Front x={[96, 104]} z={[13, 15]} y={88} fill={shades.accent.top} />
        </g>,
        <g key="approve">
          <polyline
            points={pts([106, 82, 56], [108, 58, 68], [100, 34, 80])}
            fill="none"
            stroke={shades.accent.left}
            strokeWidth="1.6"
            strokeDasharray="3 4"
            strokeLinecap="round"
          />
          <Coin at={[76, 26, 78]} r={11} h={4} shade={shades.accent}>
            <Tick c={[76, 26, 82]} r={11} />
          </Coin>
        </g>,
      ]}
    />
  );
}

/** Phase 04: a layered project folder, a padlock and a support headset. */
function Support() {
  const shackle = Array.from({ length: 13 }, (_, i) => {
    const t = (Math.PI * i) / 12;
    return [99 - 7 * Math.cos(t), 68, 27 + 11 * Math.sin(t)] as [number, number, number];
  });
  return (
    <IsoScene
      layers={[
        <g key="base">
          <Plate />
        </g>,
        <g key="folder">
          <Box at={[12, 22, 8]} size={[26, 8, 2]} shade={shades.soft} />
          <Box at={[12, 28, 8]} size={[70, 70, 2]} shade={shades.soft} />
          <Box at={[18, 30, 10]} size={[58, 58, 2]} shade={shades.paper} />
          <Box at={[22, 34, 12]} size={[54, 56, 2]} shade={shades.paper} />
          <Top x={[28, 60]} y={[38, 40]} z={14} fill={LINE} />
          <Top x={[28, 52]} y={[44, 46]} z={14} fill={LINE} />
          <Box at={[12, 46, 14]} size={[70, 54, 3]} shade={shades.accent} />
          <Top x={[22, 50]} y={[56, 64]} z={17} fill="#fdfbf7" />
          {/* Padlock */}
          <polyline points={pts(...shackle)} fill="none" stroke="#3a3733" strokeWidth="4" strokeLinecap="round" />
          <Box at={[88, 62, 8]} size={[22, 12, 20]} shade={shades.ink} />
          <Front x={[97, 101]} z={[13, 20]} y={74} fill={shades.soft.top} />
        </g>,
      ]}
      overlay={
        <span className="absolute top-[2%] right-[14%] flex size-12 items-center justify-center rounded-full border border-ink/10 bg-card text-accent shadow-[0_14px_24px_-12px_rgba(22,21,19,0.45)]">
          <Headset className="size-6" strokeWidth={1.6} />
        </span>
      }
    />
  );
}

const scenes: Record<Kind, () => React.JSX.Element> = { plan: Plan, build: Build, launch: Launch, support: Support };

export function PhaseVisual({ kind }: { kind: Kind }) {
  const Scene = scenes[kind];
  return <Scene />;
}
