import * as THREE from "three";
import { Component } from "./component";
import { Base } from "../base/base";
export interface FloatConfig {
    speed: number;
    rotationIntensity: number;
    floatIntensity: number;
    floatingRange: [number?, number?];
}
/**
 * A class that can make objects float.
 */
declare class Float extends Component {
    group: THREE.Group;
    speed: number;
    rotationIntensity: number;
    floatIntensity: number;
    floatingRange: [number?, number?];
    offset: number;
    constructor(base: Base, config?: Partial<FloatConfig>);
    addExisting(): void;
    add(...object: THREE.Object3D[]): void;
    update(time: number): void;
}
export { Float };
