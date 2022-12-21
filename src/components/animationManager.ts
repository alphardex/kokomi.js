import * as THREE from "three";

import { Component } from "./component";
import { Base } from "../base/base";

/**
 * This class can manage the animations of a model.
 */
class AnimationManager extends Component {
  clips: THREE.AnimationClip[];
  root: THREE.Object3D;
  mixer: THREE.AnimationMixer;
  constructor(base: Base, clips: THREE.AnimationClip[], root: THREE.Object3D) {
    super(base);

    this.clips = clips;
    this.root = root;
    this.mixer = new THREE.AnimationMixer(root);
  }
  get names() {
    return this.clips.map((item) => item.name);
  }
  get actions() {
    return Object.fromEntries(
      this.clips.map((item) => [item.name, this.mixer.clipAction(item)])
    );
  }
  update(): void {
    this.mixer.update(this.base.clock.deltaTime);
  }
}

export { AnimationManager };
