import * as THREE from "three";

import { Component } from "./component";
import { Base } from "../base/base";

export interface FloatConfig {
  speed: number;
  rotationIntensity: number;
  floatIntensity: number;
  floatingRange: [number?, number?];
}

/**
 * A class that can make objects float.
 */
class Float extends Component {
  g: THREE.Group;
  speed: number;
  rotationIntensity: number;
  floatIntensity: number;
  floatingRange: [number?, number?];
  offset: number;
  constructor(base: Base, config: Partial<FloatConfig> = {}) {
    super(base);

    const {
      speed = 1,
      rotationIntensity = 1,
      floatIntensity = 1,
      floatingRange = [-0.1, 0.1],
    } = config;
    this.speed = speed;
    this.rotationIntensity = rotationIntensity;
    this.floatIntensity = floatIntensity;
    this.floatingRange = floatingRange;

    const g = new THREE.Group();
    this.g = g;
    this.base.scene.add(this.g);

    this.offset = Math.random() * 114514;
  }
  add(...object: THREE.Object3D[]) {
    this.g.add(...object);
  }
  update(time: number): void {
    const { speed, rotationIntensity, floatIntensity, floatingRange, offset } =
      this;
    const t = offset + this.base.clock.elapsedTime;
    this.g.rotation.x = (Math.cos((t / 4) * speed) / 8) * rotationIntensity;
    this.g.rotation.y = (Math.sin((t / 4) * speed) / 8) * rotationIntensity;
    this.g.rotation.z = (Math.sin((t / 4) * speed) / 20) * rotationIntensity;
    let yPosition = Math.sin((t / 4) * speed) / 10;
    yPosition = THREE.MathUtils.mapLinear(
      yPosition,
      -0.1,
      0.1,
      floatingRange?.[0] ?? -0.1,
      floatingRange?.[1] ?? 0.1
    );
    this.g.position.y = yPosition * floatIntensity;
  }
}

export { Float };
