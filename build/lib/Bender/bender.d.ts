import * as THREE from "three";
/**
 * Credit: https://github.com/Sean-Bradley/Bender
 */
declare class Bender {
    bend(geometry: THREE.BufferGeometry, axis: string, angle: number): void;
}
export { Bender };
