import * as THREE from "three";

import { Component } from "./component";
import { Base } from "../base/base";

class IMouse extends Component {
  mouse: THREE.Vector2;
  constructor(base: Base) {
    super(base);

    const mouse = new THREE.Vector2(0, 0);
    this.mouse = mouse;
  }
  listenForMouse() {
    window.addEventListener("mousemove", (e) => {
      const iMouseNew = new THREE.Vector2(
        e.clientX,
        window.innerHeight - e.clientY
      );
      this.mouse = iMouseNew;
    });
    window.addEventListener("touchstart", (e) => {
      const iMouseNew = new THREE.Vector2(
        e.touches[0].clientX,
        window.innerHeight - e.touches[0].clientY
      );
      this.mouse = iMouseNew;
    });
    window.addEventListener("touchmove", (e) => {
      const iMouseNew = new THREE.Vector2(
        e.touches[0].clientX,
        window.innerHeight - e.touches[0].clientY
      );
      this.mouse = iMouseNew;
    });
  }
}

export { IMouse };
