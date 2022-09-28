import * as THREE from "three";
import type { Base } from "../base/base";
import { Component } from "../components/component";
import { UniformInjector } from "../components/uniformInjector";
export interface PlaneConfig {
    vertexShader: string;
    fragmentShader: string;
    uniforms: {
        [uniform: string]: THREE.IUniform<any>;
    };
    shadertoyMode: boolean;
}
declare class ScreenQuad extends Component {
    material: THREE.ShaderMaterial;
    mesh: THREE.Mesh;
    uniformInjector: UniformInjector;
    constructor(base: Base, config?: Partial<PlaneConfig>);
    addExisting(): void;
    update(time: number): void;
}
export { ScreenQuad };
