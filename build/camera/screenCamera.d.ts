import * as THREE from "three";
import type { Base } from "../base/base";
import { Component } from "../components/component";
export interface ScreenCameraConfig {
    position: THREE.Vector3;
    near: number;
    far: number;
}
declare class ScreenCamera extends Component {
    camera: THREE.PerspectiveCamera;
    constructor(base: Base, config?: Partial<ScreenCameraConfig>);
    addExisting(): void;
}
export { ScreenCamera };
