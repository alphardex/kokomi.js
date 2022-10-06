import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry.js";

import { sphubeFunction } from "../utils/parametric";

class SphubeGeometry extends ParametricGeometry {
  constructor(slices?: number, stacks?: number) {
    super(sphubeFunction, slices, stacks);
  }
}

export { SphubeGeometry };
