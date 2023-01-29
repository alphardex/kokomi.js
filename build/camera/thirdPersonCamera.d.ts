import * as THREE from "three";
import type { Base } from "../base/base";
import { Component } from "../components/component";
export interface ThirdPersonCameraConfig {
    camera: THREE.Camera;
    offset: THREE.Vector3;
    lookAt: THREE.Vector3;
}
/**
 * Reference: https://www.youtube.com/watch?v=UuNPHOJ_V5o&t=483s&ab_channel=SimonDev
 */
declare class ThirdPersonCamera extends Component {
    target: THREE.Object3D;
    camera: THREE.Camera;
    currentPosition: THREE.Vector3;
    currentLookAt: THREE.Vector3;
    offset: THREE.Vector3;
    lookAt: THREE.Vector3;
    enabled: boolean;
    constructor(base: Base, target: THREE.Object3D, config?: Partial<ThirdPersonCameraConfig>);
    get idealOffset(): THREE.Vector3;
    get idealLookAt(): THREE.Vector3;
    update(time: number): void;
}
export { ThirdPersonCamera };
