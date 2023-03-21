import * as THREE from "three";
import type { Base } from "../base/base";
import { Component } from "../components/component";
export interface FirstPersonCameraConfig {
    camera: THREE.Camera;
    phiSpeed: number;
    thetaSpeed: number;
    translation: THREE.Vector3;
    forwardSpeed: number;
    leftSpeed: number;
}
/**
 * Reference: https://www.youtube.com/watch?v=oqKzxPMLWxo&t=28s&ab_channel=SimonDev
 */
declare class FirstPersonCamera extends Component {
    camera: THREE.Camera;
    rotation: THREE.Quaternion;
    phi: number;
    theta: number;
    phiSpeed: number;
    thetaSpeed: number;
    rotationEnabled: boolean;
    translation: THREE.Vector3;
    forwardSpeed: number;
    leftSpeed: number;
    translationEnabled: boolean;
    constructor(base: Base, config?: Partial<FirstPersonCameraConfig>);
    update(time: number): void;
    updateRotation(): void;
    updateTranslation(): void;
    updateCamera(): void;
}
export { FirstPersonCamera };
