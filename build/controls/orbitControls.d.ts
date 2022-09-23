import type { Base } from "../base/base";
import { Component } from "../components/component";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
declare class OrbitControls extends Component {
    controls: OrbitControlsImpl;
    constructor(base: Base);
    update(time: number): void;
}
export { OrbitControls };
