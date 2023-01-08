import * as THREE from "three";
import * as STDLIB from "three-stdlib";
export interface LoadVideoOptions extends HTMLMediaElement {
    unsuspend: "canplay" | "canplaythrough" | "loadstart" | "loadedmetadata";
    start: boolean;
}
declare const loadVideoTexture: (src: string, options?: Partial<LoadVideoOptions>) => Promise<THREE.VideoTexture>;
export interface LoadGLTFConfig {
    useDraco: boolean | string;
}
declare const loadGLTF: (path: string, config?: Partial<LoadGLTFConfig>) => Promise<STDLIB.GLTF | null>;
declare const loadFBX: (path: string) => Promise<THREE.Group | null>;
export { loadVideoTexture, loadGLTF, loadFBX };
