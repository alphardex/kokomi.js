import * as THREE from "three";
import type { Base } from "../base/base";
import { Component } from "../components/component";
export interface BoxConfig {
    width: number;
    height: number;
    depth: number;
    position: THREE.Vector3;
    material: THREE.Material;
}
/**
 * A cute box mesh that we can see everywhere
 */
declare class Box extends Component {
    mesh: THREE.Mesh;
    constructor(base: Base, config?: Partial<BoxConfig>);
    addExisting(): void;
    spin(time: number, axis?: "x" | "y" | "z", speed?: number): void;
}
export { Box };
