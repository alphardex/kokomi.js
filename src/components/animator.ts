import type { Base } from "../base/base";

export interface AnimatorConfig {
  autoRender: boolean;
}

class Animator {
  base: Base;
  tasks: any[];
  autoRender: boolean;
  constructor(base: Base, config: Partial<AnimatorConfig> = {}) {
    const { autoRender = true } = config;

    this.autoRender = autoRender;

    this.base = base;
    this.tasks = [];
  }
  add(fn: any) {
    this.tasks.push(fn);
  }
  update() {
    this.base.renderer.setAnimationLoop((time: number) => {
      this.tick(time);
    });
  }
  tick(time = 0) {
    this.tasks.forEach((task) => {
      task(time);
    });

    if (this.autoRender) {
      this.base.render();
    }
  }
}

export { Animator };
