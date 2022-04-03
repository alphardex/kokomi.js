import * as THREE from "three";

import type { Base } from "../base/base";
import { Component } from "../components/component";

export interface BoxConfig {
  width: number;
  height: number;
  depth: number;
  position: THREE.Vector3;
  material: THREE.Material;
}

class Box extends Component {
  mesh: THREE.Mesh;
  constructor(base: Base, config: Partial<BoxConfig> = {}) {
    super(base);

    const {
      width = 0.2,
      height = 0.2,
      depth = 0.2,
      position = new THREE.Vector3(0, 0, 0),
      material = new THREE.MeshBasicMaterial({
        color: new THREE.Color("#ffffff"),
      }),
    } = config;

    const geometry = new THREE.BoxGeometry(width, height, depth);

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    this.mesh = mesh;
  }
  addExisting(): void {
    this.base.scene.add(this.mesh);
  }
  spin(time: number, axis: "x" | "y" | "z" = "y", speed = 1) {
    const mesh = this.mesh;
    mesh.rotation[axis] = (time / 1000) * speed;
  }
}

export { Box };
