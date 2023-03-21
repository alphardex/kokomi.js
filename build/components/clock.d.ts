import * as THREE from "three";
import { Component } from "./component";
import { Base } from "../base/base";
/**
 * An encapsuled class for `THREE.Clock`.
 * You can get `elapsedTime` and `deltaTime` from it.
 */
declare class Clock extends Component {
    clock: THREE.Clock;
    deltaTime: number;
    elapsedTime: number;
    constructor(base: Base);
    update(time: number): void;
}
export { Clock };
