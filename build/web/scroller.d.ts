export interface Scroll {
    current: number;
    target: number;
    ease: number;
    last: number;
    delta: number;
    direction: "up" | "down" | "";
}
declare class WheelScroller {
    scroll: Scroll;
    constructor();
    listenForScroll(): void;
    syncScroll(): void;
}
export { WheelScroller };
