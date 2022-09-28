import * as THREE from "three";
import type { Base } from "../base/base";
import { Component } from "../components/component";
import CustomShaderMaterial, { AllMaterialParams, CSMPatchMap } from "../lib/customShaderMaterial/vanilla";
import { UniformInjector } from "../components/uniformInjector";
export interface CustomPointsConfig {
    geometry: THREE.BufferGeometry;
    baseMaterial: THREE.Material;
    vertexShader: string;
    fragmentShader: string;
    uniforms: {
        [uniform: string]: THREE.IUniform<any>;
    };
    patchMap: CSMPatchMap;
    materialParams: AllMaterialParams;
}
declare class CustomPoints extends Component {
    material: CustomShaderMaterial;
    points: THREE.Points;
    uniformInjector: UniformInjector;
    constructor(base: Base, config?: Partial<CustomPointsConfig>);
    addExisting(): void;
    update(time: number): void;
}
export { CustomPoints };
