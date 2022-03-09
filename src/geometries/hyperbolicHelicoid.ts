import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry";

import { hyperbolicHelicoidFunction } from "../maths";

class HyperbolicHelicoidGeometry extends ParametricGeometry {
  constructor(slices?: number, stacks?: number) {
    super(hyperbolicHelicoidFunction, slices, stacks);
  }
}

export { HyperbolicHelicoidGeometry };
