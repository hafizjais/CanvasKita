import type { CSSProperties, ReactNode } from "react";

/**
 * Tiny isometric drawing kit for the process illustrations. World units are
 * arbitrary: +x runs down-right, +y down-left and +z straight up on screen.
 */

type V = [number, number, number];

const COS30 = Math.cos(Math.PI / 6);

const project = ([x, y, z]: V) => [(x - y) * COS30, (x + y) * 0.5 - z] as const;

export const pts = (...vertices: V[]) =>
  vertices.map((v) => project(v).map((n) => n.toFixed(1)).join(",")).join(" ");

export type Shade = { top: string; left: string; right: string };

export const shades = {
  plate: { top: "#ece5d8", left: "#dcd3c3", right: "#cbc1ae" },
  paper: { top: "#fdfbf7", left: "#e9e3d6", right: "#d8d0c1" },
  ink: { top: "#3a3733", left: "#262421", right: "#161513" },
  accent: { top: "#b45f3c", left: "#9a4a2c", right: "#7c3a21" },
  soft: { top: "#f1e3d7", left: "#e2cdbd", right: "#d2b8a5" },
} satisfies Record<string, Shade>;

/** A solid box: its two front faces and top. */
export function Box({ at: [x, y, z], size: [w, d, h], shade }: { at: V; size: V; shade: Shade }) {
  return (
    <g>
      <polygon points={pts([x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h])} fill={shade.left} />
      <polygon points={pts([x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h])} fill={shade.right} />
      <polygon points={pts([x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h])} fill={shade.top} />
    </g>
  );
}

/** A rectangle lying on a horizontal surface at height z. */
export const Top = ({ x: [x0, x1], y: [y0, y1], z, fill }: { x: [number, number]; y: [number, number]; z: number; fill: string }) => (
  <polygon points={pts([x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z])} fill={fill} />
);

/** A rectangle on a vertical surface facing +y (the left-hand front face). */
export const Front = ({ x: [x0, x1], z: [z0, z1], y, fill }: { x: [number, number]; z: [number, number]; y: number; fill: string }) => (
  <polygon points={pts([x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1])} fill={fill} />
);

/** A round token (badge) seen in isometric view. */
export function Coin({ at, r, h, shade, children }: { at: V; r: number; h: number; shade: Shade; children?: ReactNode }) {
  const [cx, cy] = project(at);
  const rx = r * Math.SQRT2 * COS30;
  const ry = r * Math.SQRT1_2;
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={shade.right} />
      <rect x={cx - rx} y={cy - h} width={rx * 2} height={h} fill={shade.left} />
      <ellipse cx={cx} cy={cy - h} rx={rx} ry={ry} fill={shade.top} />
      {children}
    </g>
  );
}

/** Screen position of a world point, for placing marks on a coin. */
export const at = (v: V) => project(v);

/** Soft contact shadow on the plate under a floating object. */
export function Shadow({ at: v, r }: { at: V; r: number }) {
  const [cx, cy] = project(v);
  return <ellipse cx={cx} cy={cy} rx={r * 1.22} ry={r * 0.7} fill="#161513" opacity="0.12" />;
}

export const VIEWBOX = "-114 -60 228 188";

/**
 * Renders each layer as its own SVG stacked in 3D space. Layers move apart in
 * depth when the card is hovered, tilted or selected.
 */
export function IsoScene({ layers, overlay }: { layers: ReactNode[]; overlay?: ReactNode }) {
  return (
    <span aria-hidden="true" className="journey-3d absolute inset-0 block">
      {layers.map((layer, index) => (
        <span key={index} className="journey-layer" style={{ "--z": `${index * 16}px` } as CSSProperties}>
          <svg viewBox={VIEWBOX} className="size-full" preserveAspectRatio="xMidYMid meet">
            {layer}
          </svg>
        </span>
      ))}
      {overlay && (
        <span className="journey-layer" style={{ "--z": `${layers.length * 16}px` } as CSSProperties}>
          {overlay}
        </span>
      )}
    </span>
  );
}
