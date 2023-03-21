import * as THREE from "three";
declare const loadTextureFromImg: (el: HTMLImageElement | null) => THREE.Texture | null;
declare const loadCubemapFromImgs: (el: HTMLImageElement | null, els: HTMLImageElement[]) => THREE.CubeTexture | null;
declare const getUniformFromImg: (el: HTMLImageElement | null, name: string, parent?: HTMLElement | null) => {
    [x: string]: {
        value: THREE.Texture;
    };
};
export { loadTextureFromImg, loadCubemapFromImgs, getUniformFromImg };
