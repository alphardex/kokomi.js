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
      this.tasks.forEach((task) => {
        task(time);
      });
      if (this.base.composer) {
        this.base.composer.render();
      } else {
        this.base.renderer.render(this.base.scene, this.base.camera);
      }
    });
  }
}

export { Animator };
