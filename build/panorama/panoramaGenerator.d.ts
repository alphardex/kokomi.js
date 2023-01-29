import type { Base } from "../base/base";
import { Component } from "../components/component";
import { AssetManager } from "../components/assetManager";
import { Viewer } from "./viewer";
import { ImagePanorama } from "./imagePanorama";
export interface Vector3 {
    x: number;
    y: number;
    z: number;
}
export type PanoramaConfig = SceneConfig[];
export interface SceneConfig {
    id: string;
    url: string;
    name: string;
    infospots?: InfospotConfig[];
    [key: string]: any;
}
export interface InfospotConfig {
    id: string;
    point: Vector3;
    name?: string;
    jump?: string;
    className?: string;
    [key: string]: any;
}
/**
 * Generate panoramas with config.
 */
declare class PanoramaGenerator extends Component {
    config: PanoramaConfig | null;
    assetManager: AssetManager | null;
    viewer: Viewer | null;
    panoramas: ImagePanorama[];
    isSceneJumpEnabled: boolean;
    constructor(base: Base, config?: PanoramaConfig | null);
    setConfig(config: PanoramaConfig): void;
    getInfospotElByConfig(config: InfospotConfig): HTMLElement;
    generate(): void;
    generateByConfig(config: PanoramaConfig): void;
    generatePanoramas(): ImagePanorama[] | undefined;
    generateInfospots(): void;
    generateSceneJump(): void;
    generateInfospotsWithSceneJump(): void;
    get allInfospotConfig(): InfospotConfig[];
    outputCurrentScenePosition(): void;
    enableSceneJump(): void;
    disableSceneJump(): void;
}
export { PanoramaGenerator };
