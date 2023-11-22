import * as THREE from "three";

import { Component } from "../components/component";
import { Base } from "../base/base";

export type Form = "circle" | "ring" | "rect";

export interface LightFormerConfig {
  color: string;
  form: Form;
  intensity: number;
}

class LightFormer extends Component {
  material: THREE.MeshBasicMaterial;
  mesh: THREE.Mesh;
  constructor(base: Base, config: Partial<LightFormerConfig> = {}) {
    super(base);

    const { color = "white", form = "rect", intensity = 1 } = config;

    const geometry = {
      circle: new THREE.RingGeometry(0, 1, 64),
      ring: new THREE.RingGeometry(0.5, 1, 64),
      rect: new THREE.PlaneGeometry(),
    }[form as Form];
    const material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      color: new THREE.Color(color),
    });
    material.color.multiplyScalar(intensity);
    this.material = material;
    const mesh = new THREE.Mesh(geometry, material);
    this.mesh = mesh;
  }
  addExisting(): void {
    this.container.add(this.mesh);
  }
}

export default LightFormer;
