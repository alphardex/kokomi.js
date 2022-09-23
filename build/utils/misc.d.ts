import * as THREE from "three";
declare const optimizeModelRender: (renderer: THREE.WebGLRenderer) => void;
declare const enableRealisticRender: (renderer: THREE.WebGLRenderer) => void;
declare const getEnvmapFromHDRTexture: (renderer: THREE.WebGLRenderer, texture: THREE.Texture) => THREE.Texture;
declare const getBaryCoord: (bufferGeometry: THREE.BufferGeometry) => void;
declare const sampleParticlesPositionFromMesh: (geometry: THREE.BufferGeometry, count?: number) => Float32Array;
declare const flatModel: (model: THREE.Object3D) => THREE.Object3D[];
declare const printModel: (modelParts: THREE.Object3D[], modelName?: string) => string;
declare const getViewport: (camera: THREE.Camera) => {
    width: number;
    height: number;
};
export { optimizeModelRender, enableRealisticRender, getEnvmapFromHDRTexture, getBaryCoord, sampleParticlesPositionFromMesh, flatModel, printModel, getViewport, };
