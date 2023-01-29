import { Component } from "./component";
import { Base } from "../base/base";
declare class Resizer extends Component {
    enabled: boolean;
    constructor(base: Base);
    get aspect(): number;
    resize(): void;
    listenForResize(): void;
    enable(): void;
    disable(): void;
}
export { Resizer };
