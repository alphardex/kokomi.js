import type { Base } from "../base/base";
/**
 * By extending this class, you can make your components keep their own state and animation.
 *
 * Demo: https://kokomi-js.vercel.app/examples/#component
 */
declare class Component {
    base: Base;
    constructor(base: Base);
    addExisting(): void;
    update(time: number): void;
}
export { Component };
