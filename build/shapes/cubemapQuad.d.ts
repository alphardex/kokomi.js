import type { Base } from "../base/base";
import { PlaneConfig, ScreenQuad } from "./screenQuad";
declare class CubemapQuad extends ScreenQuad {
    constructor(base: Base, config?: Partial<PlaneConfig>);
}
export { CubemapQuad };
