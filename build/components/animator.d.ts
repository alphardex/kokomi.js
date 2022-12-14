import type { Base } from "../base/base";
declare class Animator {
    base: Base;
    tasks: any[];
    constructor(base: Base);
    add(fn: any): void;
    update(): void;
    tick(time?: number): void;
}
export { Animator };
