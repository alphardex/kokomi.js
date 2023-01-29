import { Component } from "./component";
import { Base } from "../base/base";
import nipplejs from "nipplejs";
export interface JoystickConfig extends nipplejs.JoystickManagerOptions {
}
/**
 * An encapsuled class by [nipplejs](https://github.com/yoannmoinet/nipplejs).
 */
declare class Joystick extends Component {
    manager: nipplejs.JoystickManager;
    data: Partial<nipplejs.JoystickOutputData>;
    constructor(base: Base, config?: Partial<JoystickConfig>);
    listenForGesture(): void;
}
export { Joystick };
