import type { Base } from "../base/base";
import { Component } from "../components/component";

import { ScreenQuad } from "./screenQuad";

import * as marcher from "marcher.js";

class RayMarchingQuad extends Component {
  screenQuad: ScreenQuad | null;
  marcher: marcher.Marcher;
  constructor(base: Base, marcher: marcher.Marcher) {
    super(base);

    this.screenQuad = null;
    this.marcher = marcher;
  }
  render() {
    if (this.screenQuad) {
      this.base.scene.remove(this.screenQuad.mesh);
    }
    const screenQuad = new ScreenQuad(this.base, {
      fragmentShader: this.marcher.fragmentShader,
      shadertoyMode: true,
    });
    screenQuad.addExisting();
    this.screenQuad = screenQuad;
  }
}

export { RayMarchingQuad };
