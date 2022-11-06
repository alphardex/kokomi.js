import * as THREE from "three";
import { InteractionManager } from "three.interactive";
import type { EffectComposer } from "three-stdlib";
import { Animator } from "../components";
import { Clock } from "../components";
import { Physics } from "../components";
import { Resizer } from "../components";
import { IMouse } from "../components";
export interface BaseConfig {
    hello: boolean;
}
/**
 * By extending this class, you can kickstart a basic three.js scene easily.
 *
 * Demo: https://kokomi-js.vercel.app/examples/#base
 */
declare class Base {
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    container: HTMLElement;
    animator: Animator;
    interactionManager: InteractionManager;
    composer: EffectComposer | null;
    clock: Clock;
    iMouse: IMouse;
    physics: Physics;
    resizer: Resizer;
    constructor(sel?: string, config?: Partial<BaseConfig>);
    addEventListeners(): void;
    update(fn: any): void;
    init(): void;
}
export { Base };
