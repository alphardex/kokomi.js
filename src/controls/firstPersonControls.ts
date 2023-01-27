import * as THREE from "three";

import type { Base } from "../base/base";

import { Component } from "../components/component";

import { PointerLockControls } from "three-stdlib";

export interface FirstPersonControlsConfig {
  xSpeed: number;
  zSpeed: number;
}

/**
 * Reference: https://github.com/mrdoob/three.js/blob/master/examples/misc_controls_pointerlock.html
 */
class FirstPersonControls extends Component {
  xSpeed: number;
  zSpeed: number;
  fpControls: PointerLockControls;
  velocity: THREE.Vector3;
  direction: THREE.Vector3;
  moveForward: boolean;
  moveBackward: boolean;
  moveLeft: boolean;
  moveRight: boolean;
  constructor(base: Base, config: Partial<FirstPersonControlsConfig> = {}) {
    super(base);

    const { xSpeed = 1, zSpeed = 1 } = config;
    this.xSpeed = xSpeed;
    this.zSpeed = zSpeed;

    this.fpControls = new PointerLockControls(this.base.camera, document.body);

    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;

    this.listenForEvents();
  }
  lock() {
    this.fpControls.lock();
  }
  listenForEvents() {
    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case "ArrowUp":
        case "KeyW":
          this.moveForward = true;
          break;

        case "ArrowLeft":
        case "KeyA":
          this.moveLeft = true;
          break;

        case "ArrowDown":
        case "KeyS":
          this.moveBackward = true;
          break;

        case "ArrowRight":
        case "KeyD":
          this.moveRight = true;
          break;
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case "ArrowUp":
        case "KeyW":
          this.moveForward = false;
          break;

        case "ArrowLeft":
        case "KeyA":
          this.moveLeft = false;
          break;

        case "ArrowDown":
        case "KeyS":
          this.moveBackward = false;
          break;

        case "ArrowRight":
        case "KeyD":
          this.moveRight = false;
          break;
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
  }
  update(): void {
    const {
      velocity,
      direction,
      moveForward,
      moveBackward,
      moveLeft,
      moveRight,
    } = this;
    const delta = this.base.clock.deltaTime;
    const controls = this.fpControls;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize(); // this ensures consistent movements in all directions

    if (moveForward || moveBackward)
      velocity.z -= direction.z * 40.0 * delta * this.zSpeed;
    if (moveLeft || moveRight)
      velocity.x -= direction.x * 40.0 * delta * this.xSpeed;

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);
  }
}

export { FirstPersonControls };
