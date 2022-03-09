import * as THREE from "three";
import { getScreenFov } from "maku.js";

import type { Base } from "../base/base";
import { Component } from "../components/component";

class ScreenCamera extends Component {
  camera: THREE.PerspectiveCamera;
  constructor(base: Base, config: any = {}) {
    super(base);

    const { z = 600, near = 100, far = 2000 } = config;

    const cameraPosition = new THREE.Vector3(0, 0, z);
    const fov = getScreenFov(cameraPosition.z);
    const container = base.container;
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.copy(cameraPosition);
    this.camera = camera;
  }
  addExisting(): void {
    this.base.camera = this.camera;
    this.base.interactionManager.camera = this.camera;
  }
}

export { ScreenCamera };
