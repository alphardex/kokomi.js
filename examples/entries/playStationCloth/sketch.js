import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    const camera = new THREE.OrthographicCamera();
    camera.position.set(0, 0, 2);
    this.camera = camera;

    new kokomi.OrbitControls(this);

    const cm = new kokomi.CustomMesh(this, {
      baseMaterial: new THREE.ShaderMaterial(),
      geometry: new THREE.PlaneGeometry(2, 2, 128, 128),
      vertexShader,
      fragmentShader,
      materialParams: {
        side: THREE.DoubleSide,
        transparent: true,
      },
    });
    cm.addExisting();
  }
}
