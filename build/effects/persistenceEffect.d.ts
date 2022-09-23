import * as THREE from "three";
import type { Base } from "../base/base";
import { Component } from "../components/component";
export interface PersistenceEffectConfig {
    clearColor: number;
    fadeFactor: number;
    fadeColor: THREE.Color;
    scaleX: number;
    scaleY: number;
    rotationAngle: number;
}
declare class PersistenceEffect extends Component {
    isActive: boolean;
    clearColor: number;
    fadeFactor: number;
    fadeColor: THREE.Color;
    scaleX: number;
    scaleY: number;
    rotationAngle: number;
    orthoCamera: THREE.OrthographicCamera;
    uvMatrix: THREE.Matrix3;
    fadeMaterial: THREE.ShaderMaterial;
    fadePlane: THREE.Mesh;
    resultPlane: THREE.Mesh;
    framebuffer1: THREE.WebGLRenderTarget;
    framebuffer2: THREE.WebGLRenderTarget;
    constructor(base: Base, config?: Partial<PersistenceEffectConfig>);
    addExisting(): void;
    enable(): void;
    disable(): void;
    update(time: number): void;
}
export { PersistenceEffect };
