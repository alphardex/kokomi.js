import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry.js";
/**
 * A [Sphube](https://arxiv.org/pdf/1604.02174.pdf) geometry
 *
 * Demo: https://kokomi-js.vercel.app/examples/#sphube
 */
declare class SphubeGeometry extends ParametricGeometry {
    constructor(slices?: number, stacks?: number);
}
export { SphubeGeometry };
