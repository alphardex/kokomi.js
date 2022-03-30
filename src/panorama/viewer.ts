import * as THREE from "three";

import type { Base } from "../base/base";
import { Component } from "../components/component";

import { OrbitControls } from "../controls";

export interface ViewerConfig {
  fov: number;
}

class Viewer extends Component {
  camera: THREE.PerspectiveCamera;
  orbitControls: OrbitControls;
  constructor(base: Base, config: Partial<ViewerConfig> = {}) {
    super(base);

    const { fov = 60 } = config;

    const camera = new THREE.PerspectiveCamera(
      fov,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    camera.position.set(0, 0, 1);
    base.camera = camera;
    base.interactionManager.camera = camera;
    this.camera = camera;

    const orbitControls = new OrbitControls(base);
    this.orbitControls = orbitControls;
  }
}

export { Viewer };
