import * as THREE from "three";
import { GLTF } from "three-stdlib";
export interface LoadVideoOptions extends HTMLMediaElement {
    unsuspend: "canplay" | "canplaythrough" | "loadstart" | "loadedmetadata";
    start: boolean;
}
declare const loadVideoTexture: (src: string, options?: Partial<LoadVideoOptions>) => Promise<THREE.VideoTexture>;
export interface LoadGLTFConfig {
    useDraco: boolean | string;
}
declare const loadGLTF: (path: string, config?: Partial<LoadGLTFConfig>) => Promise<GLTF | null>;
declare const loadFBX: (path: string) => Promise<THREE.Group | null>;
declare const loadHDR: (path: string) => Promise<THREE.DataTexture | null>;
export { loadVideoTexture, loadGLTF, loadFBX, loadHDR };
