import * as THREE from "three";
import { EXRLoader, FBXLoader, FontLoader, GLTFLoader, KTX2Loader, OBJLoader, RGBELoader, SVGLoader } from "three-stdlib";
import { Component } from "./component";
import { Base } from "../base/base";
export type ResoureType = "gltfModel" | "texture" | "cubeTexture" | "font" | "fbxModel" | "audio" | "objModel" | "hdrTexture" | "svg" | "exrTexture" | "video" | "ktx2Texture";
export interface ResourceItem {
    name: string;
    type: ResoureType;
    path: string | string[];
}
export type ResoureList = ResourceItem[];
export interface Loaders {
    gltfLoader: GLTFLoader;
    textureLoader: THREE.TextureLoader;
    cubeTextureLoader: THREE.CubeTextureLoader;
    fontLoader: FontLoader;
    fbxLoader: FBXLoader;
    audioLoader: THREE.AudioLoader;
    objLoader: OBJLoader;
    hdrTextureLoader: RGBELoader;
    svgLoader: SVGLoader;
    exrLoader: EXRLoader;
    ktx2Loader: KTX2Loader;
}
export interface AssetManagerConfig {
    useDracoLoader: boolean;
    dracoDecoderPath: string;
    ktx2TranscoderPath: string;
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
    setKTX2Loader(): void;
    startLoading(): void;
    resourceLoaded(resource: ResourceItem, file: any): void;
    get loadProgress(): number;
    get isLoaded(): boolean;
}
export { AssetManager };
