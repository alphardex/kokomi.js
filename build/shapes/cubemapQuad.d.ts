import type { Base } from "../base/base";
import { PlaneConfig, ScreenQuad } from "./screenQuad";
/**
 * Also a screenQuad, but for cubemap.
 * It acts the same as Shadertoy's CubemapA.
 */
declare class CubemapQuad extends ScreenQuad {
    constructor(base: Base, config?: Partial<PlaneConfig>);
}
export { CubemapQuad };
