import * as THREE from "three";
import type { Base } from "../base/base";
import { Component } from "../components/component";
import CustomShaderMaterial, { AllMaterialParams, CSMPatchMap } from "../lib/customShaderMaterial/vanilla";
import { UniformInjector } from "../components/uniformInjector";
export interface CustomMeshConfig {
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
/**
 * It contains a `THREE.Mesh` object in which you can custom its base material (which is based on [THREE-CustomShaderMaterial](https://github.com/FarazzShaikh/THREE-CustomShaderMaterial)).
 * Also, it provides all the shadertoy uniforms.
 *
 * Demo: https://kokomi-js.vercel.app/examples/#customMesh
 */
declare class CustomMesh extends Component {
    material: CustomShaderMaterial;
    mesh: THREE.Mesh;
    uniformInjector: UniformInjector;
    constructor(base: Base, config?: Partial<CustomMeshConfig>);
    addExisting(): void;
    update(time: number): void;
}
export { CustomMesh };
