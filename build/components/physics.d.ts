import * as THREE from "three";
import * as CANNON from "cannon-es";
import { Component } from "./component";
import { Base } from "../base/base";
/**
 * kokomi.js uses [cannon.js](https://github.com/pmndrs/cannon-es) for physics. Just create mesh and body, and add it to base's physics!
 *
 * Demo: https://codesandbox.io/s/kokomi-js-physics-tffxge?file=/src/app.ts
 */
declare class Physics extends Component {
    world: CANNON.World;
    meshPhysicsObjects: MeshPhysicsObject[];
    constructor(base: Base);
    add({ mesh, body, copyPosition, copyQuaternion, }: MeshPhysicsObjectParams): void;
    tick(): void;
    sync(): void;
    update(time: number): void;
}
declare class MeshPhysicsObject {
    mesh: THREE.Mesh | THREE.Object3D;
    body: CANNON.Body;
    copyPosition: boolean;
    copyQuaternion: boolean;
    constructor(mesh: THREE.Mesh | THREE.Object3D, body: CANNON.Body, copyPosition?: boolean, copyQuaternion?: boolean);
}
export interface MeshPhysicsObjectParams {
    mesh: THREE.Mesh | THREE.Object3D;
    body: CANNON.Body;
    copyPosition?: boolean;
    copyQuaternion?: boolean;
}
export { Physics, MeshPhysicsObject };
