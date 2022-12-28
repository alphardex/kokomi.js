import type { Base } from "../base/base";

class Animator {
  base: Base;
  tasks: any[];
  constructor(base: Base) {
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
    this.base.render();
  }
}

export { Animator };
