import * as THREE from "three";

import type { Base } from "../base/base";
import { Component } from "../components/component";

import { OrbitControls } from "../controls";

import { BasicPanorama } from "./basicPanorama";

export interface ViewerConfig {
  fov: number;
}

/**
 * TODO
 */
class Viewer extends Component {
  camera: THREE.PerspectiveCamera;
  orbitControls: OrbitControls;
  panoramas: BasicPanorama[];
  currentPanorama: BasicPanorama | null;
  constructor(base: Base, config: Partial<ViewerConfig> = {}) {
    super(base);

    const { fov = 60 } = config;

    const camera = new THREE.PerspectiveCamera(
      fov,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    camera.position.set(0, 0, 1);
    base.camera = camera;
    base.interactionManager.camera = camera;
    this.camera = camera;

    const orbitControls = new OrbitControls(base);
    this.orbitControls = orbitControls;

    this.panoramas = [];
    this.currentPanorama = null;
  }
  add(panorama: BasicPanorama) {
    panorama.addExisting();
    this.panoramas.push(panorama);
    panorama.onEnter(0);
    this.currentPanorama = panorama;
  }
  setPanorama(panorama: BasicPanorama, duration = 0.5) {
    if (panorama === this.currentPanorama) {
      return;
    }
    this.currentPanorama?.onLeave(duration);
    panorama?.onEnter(duration);
    this.currentPanorama = panorama;
  }
}

export { Viewer };
