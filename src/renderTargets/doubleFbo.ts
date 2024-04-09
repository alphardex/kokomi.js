import type { Base } from "../base/base";
import { Component } from "../components/component";

import { FBO, FBOConfig } from "./fbo";

export interface DoubleFBOConfig extends FBOConfig {}

class DoubleFBO extends Component {
  readFBO: FBO;
  writeFBO: FBO;
  constructor(base: Base, options: Partial<DoubleFBOConfig> = {}) {
    super(base);

    const readFBO = new FBO(this.base, options);
    this.readFBO = readFBO;
    const writeFBO = new FBO(this.base, options);
    this.writeFBO = writeFBO;
  }
  swap() {
    [this.readFBO, this.writeFBO] = [this.writeFBO, this.readFBO];
  }
}

export { DoubleFBO };
