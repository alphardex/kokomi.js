import * as THREE from "three";

import type { Base } from "../base/base";
import { Component } from "../components/component";

export interface FirstPersonCameraConfig {
  camera: THREE.Camera;
  phiSpeed: number;
  thetaSpeed: number;
  translation: THREE.Vector3;
}

/**
 * Reference: https://www.youtube.com/watch?v=oqKzxPMLWxo&t=28s&ab_channel=SimonDev
 */
class FirstPersonCamera extends Component {
  camera: THREE.Camera;
  rotation: THREE.Quaternion;
  translation: THREE.Vector3;
  phi: number;
  theta: number;
  phiSpeed: number;
  thetaSpeed: number;
  enabled: boolean;
  constructor(base: Base, config: Partial<FirstPersonCameraConfig> = {}) {
    super(base);

    const {
      camera = this.base.camera,
      phiSpeed = 8,
      thetaSpeed = 5,
      translation = new THREE.Vector3(0, 2, 0),
    } = config;

    this.camera = camera;

    this.rotation = new THREE.Quaternion();
    this.translation = translation;
    this.phi = 0;
    this.theta = 0;
    this.phiSpeed = phiSpeed;
    this.thetaSpeed = thetaSpeed;

    this.enabled = true;
  }
  update(time: number): void {
    if (!this.enabled) {
      return;
    }

    this.updateRotation();
    this.updateCamera();
    this.updateTranslation();
  }
  updateRotation() {
    const xh = this.base.iMouse.mouseDOMDelta.x / window.innerWidth;
    const yh = this.base.iMouse.mouseDOMDelta.y / window.innerHeight;

    this.phi += -xh * this.phiSpeed;
    this.theta = THREE.MathUtils.clamp(
      this.theta + -yh * this.thetaSpeed,
      -Math.PI / 3,
      Math.PI / 3
    );

    const qx = new THREE.Quaternion();
    qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi);
    const qz = new THREE.Quaternion();
    qz.setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.theta);

    const q = new THREE.Quaternion();
    q.multiply(qx);
    q.multiply(qz);

    this.rotation.copy(q);
  }
  updateTranslation() {
    const fv =
      (this.base.keyboard.isUpKeyDown ? 1 : 0) +
      (this.base.keyboard.isDownKeyDown ? -1 : 0);
    const sv =
      (this.base.keyboard.isLeftKeyDown ? 1 : 0) +
      (this.base.keyboard.isRightKeyDown ? -1 : 0);

    const dt = this.base.clock.deltaTime;

    const qx = new THREE.Quaternion();
    qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi);

    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(qx);
    forward.multiplyScalar(fv * dt * 10);

    const left = new THREE.Vector3(-1, 0, 0);
    left.applyQuaternion(qx);
    left.multiplyScalar(sv * dt * 10);

    this.translation.add(forward);
    this.translation.add(left);
  }
  updateCamera() {
    this.camera.quaternion.copy(this.rotation);
    this.camera.position.copy(this.translation);
  }
}

export { FirstPersonCamera };
