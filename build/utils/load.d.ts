import * as THREE from "three";
export interface LoadVideoOptions extends HTMLMediaElement {
    unsuspend: "canplay" | "canplaythrough" | "loadstart" | "loadedmetadata";
    start: boolean;
}
declare const loadVideoTexture: (src: string, options?: Partial<LoadVideoOptions>) => Promise<THREE.VideoTexture>;
export { loadVideoTexture };
