import type { Base } from "../base/base";
export type CanvasSize = {
    top: number;
    left: number;
    height: number;
    width: number;
};
declare const applyViewScissor: (base: Base, viewEl: HTMLElement) => void;
declare const computeViewWindowScale: (viewEl: HTMLElement) => {
    xScale: number;
    yScale: number;
};
export { applyViewScissor, computeViewWindowScale };
