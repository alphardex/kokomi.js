import * as THREE from "three";

import type { Base } from "../base/base";
import { Component } from "../components/component";

import mitt, { type Emitter } from "mitt";

export interface ImagePanoramaConfig {
  radius: number;
}

class ImagePanorama extends Component {
  material: THREE.MeshBasicMaterial;
  mesh: THREE.Mesh;
  emitter: Emitter<any>;
  constructor(
    base: Base,
    texture: THREE.Texture,
    config: Partial<ImagePanoramaConfig> = {}
  ) {
    super(base);

    const { radius = 5000 } = config;

    const geometry = new THREE.SphereGeometry(radius, 60, 40);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide,
      transparent: true,
      opacity: 1,
    });
    this.material = material;
    const mesh = new THREE.Mesh(geometry, material);
    this.mesh = mesh;

    this.emitter = mitt();

    this.onClick();
  }
  addExisting(): void {
    const { base, mesh } = this;
    const { scene } = base;

    scene.add(mesh);
  }
  onClick() {
    window.addEventListener("click", (event) => {
      const intersects = this.base.interactionManager.raycaster.intersectObject(
        this.mesh,
        true
      );
      const point = intersects[0].point.clone();
      const position = {
        x: point.x.toFixed(2),
        y: point.y.toFixed(2),
        z: point.z.toFixed(2),
      };
      const message = `${position.x}, ${position.y}, ${position.z}`;
      console.log(message);
      this.emitter.emit("click", point);
    });
  }
}

export { ImagePanorama };
