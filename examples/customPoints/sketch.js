import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 2);

    new kokomi.OrbitControls(this);

    const cm = new kokomi.CustomPoints(this, {
      baseMaterial: new THREE.ShaderMaterial(),
      geometry: new THREE.PlaneGeometry(1, 1, 16, 16),
      vertexShader,
      fragmentShader,
      materialParams: {
        side: THREE.DoubleSide,
      },
    });
    cm.addExisting();
  }
}
