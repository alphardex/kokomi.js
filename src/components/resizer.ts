import * as THREE from "three";

import { Component } from "./component";
import { Base } from "../base/base";

import { OrthographicCamera } from "../camera";

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
    const { base, aspect } = this;
    const { renderer, camera, composer } = base;

    // renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    if (composer) {
      composer.setSize(window.innerWidth, window.innerHeight);
      composer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    }

    // camera
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
    } else if (camera instanceof OrthographicCamera) {
      const { frustum } = camera;
      if (frustum) {
        [camera.left, camera.right, camera.top, camera.bottom] = [
          aspect * frustum * -0.5,
          aspect * frustum * 0.5,
          frustum * 0.5,
          frustum * -0.5,
        ];
        camera.updateProjectionMatrix();
      }
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
