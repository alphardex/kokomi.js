import * as THREE from "three";

import { Component } from "./component";
import { Base } from "../base/base";

import { getBound } from "../utils";

export interface CenterConfig {
  top?: boolean;
  right?: boolean;
  bottom?: boolean;
  left?: boolean;
  front?: boolean;
  back?: boolean;
  disable?: boolean;
  disableX?: boolean;
  disableY?: boolean;
  disableZ?: boolean;
  precise?: boolean;
}

class Center extends Component {
  top?: boolean;
  right?: boolean;
  bottom?: boolean;
  left?: boolean;
  front?: boolean;
  back?: boolean;
  disable?: boolean;
  disableX?: boolean;
  disableY?: boolean;
  disableZ?: boolean;
  precise?: boolean;
  group: THREE.Group;
  groupOuter: THREE.Group;
  groupInner: THREE.Group;
  bound: ReturnType<typeof getBound> | null;
  constructor(base: Base, config: Partial<CenterConfig> = {}) {
    super(base);

    const {
      top = false,
      right = false,
      bottom = false,
      left = false,
      front = false,
      back = false,
      disable = false,
      disableX = false,
      disableY = false,
      disableZ = false,
      precise = true,
    } = config;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.left = left;
    this.front = front;
    this.back = back;
    this.disable = disable;
    this.disableX = disableX;
    this.disableY = disableY;
    this.disableZ = disableZ;
    this.precise = precise;

    const group = new THREE.Group();
    this.group = group;

    const groupOuter = new THREE.Group();
    this.groupOuter = groupOuter;

    const groupInner = new THREE.Group();
    this.groupInner = groupInner;

    this.bound = null;

    this.adjustPosition();
  }
  addExisting(): void {
    this.container.add(this.group);
    this.group.add(this.groupOuter);
    this.groupOuter.add(this.groupInner);

    this.adjustPosition();
  }
  add(...object: THREE.Object3D[]) {
    this.groupInner.add(...object);

    this.adjustPosition();
  }
  adjustPosition() {
    const {
      top,
      right,
      bottom,
      left,
      front,
      back,
      disable,
      disableX,
      disableY,
      disableZ,
      precise,
    } = this;

    this.groupOuter.matrix.identity();

    const bound = getBound(this.groupInner, precise);
    this.bound = bound;

    const { center, width, height, depth } = bound;

    const vAlign = top ? height / 2 : bottom ? -height / 2 : 0;
    const hAlign = left ? -width / 2 : right ? width / 2 : 0;
    const dAlign = front ? depth / 2 : back ? -depth / 2 : 0;

    this.groupOuter.position.set(
      disable || disableX ? 0 : -center.x + hAlign,
      disable || disableY ? 0 : -center.y + vAlign,
      disable || disableZ ? 0 : -center.z + dAlign
    );
  }
}

export { Center };
