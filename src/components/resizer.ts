import * as THREE from "three";

import { Component } from "./component";
import { Base } from "../base/base";

class Resizer extends Component {
  constructor(base: Base) {
    super(base);
  }
  get aspect() {
    return window.innerWidth / window.innerHeight;
  }
  resize() {
    const { base } = this;
    if (base.camera instanceof THREE.PerspectiveCamera) {
      base.camera.aspect = this.aspect;
      base.camera.updateProjectionMatrix();
      base.renderer.setSize(window.innerWidth, window.innerHeight);
      base.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    }
  }
  listenForResize() {
    window.addEventListener("resize", () => {
      this.resize();
    });
  }
}

export { Resizer };
