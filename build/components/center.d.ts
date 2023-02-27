import * as THREE from "three";
import { Component } from "./component";
import { Base } from "../base/base";
import { getBound } from "../utils";
export interface CenterConfig {
    top?: boolean;
    right?: boolean;
    bottom?: boolean;
    left?: boolean;
    front?: boolean;
    back?: boolean;
    disable?: boolean;
    disableX?: boolean;
    disableY?: boolean;
    disableZ?: boolean;
    precise?: boolean;
}
declare class Center extends Component {
    top?: boolean;
    right?: boolean;
    bottom?: boolean;
    left?: boolean;
    front?: boolean;
    back?: boolean;
    disable?: boolean;
    disableX?: boolean;
    disableY?: boolean;
    disableZ?: boolean;
    precise?: boolean;
    group: THREE.Group;
    groupOuter: THREE.Group;
    groupInner: THREE.Group;
    bound: ReturnType<typeof getBound> | null;
    constructor(base: Base, config?: Partial<CenterConfig>);
    addExisting(): void;
    add(...object: THREE.Object3D[]): void;
    adjustPosition(): void;
}
export { Center };
