import * as THREE from "three";
import { Component } from "./component";
import { Base } from "../base/base";
import type { EffectComposer } from "three-stdlib";
declare class Resizer extends Component {
    enabled: boolean;
    constructor(base: Base);
    get aspect(): number;
    resizeRenderer(renderer: THREE.WebGLRenderer): void;
    resizeComposer(composer: EffectComposer): void;
    resizeCamera(camera: THREE.Camera): void;
    resize(): void;
    listenForResize(): void;
    enable(): void;
    disable(): void;
}
export { Resizer };
