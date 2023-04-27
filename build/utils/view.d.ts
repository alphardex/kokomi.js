import type { Base } from "../base/base";
declare const applyViewScissor: (base: Base, viewEl: HTMLElement) => void;
declare const computeViewWindowScale: (viewEl: HTMLElement) => {
    xScale: number;
    yScale: number;
};
export { applyViewScissor, computeViewWindowScale };
