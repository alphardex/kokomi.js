import * as THREE from "three";
import type { Base } from "../base/base";
import { Component } from "../components/component";
export interface ContactShadowsConfig {
    opacity: number;
    width: number;
    height: number;
    blur: number;
    far: number;
    smooth: boolean;
    resolution: number;
    frames: number;
    scale: number | [x: number, y: number];
    color: THREE.ColorRepresentation;
    depthWrite: boolean;
}
/**
 * Credit: https://github.com/mrdoob/three.js/blob/master/examples/webgl_shadow_contact.html
 */
declare class ContactShadows extends Component {
    frames: number;
    blur: number;
    smooth: boolean;
    shadowCamera: THREE.OrthographicCamera;
    renderTarget: THREE.WebGLRenderTarget;
    renderTargetBlur: THREE.WebGLRenderTarget;
    blurPlane: THREE.Mesh;
    depthMaterial: THREE.MeshDepthMaterial;
    horizontalBlurMaterial: THREE.ShaderMaterial;
    verticalBlurMaterial: THREE.ShaderMaterial;
    count: number;
    group: THREE.Group;
    mesh: THREE.Mesh;
    constructor(base: Base, config?: Partial<ContactShadowsConfig>);
    addExisting(): void;
    blurShadows(blur: number): void;
    update(time: number): void;
}
export { ContactShadows };
