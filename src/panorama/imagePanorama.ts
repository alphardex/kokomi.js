import * as THREE from "three";

import type { Base } from "../base/base";

import { BasicPanorama } from "./basicPanorama";

export interface ImagePanoramaConfig {
  radius: number;
}

class ImagePanorama extends BasicPanorama {
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
  }
}

export { ImagePanorama };
