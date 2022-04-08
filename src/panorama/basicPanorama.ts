import * as THREE from "three";

import type { Base } from "../base/base";
import { Component } from "../components/component";

import mitt, { type Emitter } from "mitt";

import gsap from "gsap";

import { Html } from "../web";

export interface BasicPanoramaConfig {
  id: string;
  radius: number;
}

class BasicPanorama extends Component {
  id: string;
  material: THREE.MeshBasicMaterial;
  mesh: THREE.Mesh;
  emitter: Emitter<any>;
  infospots: Html[];
  isInfospotVisible: boolean;
  active: boolean;
  constructor(base: Base, config: Partial<BasicPanoramaConfig> = {}) {
    super(base);

    const { id = "", radius = 5000 } = config;

    this.id = id;

    const geometry = new THREE.SphereGeometry(radius, 60, 40);
    const material = new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      transparent: true,
      opacity: 1,
    });
    this.material = material;
    const mesh = new THREE.Mesh(geometry, material);
    this.mesh = mesh;

    this.emitter = mitt();

    this.infospots = [];
    this.isInfospotVisible = false;
    this.active = false;
  }
  addExisting(): void {
    const { base, mesh } = this;
    const { scene } = base;

    scene.add(mesh);
  }
  outputPosition() {
    const container = this.base.container || window;
    container.addEventListener("click", (event) => {
      const intersects = this.base.interactionManager.raycaster.intersectObject(
        this.mesh,
        true
      );
      const point = intersects[0].point.clone();
      const position = {
        x: point.x.toFixed(2),
        y: point.y.toFixed(2),
        z: point.z.toFixed(2),
      };
      const message = `${position.x}, ${position.y}, ${position.z}`;
      console.log(message);
      this.emitter.emit("click", point);
    });
  }
  show() {
    this.material.opacity = 1;
  }
  hide() {
    this.material.opacity = 0;
  }
  fadeIn(duration = 0.5) {
    return new Promise((resolve) => {
      gsap.fromTo(
        this.material,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration,
          onComplete() {
            resolve(true);
          },
        }
      );
    });
  }
  fadeOut(duration = 0.5) {
    return new Promise((resolve) => {
      gsap.fromTo(
        this.material,
        {
          opacity: 1,
        },
        {
          opacity: 0,
          duration,
          onComplete() {
            resolve(true);
          },
        }
      );
    });
  }
  add(infospot: Html) {
    this.infospots.push(infospot);
  }
  addGroup(infospots: Html[]) {
    for (const infospot of infospots) {
      this.add(infospot);
    }
  }
  update(time: number): void {
    for (const infospot of this.infospots) {
      if (!this.active) {
        infospot.makeInvisible();
      } else {
        if (this.isInfospotVisible) {
          infospot.makeVisible();
        } else {
          infospot.makeInvisible();
        }
      }
    }
  }
  toggleInfospotVisibility(isVisible: boolean | undefined = undefined) {
    const visible = isVisible
      ? isVisible
      : this.isInfospotVisible
      ? false
      : true;
    this.isInfospotVisible = visible;
  }
  onEnter(duration = 0.5) {
    this.active = true;
    this.toggleInfospotVisibility(true);
    this.fadeIn(duration);
  }
  onLeave(duration = 0.5) {
    this.active = false;
    this.toggleInfospotVisibility(false);
    this.fadeOut(duration);
  }
}

export { BasicPanorama };
