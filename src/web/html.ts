import * as THREE from "three";

import type { Base } from "../base/base";
import { Component } from "../components/component";

import {
  getScreenVector,
  isObjectBehindCamera,
  isObjectVisible,
} from "../utils";

export interface HtmlConfig {
  visibleClassName: string;
  xPropertyName: string;
  yPropertyName: string;
  occlude: THREE.Object3D[];
}

class Html extends Component {
  el: HTMLElement | null;
  position: THREE.Vector3;
  visibleClassName: string;
  xPropertyName: string;
  yPropertyName: string;
  raycaster: THREE.Raycaster;
  occlude: THREE.Object3D[];
  constructor(
    base: Base,
    el: HTMLElement,
    position = new THREE.Vector3(0, 0, 0),
    config: Partial<HtmlConfig> = {}
  ) {
    super(base);
    this.el = el;
    this.position = position;

    const {
      visibleClassName = "visible",
      xPropertyName = "--x",
      yPropertyName = "--y",
      occlude = [],
    } = config;
    this.visibleClassName = visibleClassName;
    this.xPropertyName = xPropertyName;
    this.yPropertyName = yPropertyName;

    this.raycaster = new THREE.Raycaster();
    this.occlude = occlude;
  }
  get domPosition() {
    const screenVector = getScreenVector(this.position, this.base.camera);
    return { x: screenVector.x, y: screenVector.y };
  }
  get isBehindCamera() {
    return isObjectBehindCamera(this.position, this.base.camera);
  }
  get isVisible() {
    return isObjectVisible(
      this.position,
      this.base.camera,
      this.raycaster,
      this.occlude
    );
  }
  get visible() {
    if (this.occlude.length === 0) {
      return !this.isBehindCamera;
    } else {
      return !this.isBehindCamera && this.isVisible;
    }
  }
  show() {
    this.el?.classList.add(this.visibleClassName);
  }
  hide() {
    this.el?.classList.remove(this.visibleClassName);
  }
  translate({ x = 0, y = 0 }) {
    this.el?.style.setProperty(this.xPropertyName, `${x}px`);
    this.el?.style.setProperty(this.yPropertyName, `${y}px`);
  }
  syncPosition() {
    this.translate(this.domPosition);
  }
  update(time: number): void {
    if (!this.visible) {
      this.hide();
    }
  }
}

export { Html };