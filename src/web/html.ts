import * as THREE from "three";

import type { Base } from "../base/base";
import { Component } from "../components/component";

import { getScreenVector, isObjectBehindCamera } from "../utils";

class Html extends Component {
  el: HTMLElement;
  position: THREE.Vector3;
  constructor(
    base: Base,
    el: HTMLElement,
    position = new THREE.Vector3(0, 0, 0)
  ) {
    super(base);
    this.el = el;
    this.position = position;
  }
  get domPosition() {
    const screenVector = getScreenVector(this.position, this.base.camera);
    return { x: screenVector.x, y: screenVector.y };
  }
  get isBehindCamera() {
    return isObjectBehindCamera(this.position, this.base.camera);
  }
  show() {
    this.el.style.opacity = "1";
    this.el.style.pointerEvents = "auto";
  }
  hide() {
    this.el.style.opacity = "0";
    this.el.style.pointerEvents = "none";
  }
  translate({ x = 0, y = 0 }) {
    this.el.style.transform = `translate(${x}px, ${y}px)`;
  }
  syncPosition() {
    this.translate(this.domPosition);
  }
}

export { Html };
