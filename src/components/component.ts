import type { Base } from "../base/base";

/**
 * By extending this class, you can make your components keep their own state and animation.
 *
 * Demo: https://kokomi-js.vercel.app/examples/#component
 */
class Component {
  base: Base;
  constructor(base: Base) {
    this.base = base;
    this.base.update((time: number) => this.update(time));
  }
  // 将组件添加至当前场景或替换当前场景中已有的组件
  addExisting() {
    1 + 1;
  }
  // 动画帧
  update(time: number) {
    1 + 1;
  }
}

export { Component };
