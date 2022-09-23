import type { Base } from "../base/base";
import { Component } from "../components/component";
import { ScreenQuad } from "./screenQuad";
import * as marcher from "marcher.js";
declare class RayMarchingQuad extends Component {
    screenQuad: ScreenQuad | null;
    marcher: marcher.Marcher;
    constructor(base: Base, marcher: marcher.Marcher);
    render(): void;
}
export { RayMarchingQuad };
