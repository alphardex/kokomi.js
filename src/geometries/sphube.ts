import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry.js";

import { sphubeFunction } from "../utils/parametric";

/**
 * A [Sphube](https://arxiv.org/pdf/1604.02174.pdf) geometry
 *
 * Demo: https://kokomi-js.vercel.app/examples/#sphube
 */
class SphubeGeometry extends ParametricGeometry {
  constructor(slices?: number, stacks?: number) {
    super(sphubeFunction, slices, stacks);
  }
}

export { SphubeGeometry };
