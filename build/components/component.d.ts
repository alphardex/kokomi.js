import type { Base } from "../base/base";
declare class Component {
    base: Base;
    constructor(base: Base);
    addExisting(): void;
    update(time: number): void;
}
export { Component };
