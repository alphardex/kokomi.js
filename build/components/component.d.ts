import { type Emitter } from "mitt";
import type { Base } from "../base/base";
/**
 * By extending this class, you can make your components keep their own state and animation.
 *
 * Demo: https://kokomi-js.vercel.app/examples/#component
 */
declare class Component {
    base: Base;
    emitter: Emitter<any>;
    container: THREE.Scene;
    constructor(base: Base);
    addExisting(): void;
    update(time: number): void;
    on(type: string, handler: any): void;
    off(type: string, handler: any): void;
    emit(type: string, event?: any): void;
}
export { Component };
