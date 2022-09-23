import * as THREE from "three";
import type { Base } from "../base/base";
import { Component } from "../components/component";
import { OrbitControls } from "../controls";
import { BasicPanorama } from "./basicPanorama";
export interface ViewerConfig {
    fov: number;
}
declare class Viewer extends Component {
    camera: THREE.PerspectiveCamera;
    orbitControls: OrbitControls;
    panoramas: BasicPanorama[];
    currentPanorama: BasicPanorama | null;
    constructor(base: Base, config?: Partial<ViewerConfig>);
    add(panorama: BasicPanorama): void;
    setPanorama(panorama: BasicPanorama, duration?: number): void;
}
export { Viewer };
