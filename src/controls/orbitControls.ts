import type { Base } from "../base/base";
import { Component } from "../components/component";

import { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export interface OrbitControlsConfig {
  enableDamping: boolean;
}

/**
 * A drop-in orbitControls
 */
class OrbitControls extends Component {
  controls: OrbitControlsImpl;
  constructor(base: Base, config: Partial<OrbitControlsConfig> = {}) {
    super(base);

    const { enableDamping = true } = config;

    const controls = new OrbitControlsImpl(
      base.camera,
      base.renderer.domElement
    );
    this.controls = controls;
    controls.enableDamping = enableDamping;
  }
  update(time: number): void {
    this.controls.update();
  }
}

export { OrbitControls };
