import * as THREE from "three";

import { Component } from "./component";
import { Base } from "../base/base";

/**
 * An encapsuled class for `THREE.Clock`.
 * You can get `elapsedTime` and `deltaTime` from it.
 */
class Clock extends Component {
  clock: THREE.Clock;
  deltaTime: number;
  elapsedTime: number;
  constructor(base: Base) {
    super(base);

    const clock = new THREE.Clock();
    this.clock = clock;

    this.deltaTime = 0;
    this.elapsedTime = 0;
  }
  update(time: number): void {
    const newElapsedTime = this.clock.getElapsedTime();
    const deltaTime = newElapsedTime - this.elapsedTime;
    this.deltaTime = deltaTime;
    this.elapsedTime = newElapsedTime;
    this.emit("tick");
  }
}

export { Clock };
