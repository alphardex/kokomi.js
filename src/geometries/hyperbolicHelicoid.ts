import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry.js";

import { hyperbolicHelicoidFunction } from "../utils/parametric";

/**
 * A [HyperbolicHelicoid](https://mathworld.wolfram.com/HyperbolicHelicoid.html) geometry
 */
class HyperbolicHelicoidGeometry extends ParametricGeometry {
  constructor(slices?: number, stacks?: number) {
    super(hyperbolicHelicoidFunction, slices, stacks);
  }
}

export { HyperbolicHelicoidGeometry };
