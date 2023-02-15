import * as THREE from "three";

import { Component } from "./component";
import { Base } from "../base/base";

class Resizer extends Component {
  enabled: boolean;
  constructor(base: Base) {
    super(base);

    this.enabled = true;
  }
  get aspect() {
    return window.innerWidth / window.innerHeight;
  }
  resize() {
    const { base } = this;
    if (base.camera instanceof THREE.PerspectiveCamera) {
      base.camera.aspect = this.aspect;
      base.camera.updateProjectionMatrix();
      if (base.composer) {
        base.composer.setSize(window.innerWidth, window.innerHeight);
        base.composer.setPixelRatio(Math.min(2, window.devicePixelRatio));
      }
      base.renderer.setSize(window.innerWidth, window.innerHeight);
      base.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    }
    this.emit("resize");
  }
  listenForResize() {
    window.addEventListener("resize", () => {
      if (!this.enabled) {
        return;
      }

      this.resize();
    });
  }
  enable() {
    this.enabled = true;
  }
  disable() {
    this.enabled = false;
  }
}

export { Resizer };
