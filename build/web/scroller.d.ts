export interface Scroll {
    current: number;
    target: number;
    ease: number;
    last: number;
    delta: number;
    direction: "up" | "down" | "";
}
/**
 * A scroller to detect `wheel` event.
 *
 * Demo: https://kokomi-playground.vercel.app/#textureRecursion
 */
declare class WheelScroller {
    scroll: Scroll;
    constructor();
    listenForScroll(): void;
    syncScroll(): void;
}
export { WheelScroller };
