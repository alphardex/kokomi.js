import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    new kokomi.OrbitControls(this);

    const geometry = new THREE.SphereGeometry(2, 162, 162);

    const cm = new kokomi.CustomMesh(this, {
      geometry,
      baseMaterial: new THREE.MeshPhysicalMaterial({
        roughness: 0.34,
        metalness: 0.05,
        reflectivity: 0,
        clearcoat: 0,
        side: THREE.DoubleSide,
      }),
      vertexShader,
      fragmentShader,
    });
    cm.mesh.scale.set(0.25, 0.25, 0.25);
    cm.addExisting();

    const ambiLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambiLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(1, 2, 3);
    this.scene.add(dirLight);

    this.camera.position.set(0, 0, 2);
  }
}
