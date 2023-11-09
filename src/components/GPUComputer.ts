import * as THREE from "three";

import { Component } from "./component";
import { Base } from "../base/base";

import {
  GPUComputationRenderer,
  type Variable,
} from "three/examples/jsm/misc/GPUComputationRenderer.js";

import { UniformInjector } from "./uniformInjector";

export interface GPUComputerConfig {
  width: number;
  height: number;
}

/**
 * An encapsuled class for `GPUComputationRenderer`
 */
class GPUComputer extends Component {
  gpu: GPUComputationRenderer;
  uj: UniformInjector;
  constructor(base: Base, config: Partial<GPUComputerConfig> = {}) {
    super(base);

    const { width = 128, height = 128 } = config;

    // gpu
    const gpu = new GPUComputationRenderer(width, height, base.renderer);
    this.gpu = gpu;

    const uj = new UniformInjector(this.base);
    this.uj = uj;
  }
  createTexture() {
    return this.gpu.createTexture();
  }
  createVariable(
    name: string,
    computeShader: string,
    texture: THREE.DataTexture,
    uniforms: { [uniform: string]: THREE.IUniform }
  ) {
    const variable = this.gpu.addVariable(name, computeShader, texture);
    variable.wrapS = THREE.RepeatWrapping;
    variable.wrapT = THREE.RepeatWrapping;
    variable.material.uniforms = {
      ...variable.material.uniforms,
      ...this.uj.shadertoyUniforms,
      ...uniforms,
    };
    return variable;
  }
  setVariableDependencies(variable: Variable, dependencies: Variable[] | null) {
    this.gpu.setVariableDependencies(variable, dependencies);
  }
  init() {
    this.gpu.init();
  }
  update(time: number): void {
    const variables = (this.gpu as any).variables as Variable[];
    if (variables) {
      variables.forEach((variable) => {
        this.uj.injectShadertoyUniforms(variable.material.uniforms);
      });
    }

    this.gpu.compute();
  }
  getVariableRt(variable: Variable) {
    return this.gpu.getCurrentRenderTarget(variable).texture;
  }
}

export { GPUComputer };
