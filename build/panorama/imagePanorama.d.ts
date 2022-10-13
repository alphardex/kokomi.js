import * as THREE from "three";
import type { Base } from "../base/base";
import { BasicPanorama } from "./basicPanorama";
export interface ImagePanoramaConfig {
    id: string;
    radius: number;
}
/**
 * First you should add `kokomi.Viewer`, which automatically adds proper camera and orbitControls to your scene.
 * Then load your image asset with `kokomi.AssetManager`. After this, you can use `kokomi.ImagePanorama` to get the panorama scene and add it to the viewer.
 */
declare class ImagePanorama extends BasicPanorama {
    constructor(base: Base, texture: THREE.Texture, config?: Partial<ImagePanoramaConfig>);
}
export { ImagePanorama };
