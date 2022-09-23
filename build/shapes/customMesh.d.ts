import * as THREE from "three";
import type { Base } from "../base/base";
import { Component } from "../components/component";
import CustomShaderMaterial, { AllMaterialParams, CSMPatchMap } from "../lib/customShaderMaterial/vanilla";
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
declare class CustomMesh extends Component {
    material: CustomShaderMaterial;
    mesh: THREE.Mesh;
    constructor(base: Base, config?: Partial<CustomMeshConfig>);
    addExisting(): void;
    update(time: number): void;
}
export { CustomMesh };
