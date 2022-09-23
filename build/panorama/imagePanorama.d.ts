import * as THREE from "three";
import type { Base } from "../base/base";
import { BasicPanorama } from "./basicPanorama";
export interface ImagePanoramaConfig {
    id: string;
    radius: number;
}
declare class ImagePanorama extends BasicPanorama {
    constructor(base: Base, texture: THREE.Texture, config?: Partial<ImagePanoramaConfig>);
}
export { ImagePanorama };
