import * as THREE from "three";

import type { Base } from "../base/base";
import { Component } from "../components/component";

import { OrbitControls } from "../controls";

import { BasicPanorama } from "./basicPanorama";

export interface ViewerConfig {
  fov: number;
}

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
    this.currentPanorama = panorama;
  }
  setPanorama(panorama: BasicPanorama, duration = 0.5) {
    this.currentPanorama?.fadeOut(duration);
    panorama?.fadeIn(duration);
    this.currentPanorama = panorama;
  }
}

export { Viewer };
