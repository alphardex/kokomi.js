import * as THREE from "three";

import type { Base } from "../base/base";
import { Component } from "../components/component";

import CameraControlsImpl from "camera-controls";

/**
 * A wrapper for https://github.com/yomotsu/camera-controls
 */
class CameraControls extends Component {
  controls: CameraControlsImpl;
  constructor(base: Base) {
    super(base);

    CameraControlsImpl.install({ THREE });

    const controls = new CameraControlsImpl(
      base.camera,
      base.renderer.domElement
    );
    this.controls = controls;
  }
  update(time: number): void {
    this.controls.update(this.base.clock.deltaTime);
  }
}

export { CameraControls };
