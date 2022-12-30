import * as THREE from "three";
import * as STDLIB from "three-stdlib";

import type { Base } from "../base/base";
import { Component } from "../components/component";

import { CustomMesh, CustomMeshConfig } from "./customMesh";

/**
 * A render plane for RenderTexture.
 */
class RenderQuad extends CustomMesh {
  constructor(
    base: Base,
    map: THREE.Texture,
    config: Partial<CustomMeshConfig> = {}
  ) {
    super(base, {
      vertexShader: "",
      fragmentShader: "",
      baseMaterial: new THREE.MeshBasicMaterial(),
      geometry:
        config.geometry ||
        new THREE.PlaneGeometry(window.innerWidth, window.innerHeight),
      materialParams: {
        map,
        transparent: true,
        ...config.materialParams,
      },
    });
  }
}

export { RenderQuad };
