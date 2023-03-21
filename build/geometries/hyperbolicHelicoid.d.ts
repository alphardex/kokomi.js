import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry.js";
/**
 * A [HyperbolicHelicoid](https://mathworld.wolfram.com/HyperbolicHelicoid.html) geometry
 *
 * Demo: https://kokomi-js.vercel.app/examples/#hyperbolicHelicoid
 */
declare class HyperbolicHelicoidGeometry extends ParametricGeometry {
    constructor(slices?: number, stacks?: number);
}
export { HyperbolicHelicoidGeometry };
