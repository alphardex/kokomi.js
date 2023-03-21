import type { Base } from "../base/base";
import { Component } from "../components/component";
import { ScreenQuad } from "./screenQuad";
import * as marcher from "marcher.js";
/**
 * Also a screenQuad, but for Raymarching.
 * It's used with [marcher.js](https://github.com/alphardex/marcher.js)——a Raymarching code generator library.
 *
 * Demo: https://codesandbox.io/s/kokomi-js-raymarching-starter-lk17vs?file=/src/app.ts
 */
declare class RayMarchingQuad extends Component {
    screenQuad: ScreenQuad | null;
    marcher: marcher.Marcher;
    constructor(base: Base, marcher: marcher.Marcher);
    render(): void;
}
export { RayMarchingQuad };
