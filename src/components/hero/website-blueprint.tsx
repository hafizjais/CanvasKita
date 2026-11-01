import { at, Box, pts, Top, type Shade } from "@/components/process/iso";
import { BlueprintStage } from "@/components/hero/blueprint-stage";

/**
 * An exploded isometric drawing of a business website: page, footer,
 * service cards, hero and navigation floating as separate layers, each
 * labelled like an architect's diagram. The layers settle into one finished
 * page as the visitor scrolls.
 */

const page: Shade = { top: "#e6eaef", left: "#c3cad3", right: "#a9b2bd" };
const sheet: Shade = { top: "#fbfcfd", left: "#d8dde4", right: "#c2c9d2" };
const dark: Shade = { top: "#2b3039", left: "#1d2127", right: "#15181d" };
const orange: Shade = { top: "#f08b46", left: "#c95f1c", right: "#9a4710" };
const peach: Shade = { top: "#f7dfcf", left: "#e8bfa2", right: "#d9a582" };

const BAR = "#cdd3da";
const INK = "#353a42";
const LIGHT = "#5b6370";

const VIEWBOX = "-238 -134 352 285";

/** A label at the left with a leader line to the layer it names. */
function Label({ text, anchor }: { text: string; anchor: [number, number, number] }) {
  const [ax, ay] = at(anchor);
  return (
    <g className="blueprint-label">
      <line x1={-140} y1={ay} x2={ax - 3} y2={ay} stroke="currentColor" strokeOpacity="0.35" strokeWidth="0.8" strokeDasharray="2 3" />
      <circle cx={ax} cy={ay} r={2.2} fill="#f08b46" />
      <text x={-144} y={ay} dy="0.34em" textAnchor="end" fontSize="10" fill="currentColor">
        {text}
      </text>
    </g>
  );
}

function Page() {
  const [cx, cy] = at([60, 75, 0]);
  return (
    <g>
      <ellipse cx={cx} cy={cy + 10} rx={112} ry={46} fill="#000" opacity="0.22" filter="blur(6px)" />
      <Box at={[0, 0, 0]} size={[120, 150, 5]} shade={page} />
    </g>
  );
}

function Footer() {
  return (
    <g>
      <Box at={[0, 128, 5]} size={[120, 22, 3]} shade={dark} />
      <Top x={[10, 34]} y={[135, 137]} z={8} fill={LIGHT} />
      <Top x={[10, 26]} y={[141, 143]} z={8} fill={LIGHT} />
      <Top x={[52, 72]} y={[135, 137]} z={8} fill={LIGHT} />
      <Top x={[52, 66]} y={[141, 143]} z={8} fill={LIGHT} />
      <Top x={[92, 110]} y={[136, 142]} z={8} fill="#f08b46" />
      <Label text="Footer & contact" anchor={[0, 150, 6.5]} />
    </g>
  );
}

function Cards() {
  return (
    <g>
      {[8, 44, 80].map((x) => (
        <g key={x}>
          <Box at={[x, 86, 5]} size={[32, 34, 5]} shade={sheet} />
          <Top x={[x + 5, x + 13]} y={[91, 99]} z={10} fill={x === 44 ? "#f08b46" : "#f7dfcf"} />
          <Top x={[x + 5, x + 26]} y={[103, 105]} z={10} fill={INK} />
          <Top x={[x + 5, x + 22]} y={[109, 111]} z={10} fill={BAR} />
          <Top x={[x + 5, x + 18]} y={[113, 115]} z={10} fill={BAR} />
        </g>
      ))}
      <Label text="Services" anchor={[8, 120, 7.5]} />
    </g>
  );
}

function HeroBlock() {
  return (
    <g>
      <Box at={[8, 24, 5]} size={[104, 54, 5]} shade={sheet} />
      <Top x={[16, 58]} y={[32, 37]} z={10} fill={INK} />
      <Top x={[16, 50]} y={[40, 45]} z={10} fill={INK} />
      <Top x={[16, 52]} y={[50, 52]} z={10} fill={BAR} />
      <Top x={[16, 46]} y={[55, 57]} z={10} fill={BAR} />
      <Box at={[16, 63, 10]} size={[22, 7, 2]} shade={orange} />
      <Box at={[66, 30, 10]} size={[38, 40, 3]} shade={peach} />
      <polygon points={pts([72, 64, 13], [72, 56, 13], [82, 44, 13], [90, 54, 13], [96, 48, 13], [98, 50, 13], [98, 64, 13])} fill="#f0b48a" />
      <Label text="Hero & call to action" anchor={[8, 78, 7.5]} />
    </g>
  );
}

function Navigation() {
  return (
    <g>
      <Box at={[0, 0, 5]} size={[120, 16, 4]} shade={dark} />
      <Top x={[6, 14]} y={[5, 11]} z={9} fill="#f08b46" />
      <Top x={[44, 54]} y={[7, 9]} z={9} fill={LIGHT} />
      <Top x={[58, 68]} y={[7, 9]} z={9} fill={LIGHT} />
      <Top x={[72, 82]} y={[7, 9]} z={9} fill={LIGHT} />
      <Box at={[94, 4, 9]} size={[20, 8, 1.5]} shade={orange} />
      <Label text="Navigation" anchor={[0, 16, 7]} />
    </g>
  );
}

export function WebsiteBlueprint() {
  return (
    <BlueprintStage
      viewBox={VIEWBOX}
      label="An exploded drawing of a business website: navigation, hero and call to action, services, and footer with contact details, coming together into one page."
      layers={[<Page key="page" />, <Footer key="footer" />, <Cards key="cards" />, <HeroBlock key="hero" />, <Navigation key="nav" />]}
    />
  );
}
