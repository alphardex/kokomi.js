import * as THREE from "three";

import type { Base } from "../base/base";
import { Component } from "../components/component";

export interface ThirdPersonCameraConfig {
  camera: THREE.Camera;
  offset: THREE.Vector3;
  lookAt: THREE.Vector3;
  isQuaternionApplied: boolean;
}

/**
 * Reference: https://www.youtube.com/watch?v=UuNPHOJ_V5o&t=483s&ab_channel=SimonDev
 */
class ThirdPersonCamera extends Component {
  target: THREE.Object3D;
  camera: THREE.Camera;
  currentPosition: THREE.Vector3;
  currentLookAt: THREE.Vector3;
  offset: THREE.Vector3;
  lookAt: THREE.Vector3;
  enabled: boolean;
  isQuaternionApplied: boolean;
  constructor(
    base: Base,
    target: THREE.Object3D,
    config: Partial<ThirdPersonCameraConfig> = {}
  ) {
    super(base);

    this.target = target;

    const {
      camera = this.base.camera,
      offset = new THREE.Vector3(0, 0, -2),
      lookAt = target.position.clone(),
      isQuaternionApplied = false,
    } = config;
    this.camera = camera;
    this.offset = offset;
    this.lookAt = lookAt;
    this.isQuaternionApplied = isQuaternionApplied;

    this.currentPosition = new THREE.Vector3();
    this.currentLookAt = new THREE.Vector3();

    this.enabled = true;
  }
  get idealOffset() {
    const offset = this.offset.clone();
    if (this.isQuaternionApplied) {
      offset.applyQuaternion(this.target.quaternion);
    }
    offset.add(this.target.position);
    return offset;
  }
  get idealLookAt() {
    const lookAt = this.lookAt.clone();
    if (this.isQuaternionApplied) {
      lookAt.applyQuaternion(this.target.quaternion);
    }
    lookAt.add(this.target.position);
    return lookAt;
  }
  update(time: number): void {
    if (!this.enabled) {
      return;
    }

    const { idealOffset, idealLookAt } = this;

    const dt = this.base.clock.deltaTime;
    const dt2 = 1 - Math.pow(0.001, dt);

    this.currentPosition.lerp(idealOffset, dt2);
    this.currentLookAt.lerp(idealLookAt, dt2);

    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentLookAt);
  }
}

export { ThirdPersonCamera };
