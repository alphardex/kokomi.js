import * as THREE from "three";
import { Component } from "./component";
import { Base } from "../base/base";
import { GPUComputationRenderer, type Variable } from "three/examples/jsm/misc/GPUComputationRenderer.js";
import { UniformInjector } from "./uniformInjector";
export interface GPUComputerConfig {
    width: number;
    height: number;
}
/**
 * An encapsuled class for `GPUComputationRenderer`
 */
declare class GPUComputer extends Component {
    gpu: GPUComputationRenderer;
    uj: UniformInjector;
    constructor(base: Base, config?: Partial<GPUComputerConfig>);
    createTexture(): THREE.DataTexture;
    createVariable(name: string, computeShader: string, texture: THREE.DataTexture, uniforms: {
        [uniform: string]: THREE.IUniform;
    }): Variable;
    init(): void;
    update(time: number): void;
    getVariableRt(variable: Variable): THREE.Texture;
}
export { GPUComputer };
