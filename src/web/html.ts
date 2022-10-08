import * as THREE from "three";

import type { Base } from "../base/base";
import { Component } from "../components/component";

import {
  calcObjectPosition,
  isObjectBehindCamera,
  isObjectVisible,
  objectZIndex,
} from "../utils";

export interface HtmlConfig {
  visibleClassName: string;
  xPropertyName: string;
  yPropertyName: string;
  zIndexPropertyName: string;
  occlude: THREE.Object3D[];
}

/**
 * It can help you merge HTML elements into the WebGL world by converting 3D positions to 2D positions.
 * If element is visible, it will have a `visible` CSS class (can be customized), and for 2D position it will have 3 CSS variables `--x`, `--y` and `--z-index` (can be customized too)
 *
 * Demo: https://codesandbox.io/s/kokomi-js-html-w0qfmr?file=/src/components/sphereWordCloud.ts
 */
class Html extends Component {
  el: HTMLElement;
  position: THREE.Vector3;
  visibleClassName: string;
  xPropertyName: string;
  yPropertyName: string;
  zIndexPropertyName: string;
  raycaster: THREE.Raycaster;
  occlude: THREE.Object3D[];
  visibleToggle: boolean;
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
      zIndexPropertyName = "--z-index",
      occlude = [],
    } = config;
    this.visibleClassName = visibleClassName;
    this.xPropertyName = xPropertyName;
    this.yPropertyName = yPropertyName;
    this.zIndexPropertyName = zIndexPropertyName;

    this.raycaster = new THREE.Raycaster();
    this.occlude = occlude;

    this.visibleToggle = true;
  }
  get domPosition() {
    return calcObjectPosition(this.position, this.base.camera);
  }
  get zIndex() {
    return objectZIndex(this.position, this.base.camera);
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
    if (!this.visibleToggle) {
      return false;
    }
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
  setZIndex(zIndex = 0) {
    this.el?.style.setProperty(this.zIndexPropertyName, `${zIndex}`);
  }
  syncPosition() {
    this.translate(this.domPosition);

    if (this.zIndex) {
      this.setZIndex(this.zIndex);
    }
  }
  makeVisible() {
    this.visibleToggle = true;
  }
  makeInvisible() {
    this.visibleToggle = false;
  }
  update(time: number): void {
    this.syncPosition();
    if (this.visible) {
      this.show();
    } else {
      this.hide();
    }
  }
}

export { Html };
