import { Mesh, PerspectiveCamera, WebGLRenderTarget } from "three";
import { ReflectorOptions } from "three-stdlib";
export interface ReflectorConfig extends ReflectorOptions {
    ignoreObjects: THREE.Object3D[];
}
/**
 * Improved version of STDLIB.Reflector.
 * 1. Add ignoreObjects.
 */
declare class Reflector extends Mesh {
    ignoreObjects: THREE.Object3D[];
    isReflector: boolean;
    camera: PerspectiveCamera;
    material: THREE.ShaderMaterial;
    getRenderTarget: () => WebGLRenderTarget;
    dispose: () => void;
    constructor(geometry: THREE.BufferGeometry, options?: Partial<ReflectorConfig>);
}
export { Reflector };
