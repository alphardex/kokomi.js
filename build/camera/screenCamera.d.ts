import * as THREE from "three";
import type { Base } from "../base/base";
import { Component } from "../components/component";
export interface ScreenCameraConfig {
    position: THREE.Vector3;
    near: number;
    far: number;
}
/**
 * This camera can make the pixel unit of a WebGL element equals with one of a HTML Element. If combined with [maku.js](https://github.com/alphardex/maku.js), you can easily merge HTML with WebGL!
 *
 * Demo: https://kokomi-js.vercel.app/examples/#screenCamera
 */
declare class ScreenCamera extends Component {
    camera: THREE.PerspectiveCamera;
    constructor(base: Base, config?: Partial<ScreenCameraConfig>);
    addExisting(): void;
}
export { ScreenCamera };
