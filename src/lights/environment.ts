import * as THREE from "three";

import { Component } from "../components/component";
import { Base } from "../base/base";

export interface EnvironmentConfig {
  resolution: number;
  near: number;
  far: number;
  scene: THREE.Scene;
  options: THREE.RenderTargetOptions;
  textureType: THREE.TextureDataType;
}

class Environment extends Component {
  fbo: THREE.WebGLCubeRenderTarget;
  cubeCamera: THREE.CubeCamera;
  virtualScene: THREE.Scene;
  constructor(base: Base, config: Partial<EnvironmentConfig> = {}) {
    super(base);

    const {
      resolution = 256,
      near = 1,
      far = 1000,
      scene = null,
      options = {},
      textureType = THREE.HalfFloatType,
    } = config;

    const fbo = new THREE.WebGLCubeRenderTarget(resolution, options);
    fbo.texture.type = textureType;
    this.fbo = fbo;
    const cubeCamera = new THREE.CubeCamera(near, far, fbo);
    this.cubeCamera = cubeCamera;
    const virtualScene = scene || new THREE.Scene();
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
