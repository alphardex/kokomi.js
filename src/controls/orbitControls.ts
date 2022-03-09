import type { Base } from "../base/base";
import { Component } from "../components/component";

import { OrbitControls as OrbitControlsImpl } from "three-stdlib";

class OrbitControls extends Component {
  controls: OrbitControlsImpl;
  constructor(base: Base) {
    super(base);

    const controls = new OrbitControlsImpl(
      base.camera,
      base.renderer.domElement
    );
    this.controls = controls;
    controls.enableDamping = true;
  }
  update(time: number): void {
    this.controls.update();
  }
}

export { OrbitControls };
