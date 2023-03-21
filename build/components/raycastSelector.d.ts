import * as THREE from "three";
import { Component } from "./component";
import { Base } from "../base/base";
/**
 * An encapsuled class for `THREE.Raycaster`.
 *
 * Demo: https://kokomi-js.vercel.app/examples/#raycastSelector
 */
declare class RaycastSelector extends Component {
    raycaster: THREE.Raycaster;
    constructor(base: Base);
    getInterSects(targets?: THREE.Object3D<THREE.Event>[]): THREE.Intersection<THREE.Object3D<THREE.Event>>[];
    getFirstIntersect(targets?: THREE.Object3D<THREE.Event>[]): THREE.Intersection<THREE.Object3D<THREE.Event>> | null;
    onChooseIntersect(target: THREE.Object3D): THREE.Intersection<THREE.Object3D<THREE.Event>> | null;
    onChooseInclude(target: THREE.Object3D): THREE.Intersection<THREE.Object3D<THREE.Event>> | null;
}
export { RaycastSelector };
