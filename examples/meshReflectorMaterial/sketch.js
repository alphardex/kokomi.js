import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 3, 9);

    new kokomi.OrbitControls(this);

    const stage = new kokomi.Stage(this);
    stage.addExisting();

    const geo = new THREE.TorusGeometry(3, 1, 32, 100);
    const mat = new THREE.MeshBasicMaterial();
    const mesh = new THREE.Mesh(geo, mat);
    this.scene.add(mesh);

    const ground = new THREE.Mesh();
    const groundGeo = new THREE.PlaneGeometry(20, 20);
    const groundMat = new kokomi.MeshReflectorMaterial(this, ground, {
      resolution: 512,
      blur: [1000, 1000],
      mixBlur: 1,
      mirror: 0.5,
    });
    ground.geometry = groundGeo;
    ground.material = groundMat.material;
    this.scene.add(ground);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -4;
  }
}
