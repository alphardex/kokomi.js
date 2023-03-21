import * as THREE from "three";
import type { Base } from "../base/base";
import { Component } from "../components/component";
import { FBO } from "../renderTargets";
export interface MeshTransmissionMaterialConfig {
    backside: boolean;
    samples: number;
    background: THREE.Texture | THREE.Color | null;
    chromaticAberration: number;
    refraction: number;
    saturation: number;
    lightPosition: THREE.Vector3;
    diffuse: number;
    specular: number;
    fresnel: number;
    fresnelColor: THREE.Color;
}
/**
 * Reference: https://blog.maximeheckel.com/posts/refraction-dispersion-and-other-shader-light-effects/
 */
declare class MeshTransmissionMaterial extends Component {
    fbo: FBO;
    fboBack: FBO;
    material: THREE.ShaderMaterial;
    parent: THREE.Mesh;
    backside: boolean;
    background: THREE.Texture | THREE.Color | null;
    oldBg: THREE.Texture | THREE.Color | null;
    constructor(base: Base, parent: THREE.Mesh, config?: Partial<MeshTransmissionMaterialConfig>);
    update(time: number): void;
}
export { MeshTransmissionMaterial };
