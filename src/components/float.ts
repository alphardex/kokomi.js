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
  group: THREE.Group;
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

    const group = new THREE.Group();
    this.group = group;

    this.offset = Math.random() * 114514;
  }
  addExisting(): void {
    this.container.add(this.group);
  }
  add(...object: THREE.Object3D[]) {
    this.group.add(...object);
  }
  update(time: number): void {
    const { speed, rotationIntensity, floatIntensity, floatingRange, offset } =
      this;
    const t = offset + this.base.clock.elapsedTime;
    this.group.rotation.x = (Math.cos((t / 4) * speed) / 8) * rotationIntensity;
    this.group.rotation.y = (Math.sin((t / 4) * speed) / 8) * rotationIntensity;
    this.group.rotation.z =
      (Math.sin((t / 4) * speed) / 20) * rotationIntensity;
    let yPosition = Math.sin((t / 4) * speed) / 10;
    yPosition = THREE.MathUtils.mapLinear(
      yPosition,
      -0.1,
      0.1,
      floatingRange?.[0] ?? -0.1,
      floatingRange?.[1] ?? 0.1
    );
    this.group.position.y = yPosition * floatIntensity;
  }
}

export { Float };
