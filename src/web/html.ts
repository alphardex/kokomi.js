import * as THREE from "three";

import type { Base } from "../base/base";
import { Component } from "../components/component";

import {
  calcObjectPosition,
  calcTransformFov,
  epsilon,
  getCameraCSSMatrix,
  getObjectCSSMatrix,
  isObjectBehindCamera,
  isObjectVisible,
  objectZIndex,
} from "../utils";

export interface HtmlConfig {
  visibleClassName: string;
  xPropertyName: string;
  yPropertyName: string;
  zIndexPropertyName: string;
  viewportWidthName: string;
  viewportHeightName: string;
  perspectiveName: string;
  transformOuterName: string;
  transformInnerName: string;
  occlude: THREE.Object3D[];
  transform: boolean;
  distanceFactor: number;
  group: THREE.Object3D | null;
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
  viewportWidthName: string;
  viewportHeightName: string;
  perspectiveName: string;
  transformOuterName: string;
  transformInnerName: string;
  raycaster: THREE.Raycaster;
  occlude: THREE.Object3D[];
  transform: boolean;
  distanceFactor: number;
  parentGroup: THREE.Object3D | null;
  group: THREE.Object3D;
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
      viewportWidthName = "--viewport-width",
      viewportHeightName = "--viewport-height",
      perspectiveName = "--perspective",
      transformOuterName = "--transform-outer",
      transformInnerName = "--transform-inner",
      occlude = [],
      transform = false,
      distanceFactor = 0,
      group = null,
    } = config;
    this.visibleClassName = visibleClassName;
    this.xPropertyName = xPropertyName;
    this.yPropertyName = yPropertyName;
    this.zIndexPropertyName = zIndexPropertyName;

    this.viewportWidthName = viewportWidthName;
    this.viewportHeightName = viewportHeightName;
    this.perspectiveName = perspectiveName;
    this.transformOuterName = transformOuterName;
    this.transformInnerName = transformInnerName;

    this.raycaster = new THREE.Raycaster();
    this.occlude = occlude;

    this.transform = transform;
    this.distanceFactor = distanceFactor;
    this.parentGroup = group;
    this.group = new THREE.Group();

    this.group.position.copy(this.position);

    this.visibleToggle = true;
  }
  get domPosition() {
    return calcObjectPosition(this.group, this.base.camera);
  }
  get zIndex() {
    return objectZIndex(this.group, this.base.camera);
  }
  get isBehindCamera() {
    return isObjectBehindCamera(this.group, this.base.camera);
  }
  get isVisible() {
    return isObjectVisible(
      this.group,
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
  get viewportSize() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }
  get fov() {
    return calcTransformFov(this.base.camera);
  }
  get perspective() {
    return (this.base.camera as THREE.OrthographicCamera).isOrthographicCamera
      ? ""
      : this.fov;
  }
  get transformOuter() {
    const camera = this.base.camera;
    const { isOrthographicCamera, top, left, bottom, right } =
      camera as THREE.OrthographicCamera;
    const { fov } = this;
    const widthHalf = window.innerWidth / 2;
    const heightHalf = window.innerHeight / 2;
    const cameraMatrix = getCameraCSSMatrix(camera.matrixWorldInverse);
    const cameraTransform = isOrthographicCamera
      ? `scale(${fov})translate(${epsilon(-(right + left) / 2)}px,${epsilon(
          (top + bottom) / 2
        )}px)`
      : `translateZ(${fov}px)`;
    return `${cameraTransform}${cameraMatrix}translate(${widthHalf}px,${heightHalf}px)`;
  }
  get transformInner() {
    const matrix = this.group.matrixWorld;
    return getObjectCSSMatrix(matrix, 1 / ((this.distanceFactor || 10) / 400));
  }
  addExisting() {
    if (this.parentGroup) {
      this.parentGroup.add(this.group);
    } else {
      this.container.add(this.group);
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

    if (this.transform) {
      this.setTransformProperty();
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
  setTransformProperty() {
    this.el?.style.setProperty(
      this.viewportWidthName,
      `${this.viewportSize.width}px`
    );
    this.el?.style.setProperty(
      this.viewportHeightName,
      `${this.viewportSize.height}px`
    );
    this.el?.style.setProperty(this.perspectiveName, `${this.perspective}px`);
    this.el?.style.setProperty(this.transformOuterName, this.transformOuter);
    this.el?.style.setProperty(this.transformInnerName, this.transformInner);
  }
}

export { Html };
