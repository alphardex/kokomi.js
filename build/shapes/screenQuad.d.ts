import * as THREE from "three";
import type { Base } from "../base/base";
import { Component } from "../components/component";
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
    constructor(base: Base, config?: Partial<PlaneConfig>);
    addExisting(): void;
    update(time: number): void;
}
export { ScreenQuad };
