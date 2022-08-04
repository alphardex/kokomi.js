import * as THREE from "three";

import { Component } from "./component";
import { Base } from "../base/base";

class IMouse extends Component {
  mouse: THREE.Vector2;
  mouseDOM: THREE.Vector2;
  constructor(base: Base) {
    super(base);

    const mouse = new THREE.Vector2(0, 0);
    this.mouse = mouse;

    const mouseDOM = new THREE.Vector2(0, 0);
    this.mouseDOM = mouseDOM;
  }
  listenForMouse() {
    window.addEventListener("mousemove", (e) => {
      const iMouseNew = new THREE.Vector2(
        e.clientX,
        window.innerHeight - e.clientY
      );
      this.mouse = iMouseNew;

      const mouseDOM = new THREE.Vector2(e.clientX, e.clientY);
      this.mouseDOM = mouseDOM;
    });
    window.addEventListener("touchstart", (e) => {
      const iMouseNew = new THREE.Vector2(
        e.touches[0].clientX,
        window.innerHeight - e.touches[0].clientY
      );
      this.mouse = iMouseNew;

      const mouseDOM = new THREE.Vector2(
        e.touches[0].clientX,
        e.touches[0].clientY
      );
      this.mouseDOM = mouseDOM;
    });
    window.addEventListener("touchmove", (e) => {
      const iMouseNew = new THREE.Vector2(
        e.touches[0].clientX,
        window.innerHeight - e.touches[0].clientY
      );
      this.mouse = iMouseNew;

      const mouseDOM = new THREE.Vector2(
        e.touches[0].clientX,
        e.touches[0].clientY
      );
      this.mouseDOM = mouseDOM;
    });
  }
}

export { IMouse };
