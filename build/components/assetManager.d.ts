import * as THREE from "three";
import * as STDLIB from "three-stdlib";
import { Component } from "./component";
import { Base } from "../base/base";
export declare type ResoureType = "gltfModel" | "texture" | "cubeTexture" | "font" | "fbxModel" | "audio" | "objModel" | "hdrTexture" | "svg" | "exrTexture";
export interface ResourceItem {
    name: string;
    type: ResoureType;
    path: string | string[];
}
export declare type ResoureList = ResourceItem[];
export interface Loaders {
    gltfLoader: STDLIB.GLTFLoader;
    textureLoader: THREE.TextureLoader;
    cubeTextureLoader: THREE.CubeTextureLoader;
    fontLoader: STDLIB.FontLoader;
    fbxLoader: STDLIB.FBXLoader;
    audioLoader: THREE.AudioLoader;
    objLoader: STDLIB.OBJLoader;
    hdrTextureLoader: STDLIB.RGBELoader;
    svgLoader: STDLIB.SVGLoader;
    exrLoader: STDLIB.EXRLoader;
}
export interface AssetManagerConfig {
    useDracoLoader: boolean;
    dracoDecoderPath: string;
}
/**
 * This class can handle the preloads of assets (gltfModel, texture, cubeTexture, font, etc). You can just write a simple js file to config your assets without caring about various loaders.
 *
 * Demo: https://kokomi-js.vercel.app/examples/#assetManager
 */
declare class AssetManager extends Component {
    config: AssetManagerConfig;
    resourceList: ResoureList;
    items: any;
    toLoad: number;
    loaded: number;
    loaders: Partial<Loaders>;
    constructor(base: Base, list: ResoureList, config?: Partial<AssetManagerConfig>);
    setLoaders(): void;
    setDracoLoader(): void;
    startLoading(): void;
    resourceLoaded(resource: ResourceItem, file: any): void;
    get loadProgress(): number;
    get isLoaded(): boolean;
}
export { AssetManager };
