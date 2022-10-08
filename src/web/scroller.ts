import * as THREE from "three";

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
 */
class WheelScroller {
  scroll: Scroll;
  constructor() {
    this.scroll = {
      current: 0,
      target: 0,
      ease: 0.05,
      last: 0,
      delta: 0,
      direction: "",
    };
  }
  // 监听滚动
  listenForScroll() {
    window.addEventListener("wheel", (e) => {
      const newScrollY = e.deltaY;
      const scrollYDelta = newScrollY;
      this.scroll.target += scrollYDelta;
    });
  }
  // 同步滚动的数据
  syncScroll() {
    this.scroll.current = THREE.MathUtils.lerp(
      this.scroll.current,
      this.scroll.target,
      this.scroll.ease
    );
    this.scroll.delta = this.scroll.current - this.scroll.last;
    this.scroll.direction = this.scroll.delta > 0 ? "down" : "up";
    this.scroll.last = this.scroll.current;
  }
}

export { WheelScroller };
