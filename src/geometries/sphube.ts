import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry.js";

import { sphubeFunction } from "../maths";

class SphubeGeometry extends ParametricGeometry {
  constructor(slices?: number, stacks?: number) {
    super(sphubeFunction, slices, stacks);
  }
}

export { SphubeGeometry };
