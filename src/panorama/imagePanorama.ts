import * as THREE from "three";

import type { Base } from "../base/base";

import { BasicPanorama } from "./basicPanorama";

export interface ImagePanoramaConfig {
  id: string;
  radius: number;
}

/**
 * First you should add `kokomi.Viewer`, which automatically adds proper camera and orbitControls to your scene.
 * Then load your image asset with `kokomi.AssetManager`. After this, you can use `kokomi.ImagePanorama` to get the panorama scene and add it to the viewer.
 */
class ImagePanorama extends BasicPanorama {
  constructor(
    base: Base,
    texture: THREE.Texture,
    config: Partial<ImagePanoramaConfig> = {}
  ) {
    super(base);

    const { id = "", radius = 5000 } = config;

    this.id = id;

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
