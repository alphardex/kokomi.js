import * as THREE from "three";

import { Component } from "../components/component";
import { Base } from "../base/base";

export interface EnvironmentConfig {
  resolution: number;
  near: number;
  far: number;
}

class Environment extends Component {
  fbo: THREE.WebGLCubeRenderTarget;
  cubeCamera: THREE.CubeCamera;
  virtualScene: THREE.Scene;
  constructor(base: Base, config: Partial<EnvironmentConfig> = {}) {
    super(base);

    const { resolution = 256, near = 1, far = 1000 } = config;

    const fbo = new THREE.WebGLCubeRenderTarget(resolution);
    fbo.texture.type = THREE.HalfFloatType;
    this.fbo = fbo;
    const cubeCamera = new THREE.CubeCamera(near, far, fbo);
    this.cubeCamera = cubeCamera;
    const virtualScene = new THREE.Scene();
    this.virtualScene = virtualScene;
  }
  update(): void {
    this.cubeCamera.update(this.base.renderer, this.virtualScene);
  }
  add(obj: THREE.Object3D) {
    this.virtualScene.add(obj);
  }
  get texture() {
    return this.fbo.texture;
  }
}

export { Environment };
