import * as THREE from "three";

import type { Base } from "../base/base";
import { Component } from "../components/component";

export interface FBOConfig {
  width: number;
  height: number;
  samples: number;
}

class FBO extends Component {
  rt: THREE.WebGLRenderTarget;
  constructor(base: Base, config: Partial<FBOConfig> = {}) {
    super(base);

    const {
      width = window.innerWidth * window.devicePixelRatio,
      height = window.innerHeight * window.devicePixelRatio,
      samples = 0,
    } = config;

    const rt = new THREE.WebGLRenderTarget(width, height);
    this.rt = rt;
    if (samples) {
      rt.samples = samples;
    }

    this.base.resizer.on("resize", () => {
      this.rt.setSize(
        window.innerWidth * window.devicePixelRatio,
        window.innerHeight * window.devicePixelRatio
      );
    });
  }
}

export { FBO };
