import * as THREE from "three";
import { Component } from "./component";
import { Base } from "../base/base";
/**
 * This class can manage the animations of a model.
 */
declare class AnimationManager extends Component {
    clips: THREE.AnimationClip[];
    root: THREE.Object3D;
    mixer: THREE.AnimationMixer;
    constructor(base: Base, clips: THREE.AnimationClip[], root: THREE.Object3D);
    get names(): string[];
    get actions(): {
        [k: string]: THREE.AnimationAction;
    };
    update(): void;
}
export { AnimationManager };
