import * as THREE from "three";
import { Component } from "./component";
import { Base } from "../base/base";
/**
 * An encapsuled class to get mouse position.
 *
 * mouse: The same as Shadertoy's iMouse
 *
 * mouseDOM: The DOM position of the mouse
 *
 * mouseDOMDelta: The DOM position delta of the mouse
 *
 * mouseScreen: Mesh position following the mouse on the screen
 */
declare class IMouse extends Component {
    mouse: THREE.Vector2;
    mouseDOM: THREE.Vector2;
    mouseScreen: THREE.Vector2;
    prevMouseDOM: THREE.Vector2;
    isMouseMoving: boolean;
    mouseMoveOffset: number;
    mouseDOMDelta: THREE.Vector2;
    constructor(base: Base);
    getMouse(x: number, y: number): THREE.Vector2;
    getMouseDOM(x: number, y: number): THREE.Vector2;
    getMouseScreen(x: number, y: number): THREE.Vector2;
    listenForMouse(): void;
    syncMouseDOM(): void;
    judgeIsMouseMoving(): void;
    getMouseDOMDelta(): void;
    update(time: number): void;
}
export { IMouse };
